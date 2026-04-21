"use client";

import { FOOD_TYPES, GameState } from "@/lib/types";
import PlayerCard from "./PlayerCard";

type Props = {
  state: GameState;
  onContinue: () => void;
};

export default function Reveal({ state, onContinue }: Props) {
  const lastRound = state.history[state.history.length - 1];
  if (!lastRound) return null;

  const playerById = (id: number) => state.players.find((p) => p.id === id)!;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-1">Round {lastRound.round} Results</h1>
      <p className="text-gray-400 mb-6">
        Bids revealed, auctions settled, and everyone ate.
      </p>

      <div className="bg-gray-900 border border-gray-800 rounded-lg p-5 mb-4">
        <h2 className="font-semibold mb-3">Bids</h2>
        <div className="grid md:grid-cols-2 gap-2 text-sm">
          {lastRound.bids.map((b, i) => (
            <div
              key={i}
              className="flex justify-between bg-gray-800 rounded px-3 py-2"
            >
              <span>{playerById(b.playerId).name}</span>
              <span className="text-gray-400">
                <span className="text-blue-300">{b.foodType}</span> &middot;{" "}
                <span className="font-mono text-green-400">${b.amount}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-lg p-5 mb-4">
        <h2 className="font-semibold mb-3">Auctions</h2>
        {FOOD_TYPES.map((ft) => {
          const outcome = lastRound.auctions.find((a) => a.foodType === ft);
          const producer = state.players.find((p) => p.produces === ft);
          if (!producer) return null;
          return (
            <div key={ft} className="text-sm py-1">
              <span className="text-blue-300 w-16 inline-block">{ft}</span>
              {outcome ? (
                <span className="text-gray-300">
                  {playerById(outcome.winnerId).name} won 1 unit from{" "}
                  {playerById(outcome.producerId).name} for{" "}
                  <span className="font-mono text-green-400">
                    ${outcome.price}
                  </span>
                </span>
              ) : (
                <span className="text-gray-500">
                  {producer.name} kept their unit (no winning bid)
                </span>
              )}
            </div>
          );
        })}
      </div>

      {lastRound.deaths.length > 0 && (
        <div className="bg-red-950/40 border border-red-800 rounded-lg p-5 mb-4">
          <h2 className="font-semibold mb-2 text-red-300">Deaths this round</h2>
          <ul className="text-sm list-disc list-inside">
            {lastRound.deaths.map((id) => (
              <li key={id}>{playerById(id).name} starved.</li>
            ))}
          </ul>
        </div>
      )}

      <h2 className="font-semibold mb-3 mt-6">Standings</h2>
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {state.players.map((p) => (
          <PlayerCard key={p.id} player={p} />
        ))}
      </div>

      <button
        onClick={onContinue}
        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded transition"
      >
        {state.round > state.totalRounds ? "See Final Results" : `Continue to Round ${state.round}`}
      </button>
    </div>
  );
}
