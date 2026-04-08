import { useState } from "react";
import { User, Send, Trophy } from "lucide-react";

interface ScoreSubmitProps {
  score: number;
  game: "quiz" | "scenario" | "data-challenge";
  onSubmit: (name: string) => void;
  onSkip: () => void;
}

const GAME_LABELS: Record<ScoreSubmitProps["game"], string> = {
  quiz: "Route Blitz",
  scenario: "What Would You Do?",
  "data-challenge": "Issue Hunter",
};

export default function ScoreSubmit({
  score,
  game,
  onSubmit,
  onSkip,
}: ScoreSubmitProps) {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) onSubmit(name.trim());
  };

  return (
    <div
      className="animate-pop-in max-w-md mx-auto p-6 space-y-5 text-center rounded-3xl border"
      style={{
        background: "linear-gradient(180deg, hsl(0 0% 15%), hsl(0 0% 11%))",
        borderColor: "hsl(128 20% 28%)",
        boxShadow: "0 18px 40px rgba(0,0,0,0.30)",
      }}
    >
      <div className="space-y-2">
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest"
          style={{
            background: "hsl(5 84% 48% / 0.14)",
            color: "hsl(38 45% 96%)",
            border: "1px solid hsl(5 84% 48% / 0.30)",
          }}
        >
          <Trophy size={12} />
          {GAME_LABELS[game]}
        </div>

        <div
          className="text-4xl font-bold score-number"
          style={{ color: "hsl(38 95% 58%)" }}
        >
          {score.toLocaleString()}
        </div>

        <p
          className="text-sm"
          style={{ color: "hsl(0 0% 72%)" }}
        >
          Submit your score to the leaderboard
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <User
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: "hsl(0 0% 62%)" }}
          />

          <input
            data-testid="input-player-name"
            type="text"
            placeholder="Enter your name..."
            maxLength={20}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full pl-9 pr-4 py-3 rounded-xl text-sm font-medium outline-none transition-all"
            style={{
              background: "hsl(0 0% 12%)",
              border: "1.5px solid hsl(128 18% 24%)",
              color: "hsl(38 45% 96%)",
            }}
            autoFocus
          />
        </div>

        <button
          data-testid="button-submit-score"
          type="submit"
          disabled={!name.trim()}
          className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-40"
          style={{
            background: "hsl(5 84% 48%)",
            color: "white",
            boxShadow: "0 8px 18px rgba(170, 24, 24, 0.30)",
          }}
        >
          <Send size={14} />
          Submit Score
        </button>

        <button
          data-testid="button-skip-submit"
          type="button"
          onClick={onSkip}
          className="w-full text-sm transition-colors"
          style={{ color: "hsl(0 0% 68%)" }}
        >
          Skip
        </button>
      </form>
    </div>
  );
}