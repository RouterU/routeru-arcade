import { useState, useCallback, useEffect } from "react";

export interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  game: "quiz" | "scenario" | "data-challenge" | "route-runner";
  date: string;
}

export interface LifetimeLeaderboardEntry {
  id: string;
  name: string;
  nameKey: string;
  game: "quiz" | "scenario" | "data-challenge" | "route-runner";
  totalScore: number;
  plays: number;
  bestScore: number;
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

function isValidLifetimeEntry(entry: unknown): entry is LifetimeLeaderboardEntry {
  if (!entry || typeof entry !== "object") return false;

  const e = entry as LifetimeLeaderboardEntry;

  return (
    typeof e.id === "string" &&
    typeof e.name === "string" &&
    typeof e.nameKey === "string" &&
    typeof e.totalScore === "number" &&
    typeof e.plays === "number" &&
    typeof e.bestScore === "number" &&
    (e.game === "quiz" ||
      e.game === "scenario" ||
      e.game === "data-challenge" ||
      e.game === "route-runner") &&
    typeof e.date === "string"
  );
}

export function useLeaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [lifetimeEntries, setLifetimeEntries] = useState<LifetimeLeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadLeaderboard = useCallback(async () => {
    try {
      setIsLoading(true);

      const [currentRes, lifetimeRes] = await Promise.all([
        fetch("/api/leaderboard", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }),
        fetch("/api/leaderboard?scope=lifetime", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }),
      ]);

      if (!currentRes.ok) {
        throw new Error(`Failed to load leaderboard: ${currentRes.status}`);
      }

      if (!lifetimeRes.ok) {
        throw new Error(`Failed to load lifetime leaderboard: ${lifetimeRes.status}`);
      }

      const currentData: unknown = await currentRes.json();
      const lifetimeData: unknown = await lifetimeRes.json();

      if (!Array.isArray(currentData)) {
        throw new Error("Leaderboard response was not an array");
      }

      if (!Array.isArray(lifetimeData)) {
        throw new Error("Lifetime leaderboard response was not an array");
      }

      const validEntries = currentData.filter(isValidEntry);
      const validLifetimeEntries = lifetimeData.filter(isValidLifetimeEntry);

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

        await loadLeaderboard();
      } catch (error) {
        console.error("Failed to save leaderboard entry:", error);
      }
    },
    [loadLeaderboard]
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
      await loadLeaderboard();
    } catch (error) {
      console.error("Failed to reset leaderboard:", error);
      throw error;
    }
  }, [loadLeaderboard]);

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
