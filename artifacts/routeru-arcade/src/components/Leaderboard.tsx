import { Trophy, Medal } from "lucide-react";
import { type LeaderboardEntry } from "@/store/gameStore";

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentScore?: number;
  title?: string;
}

const GAME_LABELS: Record<string, string> = {
  quiz: "Speed Quiz",
  scenario: "Scenarios",
  "data-challenge": "Data Challenge",
};

const GAME_COLORS: Record<string, string> = {
  quiz: "hsl(262 80% 65%)",
  scenario: "hsl(180 70% 45%)",
  "data-challenge": "hsl(38 95% 55%)",
};

export default function Leaderboard({ entries, currentScore, title = "Top Players" }: LeaderboardProps) {
  return (
    <div className="game-card p-5 space-y-4">
      <div className="flex items-center gap-2">
        <Trophy size={18} style={{ color: "hsl(38 95% 58%)" }} />
        <h3 className="font-bold text-foreground">{title}</h3>
      </div>
      <div className="space-y-1.5">
        {entries.map((entry, i) => {
          const rank = i + 1;
          const rowClass = `leaderboard-row ${rank === 1 ? "top-1" : rank === 2 ? "top-2" : rank === 3 ? "top-3" : ""}`;
          return (
            <div key={entry.id} data-testid={`leaderboard-row-${rank}`} className={rowClass}>
              <div className="w-8 shrink-0 text-center">
                {rank === 1 ? (
                  <span style={{ color: "hsl(38 95% 58%)" }} className="font-bold text-sm">🥇</span>
                ) : rank === 2 ? (
                  <span style={{ color: "hsl(210 10% 65%)" }} className="font-bold text-sm">🥈</span>
                ) : rank === 3 ? (
                  <span style={{ color: "hsl(38 60% 50%)" }} className="font-bold text-sm">🥉</span>
                ) : (
                  <span className="text-muted-foreground text-xs font-semibold">#{rank}</span>
                )}
              </div>
              <div className="flex-1 min-w-0 pl-2">
                <div className="text-sm font-semibold text-foreground truncate">{entry.name}</div>
                <div
                  className="text-xs"
                  style={{ color: GAME_COLORS[entry.game] ?? "hsl(210 15% 55%)" }}
                >
                  {GAME_LABELS[entry.game] ?? entry.game}
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-sm font-bold score-number">{entry.score.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">{entry.date}</div>
              </div>
            </div>
          );
        })}
      </div>
      {currentScore !== undefined && (
        <div
          className="rounded-xl p-3 text-center"
          style={{ background: "hsl(262 80% 65% / 0.1)", border: "1px solid hsl(262 80% 65% / 0.2)" }}
        >
          <div className="text-xs text-muted-foreground">Your Session Score</div>
          <div className="text-xl font-bold score-number mt-0.5">{currentScore.toLocaleString()}</div>
        </div>
      )}
    </div>
  );
}
