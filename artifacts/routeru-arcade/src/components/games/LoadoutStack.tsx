import React from "react";

type LoadoutStackProps = {
  mode?: "timed" | "survival";
  onExit?: () => void;
};

export default function LoadoutStack({
  mode = "timed",
  onExit,
}: LoadoutStackProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl p-8 max-w-xl w-full text-center shadow-2xl">
        <div className="text-sm uppercase tracking-[0.2em] text-cyan-300 mb-2">
          New Game Mode
        </div>

        <h1 className="text-4xl font-black mb-4">Loadout Stack</h1>

        <p className="text-slate-300 mb-6">
          {mode === "survival"
            ? "Final round survival mode is active. This round should continue until the player tops out."
            : "Timed mode is active. This will be used between question rounds."}
        </p>

        <button
          onClick={onExit}
          className="px-5 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 font-bold text-slate-950 transition"
        >
          Exit Test
        </button>
      </div>
    </div>
  );
}
