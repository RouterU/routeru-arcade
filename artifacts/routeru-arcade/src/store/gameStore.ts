import { useState, useCallback, useEffect } from "react";

export type GameType =
  | "quiz"
  | "scenario"
  | "data-challenge"
  | "route-runner"
  | "screen-sim"
  | "find-the-fix";

export interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  game: GameType;
  date: string;
}

export interface LifetimeLeaderboardEntry {
  id: string;
  name: string;
  nameKey: string;
  game: GameType;
  totalScore: number;
  plays: number;
  bestScore: number;
  date: string;
}

function isValidGame(game: unknown): game is GameType {
  return (
    game === "quiz" ||
    game === "scenario" ||
    game === "data-challenge" ||
    game === "route-runner" ||
    game === "screen-sim" ||
    game === "find-the-fix"
  );
}

function toNumber(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function normalizeEntry(entry: any): LeaderboardEntry | null {
  if (!entry || typeof entry !== "object") return null;
  if (!isValidGame(entry.game)) return null;

  return {
    id: String(entry.id),
    name: String(entry.name ?? ""),
    score: toNumber(entry.score),
    game: entry.game,
    date: String(entry.date ?? ""),
  };
}

function normalizeLifetimeEntry(entry: any): LifetimeLeaderboardEntry | null {
  if (!entry || typeof entry !== "object") return null;
  if (!isValidGame(entry.game)) return null;

  return {
    id: String(entry.id),
    name: String(entry.name ?? ""),
    nameKey: String(entry.nameKey ?? ""),
    game: entry.game,
    totalScore: toNumber(entry.totalScore),
    plays: toNumber(entry.plays),
    bestScore: toNumber(entry.bestScore),
    date: String(entry.date ?? ""),
  };
}

export function useLeaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [lifetimeEntries, setLifetimeEntries] = useState<LifetimeLeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadLeaderboard = useCallback(async () => {
    try {
      setIsLoading(true);

      const [currentRes, lifetimeRes] = await Promise.all([
        fetch("/api/leaderboard"),
        fetch("/api/leaderboard?scope=lifetime"),
      ]);

      if (!currentRes.ok) {
        throw new Error(`Failed to load leaderboard: ${currentRes.status}`);
      }

      if (!lifetimeRes.ok) {
        throw new Error(`Failed to load lifetime leaderboard: ${lifetimeRes.status}`);
      }

      const currentData = await currentRes.json();
      const lifetimeData = await lifetimeRes.json();

      const validEntries = Array.isArray(currentData)
        ? currentData.map(normalizeEntry).filter(Boolean) as LeaderboardEntry[]
        : [];

      const validLifetimeEntries = Array.isArray(lifetimeData)
        ? lifetimeData.map(normalizeLifetimeEntry).filter(Boolean) as LifetimeLeaderboardEntry[]
        : [];

      setEntries(
        validEntries
          .sort((a, b) => b.score - a.score)
          .slice(0, 20)
      );

      setLifetimeEntries(
        validLifetimeEntries.sort((a, b) => b.totalScore - a.totalScore)
      );
    } catch (error) {
      console.error("Failed to load leaderboard:", error);
      setEntries([]);
      setLifetimeEntries([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLeaderboard();
  }, [loadLeaderboard]);

  const addEntry = useCallback(
    async (name: string, score: number, game: GameType) => {
      const trimmed = name.trim();
      if (!trimmed) return;

      try {
        const res = await fetch("/api/leaderboard", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: trimmed,
            score,
            game,
          }),
        });

        const data = await res.json().catch(() => null);

        if (!res.ok) {
          throw new Error(data?.error || `Failed to save score: ${res.status}`);
        }

        await loadLeaderboard();
      } catch (error) {
        console.error("Failed to save leaderboard entry:", error);
      }
    },
    [loadLeaderboard]
  );

  const resetLeaderboard = useCallback(
    async (passcode: string) => {
      try {
        const res = await fetch("/api/leaderboard", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ passcode }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || `Failed to reset leaderboard: ${res.status}`);
        }

        await loadLeaderboard();
      } catch (error) {
        console.error("Failed to reset leaderboard:", error);
        throw error;
      }
    },
    [loadLeaderboard]
  );

  const topEntries = entries.slice(0, 10);

  return {
    topEntries,
    allEntries: entries,
    lifetimeEntries,
    addEntry,
    resetLeaderboard,
    isLoading,
    refreshLeaderboard: loadLeaderboard,
  };
}
