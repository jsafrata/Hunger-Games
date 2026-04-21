export const FOOD_TYPES = ["Grain", "Meat", "Fruit", "Fish"] as const;
export type FoodType = (typeof FOOD_TYPES)[number];

export type FoodStock = Record<FoodType, number>;

export type Player = {
  id: number;
  name: string;
  cash: number;
  food: FoodStock;
  produces: FoodType;
  alive: boolean;
  diedOnRound?: number;
};

export type Bid = {
  playerId: number;
  foodType: FoodType;
  amount: number;
};

export type RoundResult = {
  round: number;
  bids: Bid[];
  auctions: AuctionOutcome[];
  deaths: number[];
  snapshotAfter: Player[];
};

export type AuctionOutcome = {
  foodType: FoodType;
  producerId: number;
  winnerId: number;
  price: number;
  wasContested: boolean;
};

export type Phase =
  | "setup"
  | "roundIntro"
  | "bidding"
  | "bidHandoff"
  | "reveal"
  | "gameOver";

export type GameState = {
  players: Player[];
  round: number;
  totalRounds: number;
  phase: Phase;
  currentBidderIndex: number;
  bidsThisRound: Bid[];
  history: RoundResult[];
};
