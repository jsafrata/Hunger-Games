"use client";

import { useState } from "react";
import Setup from "@/components/Setup";
import RoundIntro from "@/components/RoundIntro";
import BidHandoff from "@/components/BidHandoff";
import BidInput from "@/components/BidInput";
import Reveal from "@/components/Reveal";
import GameOver from "@/components/GameOver";
import { FoodType, GameState } from "@/lib/types";
import {
  beginBidding,
  createInitialState,
  startNextRound,
  submitBid,
} from "@/lib/gameLogic";

export default function Home() {
  const [state, setState] = useState<GameState | null>(null);

  if (!state) {
    return <Setup onStart={(names) => setState(createInitialState(names))} />;
  }

  if (state.phase === "gameOver") {
    return <GameOver state={state} onRestart={() => setState(null)} />;
  }

  if (state.phase === "roundIntro") {
    return (
      <RoundIntro
        state={state}
        onBegin={() => setState(beginBidding(state))}
      />
    );
  }

  if (state.phase === "bidHandoff") {
    const nextPlayer = state.players[state.currentBidderIndex];
    return (
      <BidHandoff
        nextPlayer={nextPlayer}
        onReady={() => setState({ ...state, phase: "bidding" })}
      />
    );
  }

  if (state.phase === "bidding") {
    const currentPlayer = state.players[state.currentBidderIndex];
    return (
      <BidInput
        player={currentPlayer}
        round={state.round}
        onSubmit={(foodType: FoodType, amount: number) => {
          const next = submitBid(state, {
            playerId: currentPlayer.id,
            foodType,
            amount,
          });
          setState(next);
        }}
      />
    );
  }

  if (state.phase === "reveal") {
    return (
      <Reveal
        state={state}
        onContinue={() => setState(startNextRound(state))}
      />
    );
  }

  return null;
}
