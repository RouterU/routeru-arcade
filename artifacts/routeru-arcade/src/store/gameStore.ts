import { useState, useCallback, useEffect } from "react";

export interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  game: "quiz" | "scenario" | "data-challenge" | "route-runner";
  date: string;
}

function isValidEntry(entry: unknown): entry is LeaderboardEntry {
  if (!entry || typeof entry !== "object") return false;

  const e = entry as LeaderboardEntry;

  return (
    typeof e.id === "string" &&
    typeof e.name === "string" &&
    typeof e.score === "number" &&
    (e.game === "quiz" ||
      e.game === "scenario" ||
      e.game === "data-challenge" ||
      e.game === "route-runner") &&
    typeof e.date === "string"
  );
}

export function useLeaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadLeaderboard = useCallback(async () => {
    try {
      setIsLoading(true);

      const res = await fetch("/api/leaderboard", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`Failed to load leaderboard: ${res.status}`);
      }

      const data: unknown = await res.json();

      if (!Array.isArray(data)) {
        throw new Error("Leaderboard response was not an array");
      }

      const validEntries = data.filter(isValidEntry);

      setEntries(
        validEntries
          .sort((a, b) => b.score - a.score)
          .slice(0, 20)
      );
    } catch (error) {
      console.error("Failed to load leaderboard:", error);
      setEntries([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLeaderboard();
  }, [loadLeaderboard]);

  const addEntry = useCallback(
    async (name: string, score: number, game: LeaderboardEntry["game"]) => {
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

        if (!res.ok) {
          throw new Error(`Failed to save score: ${res.status}`);
        }

        const savedEntry: unknown = await res.json();

        if (!isValidEntry(savedEntry)) {
          throw new Error("Saved leaderboard entry was invalid");
        }

        setEntries((prev) =>
          [...prev, savedEntry]
            .sort((a, b) => b.score - a.score)
            .slice(0, 20)
        );
      } catch (error) {
        console.error("Failed to save leaderboard entry:", error);
      }
    },
    []
  );

const resetLeaderboard = useCallback(async (passcode: string) => {
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

    setEntries([]);
  } catch (error) {
    console.error("Failed to reset leaderboard:", error);
    throw error;
  }
}, []);

  const topEntries = entries.slice(0, 10);

  return {
    topEntries,
    allEntries: entries,
    addEntry,
    resetLeaderboard,
    isLoading,
    refreshLeaderboard: loadLeaderboard,
  };
}
