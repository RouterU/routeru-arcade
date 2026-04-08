import { Trophy } from "lucide-react";
import { type LeaderboardEntry } from "@/store/gameStore";

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentScore?: number;
  title?: string;
}

const GAME_LABELS: Record<LeaderboardEntry["game"], string> = {
  quiz: "Route Blitz",
  scenario: "What Would You Do?",
  "data-challenge": "Issue Hunter",
  "route-runner": "Route Runner",
};

const GAME_COLORS: Record<LeaderboardEntry["game"], string> = {
  quiz: "hsl(5 84% 48%)",
  scenario: "hsl(128 30% 58%)",
  "data-challenge": "hsl(38 95% 55%)",
  "route-runner": "hsl(5 84% 48%)",
};

export default function Leaderboard({
  entries,
  currentScore,
  title = "Top Players",
}: LeaderboardProps) {
  return (
    <div className="p-5 space-y-4">
      <div className="flex items-center gap-2">
        <Trophy size={18} style={{ color: "hsl(38 95% 58%)" }} />
        <h3
          className="font-bold"
          style={{ color: "hsl(38 45% 96%)" }}
        >
          {title}
        </h3>
      </div>

      <div className="space-y-2">
        {entries.length === 0 ? (
          <div
            className="rounded-2xl px-4 py-6 text-center"
            style={{
              background: "hsl(0 0% 14%)",
              border: "1px solid hsl(128 20% 24%)",
            }}
          >
            <div
              className="text-sm font-medium"
              style={{ color: "hsl(38 45% 96%)" }}
            >
              No scores yet
            </div>
            <div
              className="text-xs mt-1"
              style={{ color: "hsl(0 0% 68%)" }}
            >
              Be the first to post a score.
            </div>
          </div>
        ) : (
          entries.map((entry, i) => {
            const rank = i + 1;
            const isTop = rank === 1;
            const isSecond = rank === 2;
            const isThird = rank === 3;

            return (
              <div
                key={entry.id}
                data-testid={`leaderboard-row-${rank}`}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl"
                style={{
                  background: isTop
                    ? "linear-gradient(90deg, hsl(38 95% 55% / 0.14), hsl(0 0% 14%))"
                    : "hsl(0 0% 14%)",
                  border: isTop
                    ? "1px solid hsl(38 95% 55% / 0.35)"
                    : isSecond
                    ? "1px solid hsl(210 10% 60% / 0.25)"
                    : isThird
                    ? "1px solid hsl(28 65% 52% / 0.28)"
                    : "1px solid hsl(128 18% 22%)",
                  boxShadow: isTop ? "0 8px 20px rgba(0,0,0,0.18)" : "none",
                }}
              >
                <div className="w-8 shrink-0 text-center">
                  {isTop ? (
                    <span
                      style={{ color: "hsl(38 95% 58%)" }}
                      className="font-bold text-sm"
                    >
                      🥇
                    </span>
                  ) : isSecond ? (
                    <span
                      style={{ color: "hsl(210 10% 70%)" }}
                      className="font-bold text-sm"
                    >
                      🥈
                    </span>
                  ) : isThird ? (
                    <span
                      style={{ color: "hsl(28 65% 55%)" }}
                      className="font-bold text-sm"
                    >
                      🥉
                    </span>
                  ) : (
                    <span
                      className="text-xs font-semibold"
                      style={{ color: "hsl(0 0% 68%)" }}
                    >
                      #{rank}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div
                    className="text-sm font-semibold truncate"
                    style={{ color: "hsl(38 45% 96%)" }}
                  >
                    {entry.name}
                  </div>

                  <div
                    className="text-xs"
                    style={{ color: GAME_COLORS[entry.game] ?? "hsl(0 0% 60%)" }}
                  >
                    {GAME_LABELS[entry.game] ?? entry.game}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div
                    className="text-sm font-bold score-number"
                    style={{ color: "hsl(38 88% 61%)" }}
                  >
                    {entry.score.toLocaleString()}
                  </div>
                  <div
                    className="text-xs"
                    style={{ color: "hsl(0 0% 62%)" }}
                  >
                    {entry.date}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {currentScore !== undefined && (
        <div
          className="rounded-2xl p-4 text-center"
          style={{
            background: "linear-gradient(180deg, hsl(128 28% 22%), hsl(128 22% 18%))",
            border: "1px solid hsl(128 20% 30%)",
            boxShadow: "0 10px 24px rgba(0,0,0,0.18)",
          }}
        >
          <div
            className="text-xs uppercase tracking-wide font-semibold"
            style={{ color: "hsl(38 45% 90%)" }}
          >
            Your Session Score
          </div>
          <div
            className="text-2xl font-bold score-number mt-1"
            style={{ color: "hsl(38 95% 58%)" }}
          >
            {currentScore.toLocaleString()}
          </div>
        </div>
      )}
    </div>
  );
}