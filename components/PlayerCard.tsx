"use client";

import { FOOD_TYPES, Player } from "@/lib/types";

type Props = {
  player: Player;
  highlight?: boolean;
  compact?: boolean;
};

export default function PlayerCard({ player, highlight, compact }: Props) {
  return (
    <div
      className={`rounded-lg border p-4 ${
        highlight ? "border-blue-500 bg-blue-950/30" : "border-gray-800 bg-gray-900"
      } ${!player.alive ? "opacity-50" : ""}`}
    >
      <div className="flex items-baseline justify-between mb-2">
        <h3 className="font-semibold">
          {player.name}
          {!player.alive && <span className="text-red-500 text-xs ml-2">DEAD</span>}
        </h3>
        <span className="text-xs text-gray-400">Produces: {player.produces}</span>
      </div>

      <div className="text-lg font-mono mb-2">
        <span className="text-green-400">${player.cash}</span>
      </div>

      {!compact && (
        <div className="grid grid-cols-4 gap-2 text-sm">
          {FOOD_TYPES.map((ft) => {
            const count = player.food[ft];
            const danger = count <= 2;
            return (
              <div
                key={ft}
                className={`rounded px-2 py-1 bg-gray-800 ${
                  danger && player.alive ? "ring-1 ring-red-500" : ""
                }`}
              >
                <div className="text-xs text-gray-400">{ft}</div>
                <div className={`font-mono ${danger ? "text-red-400" : ""}`}>
                  {count}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
