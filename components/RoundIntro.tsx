"use client";

import { GameState } from "@/lib/types";
import PlayerCard from "./PlayerCard";

type Props = {
  state: GameState;
  onBegin: () => void;
};

export default function RoundIntro({ state, onBegin }: Props) {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex items-baseline justify-between mb-6">
        <h1 className="text-3xl font-bold">
          Round {state.round} / {state.totalRounds}
        </h1>
        <span className="text-gray-400">
          {state.players.filter((p) => p.alive).length} alive
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {state.players.map((p) => (
          <PlayerCard key={p.id} player={p} />
        ))}
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 mb-6 text-sm text-gray-300">
        <p className="mb-1">
          <strong>Ready to bid.</strong> Each player will take turns entering a
          private bid. Pass the device around so bids stay secret.
        </p>
        <p>
          Reminder: you&apos;ll consume 1 of each food at round end. You start
          the round with the stocks shown above.
        </p>
      </div>

      <button
        onClick={onBegin}
        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded transition"
      >
        Begin Bidding
      </button>
    </div>
  );
}
