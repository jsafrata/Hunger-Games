import {
  Bid,
  FOOD_TYPES,
  FoodStock,
  FoodType,
  GameState,
  Player,
  RoundResult,
  AuctionOutcome,
} from "./types";

export const TOTAL_ROUNDS = 10;
export const STARTING_CASH = 100;
export const STARTING_FOOD = 10;

export function emptyStock(): FoodStock {
  return { Grain: 0, Meat: 0, Fruit: 0, Fish: 0 };
}

export function freshStock(): FoodStock {
  return { Grain: STARTING_FOOD, Meat: STARTING_FOOD, Fruit: STARTING_FOOD, Fish: STARTING_FOOD };
}

export function createInitialState(names: string[]): GameState {
  const shuffled = [...FOOD_TYPES].sort(() => Math.random() - 0.5);
  const players: Player[] = names.map((name, i) => ({
    id: i,
    name: name.trim() || `Player ${i + 1}`,
    cash: STARTING_CASH,
    food: freshStock(),
    produces: shuffled[i],
    alive: true,
  }));

  return {
    players,
    round: 1,
    totalRounds: TOTAL_ROUNDS,
    phase: "roundIntro",
    currentBidderIndex: 0,
    bidsThisRound: [],
    history: [],
  };
}

export function nextAlivePlayerIndex(
  players: Player[],
  fromIndex: number
): number | null {
  for (let i = fromIndex; i < players.length; i++) {
    if (players[i].alive) return i;
  }
  return null;
}

export function resolveRound(state: GameState): GameState {
  const players = state.players.map((p) => ({ ...p, food: { ...p.food } }));
  const auctions: AuctionOutcome[] = [];

  // 1. Production: each alive player gets +1 of their assigned food
  for (const p of players) {
    if (p.alive) {
      p.food[p.produces] += 1;
    }
  }

  // 2. Auctions: for each food type, the produced unit goes to the highest
  //    bidder. If the producer bid highest (or nobody else bid), the producer
  //    keeps it. Ties go to the producer; then to the lowest player id.
  for (const foodType of FOOD_TYPES) {
    const producer = players.find((p) => p.produces === foodType && p.alive);
    if (!producer) continue;

    const bidsForFood = state.bidsThisRound
      .filter((b) => b.foodType === foodType)
      .filter((b) => {
        const bidder = players.find((p) => p.id === b.playerId);
        return bidder?.alive;
      });

    // Producer's implicit reserve is 0 (they own the unit until outbid).
    const externalBids = bidsForFood.filter((b) => b.playerId !== producer.id);
    if (externalBids.length === 0) continue;

    // Pick highest external bid; ties broken by lowest player id.
    externalBids.sort((a, b) => {
      if (b.amount !== a.amount) return b.amount - a.amount;
      return a.playerId - b.playerId;
    });
    const top = externalBids[0];

    // Producer's own bid (if any) acts as a reserve price.
    const producerBid = bidsForFood.find((b) => b.playerId === producer.id);
    const reserve = producerBid?.amount ?? 0;

    if (top.amount <= reserve) continue; // producer keeps it

    const winner = players.find((p) => p.id === top.playerId)!;
    if (winner.cash < top.amount) continue; // invalid bid, skip (shouldn't happen due to UI validation)

    // Transfer: producer loses 1 unit, winner gains 1 unit; winner pays producer.
    producer.food[foodType] -= 1;
    winner.food[foodType] += 1;
    winner.cash -= top.amount;
    producer.cash += top.amount;

    auctions.push({
      foodType,
      producerId: producer.id,
      winnerId: winner.id,
      price: top.amount,
      wasContested: externalBids.length > 0,
    });
  }

  // 3. Consumption: each alive player consumes 1 of each food type
  for (const p of players) {
    if (!p.alive) continue;
    for (const ft of FOOD_TYPES) {
      p.food[ft] -= 1;
    }
  }

  // 4. Death check: any alive player with any food < 0 or equal to... wait,
  //    the rule is: "need at least 1 of each type at end of round". The phrasing
  //    "if you run out of any type of food by the end of round, then you die"
  //    means after consumption, any negative-or-zero stock kills.
  //    Subtracting 1 from a stock of 0 makes it -1, which counts as running out.
  //    We treat any food < 1 as death (so stock of exactly 0 at end also dies).
  const deaths: number[] = [];
  for (const p of players) {
    if (!p.alive) continue;
    const starved = FOOD_TYPES.some((ft) => p.food[ft] < 1);
    if (starved) {
      p.alive = false;
      p.diedOnRound = state.round;
      deaths.push(p.id);
    }
  }

  const result: RoundResult = {
    round: state.round,
    bids: [...state.bidsThisRound],
    auctions,
    deaths,
    snapshotAfter: players.map((p) => ({ ...p, food: { ...p.food } })),
  };

  const aliveCount = players.filter((p) => p.alive).length;
  const isLastRound = state.round >= state.totalRounds;
  const gameEnds = isLastRound || aliveCount <= 1;

  return {
    ...state,
    players,
    round: state.round + 1,
    phase: gameEnds ? "gameOver" : "reveal",
    currentBidderIndex: 0,
    bidsThisRound: [],
    history: [...state.history, result],
  };
}

export function startNextRound(state: GameState): GameState {
  const firstAlive = state.players.findIndex((p) => p.alive);
  return {
    ...state,
    phase: "roundIntro",
    currentBidderIndex: firstAlive === -1 ? 0 : firstAlive,
    bidsThisRound: [],
  };
}

export function submitBid(state: GameState, bid: Bid): GameState {
  const newBids = [...state.bidsThisRound, bid];

  // Find next alive player after the current one
  let nextIndex: number | null = null;
  for (let i = state.currentBidderIndex + 1; i < state.players.length; i++) {
    if (state.players[i].alive) {
      nextIndex = i;
      break;
    }
  }

  const aliveCount = state.players.filter((p) => p.alive).length;
  const allBidsIn = newBids.length >= aliveCount;

  if (allBidsIn) {
    return resolveRound({ ...state, bidsThisRound: newBids });
  }

  return {
    ...state,
    bidsThisRound: newBids,
    currentBidderIndex: nextIndex ?? state.currentBidderIndex,
    phase: "bidHandoff",
  };
}

export function beginBidding(state: GameState): GameState {
  return { ...state, phase: "bidding" };
}

export function rankPlayers(players: Player[]): Player[] {
  return [...players].sort((a, b) => {
    if (a.alive !== b.alive) return a.alive ? -1 : 1;
    if (!a.alive && !b.alive) {
      return (b.diedOnRound ?? 0) - (a.diedOnRound ?? 0);
    }
    const aFood = Object.values(a.food).reduce((s, v) => s + v, 0);
    const bFood = Object.values(b.food).reduce((s, v) => s + v, 0);
    if (a.cash + aFood !== b.cash + bFood) {
      return b.cash + bFood - (a.cash + aFood);
    }
    return a.id - b.id;
  });
}
