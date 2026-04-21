"use client";

import { FOOD_TYPES, GameState } from "@/lib/types";
import { rankPlayers } from "@/lib/gameLogic";

type Props = {
  state: GameState;
  onRestart: () => void;
};

export default function GameOver({ state, onRestart }: Props) {
  const ranked = rankPlayers(state.players);
  const winner = ranked[0];

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-2">Game Over</h1>
      <p className="text-gray-400 mb-6">
        {winner.alive ? (
          <>
            <span className="text-yellow-300 font-semibold">{winner.name}</span> survives and wins!
          </>
        ) : (
          <>Nobody survived. Brutal.</>
        )}
      </p>

      <div className="bg-gray-900 border border-gray-800 rounded-lg p-5 mb-6">
        <h2 className="font-semibold mb-3">Final Standings</h2>
        <div className="space-y-2">
          {ranked.map((p, i) => {
            const totalFood = FOOD_TYPES.reduce((s, ft) => s + p.food[ft], 0);
            return (
              <div
                key={p.id}
                className={`flex items-center gap-4 p-3 rounded ${
                  i === 0 ? "bg-yellow-900/30 border border-yellow-700" : "bg-gray-800"
                }`}
              >
                <div className="text-2xl font-bold text-gray-400 w-8">#{i + 1}</div>
                <div className="flex-1">
                  <div className="font-semibold">
                    {p.name}
                    {!p.alive && (
                      <span className="text-red-400 text-xs ml-2">
                        died round {p.diedOnRound}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-400">Produces {p.produces}</div>
                </div>
                <div className="text-right font-mono">
                  <div className="text-green-400">${p.cash}</div>
                  <div className="text-xs text-gray-400">{totalFood} food</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <button
        onClick={onRestart}
        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded transition"
      >
        Play Again
      </button>
    </div>
  );
}
