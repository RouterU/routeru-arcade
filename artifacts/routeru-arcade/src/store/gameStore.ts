import { useState, useCallback } from "react";

export interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  game: "quiz" | "scenario" | "data-challenge";
  date: string;
}

const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  { id: "1", name: "NetNinja_42", score: 1850, game: "quiz", date: "2025-04-06" },
  { id: "2", name: "RouterGuru", score: 1600, game: "scenario", date: "2025-04-06" },
  { id: "3", name: "PacketWizard", score: 1400, game: "data-challenge", date: "2025-04-05" },
  { id: "4", name: "BGP_Boss", score: 1250, game: "quiz", date: "2025-04-05" },
  { id: "5", name: "OSPFking", score: 1100, game: "quiz", date: "2025-04-04" },
  { id: "6", name: "CiscoChamp", score: 950, game: "scenario", date: "2025-04-04" },
  { id: "7", name: "SubnetSam", score: 800, game: "data-challenge", date: "2025-04-03" },
];

export function useLeaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>(INITIAL_LEADERBOARD);

  const addEntry = useCallback(
    (name: string, score: number, game: LeaderboardEntry["game"]) => {
      const newEntry: LeaderboardEntry = {
        id: Date.now().toString(),
        name,
        score,
        game,
        date: new Date().toISOString().slice(0, 10),
      };
      setEntries((prev) => [...prev, newEntry].sort((a, b) => b.score - a.score).slice(0, 20));
    },
    []
  );

  const topEntries = entries.slice(0, 10);
  return { topEntries, allEntries: entries, addEntry };
}
