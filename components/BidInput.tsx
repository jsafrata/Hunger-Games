"use client";

import { useState } from "react";
import { FOOD_TYPES, FoodType, Player } from "@/lib/types";

type Props = {
  player: Player;
  round: number;
  onSubmit: (foodType: FoodType, amount: number) => void;
};

export default function BidInput({ player, round, onSubmit }: Props) {
  const [foodType, setFoodType] = useState<FoodType>(FOOD_TYPES[0]);
  const [amount, setAmount] = useState(0);

  const invalid = amount < 0 || amount > player.cash || !Number.isFinite(amount);

  return (
    <div className="max-w-xl mx-auto p-8">
      <div className="text-gray-400 text-sm mb-1">Round {round} &middot; Your turn</div>
      <h1 className="text-3xl font-bold mb-4">{player.name}</h1>

      <div className="bg-gray-900 border border-gray-800 rounded-lg p-5 mb-4">
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <div className="text-xs text-gray-400">Cash</div>
            <div className="text-2xl font-mono text-green-400">${player.cash}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400">You produce</div>
            <div className="text-2xl font-mono">{player.produces}</div>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2 text-sm">
          {FOOD_TYPES.map((ft) => {
            const count = player.food[ft];
            return (
              <div key={ft} className="rounded px-2 py-1 bg-gray-800">
                <div className="text-xs text-gray-400">{ft}</div>
                <div className={`font-mono ${count <= 2 ? "text-red-400" : ""}`}>
                  {count}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-lg p-5 mb-4">
        <h2 className="font-semibold mb-3">Place your bid</h2>

        <label className="block text-sm text-gray-400 mb-1">Food type</label>
        <div className="grid grid-cols-4 gap-2 mb-4">
          {FOOD_TYPES.map((ft) => (
            <button
              key={ft}
              onClick={() => setFoodType(ft)}
              className={`px-3 py-2 rounded border text-sm transition ${
                foodType === ft
                  ? "border-blue-500 bg-blue-950"
                  : "border-gray-700 bg-gray-800 hover:border-gray-500"
              }`}
            >
              {ft}
            </button>
          ))}
        </div>

        <label className="block text-sm text-gray-400 mb-1">
          Bid amount (0 &ndash; {player.cash})
        </label>
        <input
          type="number"
          min={0}
          max={player.cash}
          value={Number.isFinite(amount) ? amount : 0}
          onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded font-mono focus:outline-none focus:border-blue-500"
        />
        {invalid && (
          <div className="text-red-400 text-sm mt-1">
            Bid must be between 0 and {player.cash}.
          </div>
        )}
      </div>

      <button
        disabled={invalid}
        onClick={() => onSubmit(foodType, amount)}
        className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 rounded transition"
      >
        Submit Bid
      </button>
    </div>
  );
}
