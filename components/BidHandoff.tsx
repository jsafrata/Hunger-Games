"use client";

import { Player } from "@/lib/types";

type Props = {
  nextPlayer: Player;
  onReady: () => void;
};

export default function BidHandoff({ nextPlayer, onReady }: Props) {
  return (
    <div className="max-w-md mx-auto p-8 text-center">
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-10">
        <div className="text-gray-400 text-sm mb-2">Pass the device to</div>
        <h1 className="text-4xl font-bold mb-6">{nextPlayer.name}</h1>
        <p className="text-gray-400 mb-8">
          Make sure no one else is looking before continuing.
        </p>
        <button
          onClick={onReady}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded transition"
        >
          I&apos;m {nextPlayer.name}, show my turn
        </button>
      </div>
    </div>
  );
}
