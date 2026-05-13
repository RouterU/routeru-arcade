import { Send, Trophy, User } from "lucide-react";

interface ScoreSubmitProps {
  score: number;
  game: "quiz" | "scenario" | "data-challenge" | "route-runner" | "screen-sim";
  playerName: string;
  onSubmit: (name: string) => void;
  onSkip: () => void;
}

const GAME_LABELS: Record<ScoreSubmitProps["game"], string> = {
  quiz: "Route Blitz",
  scenario: "What Would You Do?",
  "data-challenge": "Issue Hunter",
  "route-runner": "Routing Game Zone",
  "screen-sim": "Find The Fix",
};

export default function ScoreSubmit({
  score,
  game,
  playerName,
  onSubmit,
  onSkip,
}: ScoreSubmitProps) {
  const cleanPlayerName = playerName.trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!cleanPlayerName) {
      window.alert("Player name is missing. Please return to the home screen and enter your name.");
      return;
    }

    onSubmit(cleanPlayerName);
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

        <p className="text-sm" style={{ color: "hsl(0 0% 72%)" }}>
          Submit your score to the leaderboard
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-left"
          style={{
            background: "hsl(0 0% 12%)",
            border: "1.5px solid hsl(128 18% 24%)",
            color: "hsl(38 45% 96%)",
          }}
        >
          <User size={16} style={{ color: "hsl(0 0% 62%)" }} />

          <div>
            <div className="text-xs" style={{ color: "hsl(0 0% 62%)" }}>
              Player
            </div>
            <div className="text-sm font-semibold">
              {cleanPlayerName || "Name missing"}
            </div>
          </div>
        </div>

        <button
          data-testid="button-submit-score"
          type="submit"
          disabled={!cleanPlayerName}
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
