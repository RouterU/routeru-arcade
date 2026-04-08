import { useState, useCallback } from "react";

export interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  game: "quiz" | "scenario" | "data-challenge" | "route-runner";
  date: string;
}

const STORAGE_KEY = "routeru_leaderboard";

function readLeaderboard(): LeaderboardEntry[] {
  if (typeof window === "undefined") return [];

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];

    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (entry): entry is LeaderboardEntry =>
        entry &&
        typeof entry.id === "string" &&
        typeof entry.name === "string" &&
        typeof entry.score === "number" &&
        (entry.game === "quiz" ||
          entry.game === "scenario" ||
          entry.game === "data-challenge" ||
          entry.game === "route-runner") &&
        typeof entry.date === "string"
    );
  } catch {
    return [];
  }
}

function writeLeaderboard(entries: LeaderboardEntry[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function useLeaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>(() => readLeaderboard());

  const addEntry = useCallback(
    (name: string, score: number, game: LeaderboardEntry["game"]) => {
      const trimmed = name.trim();
      if (!trimmed) return;

      const newEntry: LeaderboardEntry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name: trimmed,
        score,
        game,
        date: new Date().toISOString().slice(0, 10),
      };

      setEntries((prev) => {
        const updated = [...prev, newEntry]
          .sort((a, b) => b.score - a.score)
          .slice(0, 20);

        writeLeaderboard(updated);
        return updated;
      });
    },
    []
  );

  const resetLeaderboard = useCallback(() => {
    setEntries([]);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const topEntries = entries.slice(0, 10);

  return {
    topEntries,
    allEntries: entries,
    addEntry,
    resetLeaderboard,
  };
}