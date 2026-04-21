"use client";

import { useState } from "react";

type Props = {
  onStart: (names: string[]) => void;
};

export default function Setup({ onStart }: Props) {
  const [names, setNames] = useState(["Player 1", "Player 2", "Player 3", "Player 4"]);

  function update(i: number, value: string) {
    const copy = [...names];
    copy[i] = value;
    setNames(copy);
  }

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-2">Hunger Games</h1>
      <p className="text-gray-400 mb-6">
        4 players. 4 foods. 10 rounds. Bid, survive, profit.
      </p>

      <div className="bg-gray-900 rounded-lg p-6 mb-6 border border-gray-800">
        <h2 className="text-lg font-semibold mb-3">Rules</h2>
        <ul className="text-sm text-gray-300 space-y-1 list-disc list-inside">
          <li>Each player starts with $100 cash and 10 of each food.</li>
          <li>Each player is randomly assigned one food type to produce (1 unit/round).</li>
          <li>Each round, every player secretly bids on one food type.</li>
          <li>For each food, the highest external bid (above the producer&apos;s reserve) wins 1 unit from the producer and pays them.</li>
          <li>Every player consumes 1 of every food per round.</li>
          <li>If any food goes below 1 at end of round, the player dies.</li>
          <li>Last one standing &mdash; or richest survivor after round 10 &mdash; wins.</li>
        </ul>
      </div>

      <h2 className="text-lg font-semibold mb-2">Player Names</h2>
      <div className="space-y-2 mb-6">
        {names.map((n, i) => (
          <input
            key={i}
            value={n}
            onChange={(e) => update(i, e.target.value)}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded focus:outline-none focus:border-blue-500"
            placeholder={`Player ${i + 1}`}
          />
        ))}
      </div>

      <button
        onClick={() => onStart(names)}
        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded transition"
      >
        Start Game
      </button>
    </div>
  );
}
