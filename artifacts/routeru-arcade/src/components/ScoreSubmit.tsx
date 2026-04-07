import { useState } from "react";
import { User, Send } from "lucide-react";

interface ScoreSubmitProps {
  score: number;
  game: "quiz" | "scenario" | "data-challenge";
  onSubmit: (name: string) => void;
  onSkip: () => void;
}

export default function ScoreSubmit({ score, game, onSubmit, onSkip }: ScoreSubmitProps) {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) onSubmit(name.trim());
  };

  return (
    <div className="animate-pop-in max-w-md mx-auto game-card p-6 space-y-5 text-center">
      <div className="space-y-1">
        <div className="text-4xl font-bold score-number">{score.toLocaleString()}</div>
        <p className="text-muted-foreground text-sm">Submit your score to the leaderboard</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            data-testid="input-player-name"
            type="text"
            placeholder="Enter your callsign..."
            maxLength={20}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full pl-9 pr-4 py-3 rounded-xl text-sm font-medium text-foreground outline-none transition-all"
            style={{
              background: "hsl(230 22% 14%)",
              border: "1.5px solid hsl(230 20% 22%)",
            }}
            autoFocus
          />
        </div>
        <button
          data-testid="button-submit-score"
          type="submit"
          disabled={!name.trim()}
          className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-40"
          style={{ background: "hsl(262 80% 65%)", color: "white" }}
        >
          <Send size={14} />
          Submit Score
        </button>
        <button
          data-testid="button-skip-submit"
          type="button"
          onClick={onSkip}
          className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Skip
        </button>
      </form>
    </div>
  );
}
