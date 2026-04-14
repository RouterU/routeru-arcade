import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import bgImage from "@/pages/RouterU.png"; // adjust if needed

type LoadoutStackMode = "timed" | "survival";

interface LoadoutStackExitPayload {
  reason: "timer_complete" | "top_out" | "manual_exit";
  score: number;
  linesCleared: number;
  piecesPlaced: number;
}

interface LoadoutStackProps {
  mode?: LoadoutStackMode;
  timedSeconds?: number;
  onExit?: (payload?: LoadoutStackExitPayload) => void;
}

type Cell = string | null;
type Board = Cell[][];
type Point = { x: number; y: number };

type ActivePiece = {
  key: string;
  color: string;
  rotationIndex: number;
  x: number;
  y: number;
  rotations: Point[][];
};

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 16;
const DEFAULT_TIMED_SECONDS = 15;

let persistedState: any = null;

const PIECES = [
  { key: "O", color: "bg-yellow-400", rotations: [[{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }]] },
  { key: "I", color: "bg-cyan-400", rotations: [[{ x: -1, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }]] },
  { key: "T", color: "bg-purple-500", rotations: [[{ x: -1, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }]] },
];

function emptyBoard(): Board {
  return Array.from({ length: BOARD_HEIGHT }, () =>
    Array.from({ length: BOARD_WIDTH }, () => null)
  );
}

function randomPiece(): ActivePiece {
  const p = PIECES[Math.floor(Math.random() * PIECES.length)];
  return {
    ...p,
    rotationIndex: 0,
    x: Math.floor(BOARD_WIDTH / 2),
    y: 1,
  };
}

export default function LoadoutStack({
  mode = "timed",
  timedSeconds = DEFAULT_TIMED_SECONDS,
  onExit,
}: LoadoutStackProps) {

  const initial = persistedState || {
    board: emptyBoard(),
    piece: randomPiece(),
    score: 0,
  };

  const [board, setBoard] = useState(initial.board);
  const [piece, setPiece] = useState(initial.piece);
  const [score, setScore] = useState(initial.score);
  const [timeLeft, setTimeLeft] = useState(mode === "timed" ? timedSeconds : null);
  const [running, setRunning] = useState(true);
  const [survivalTime, setSurvivalTime] = useState(0);

  const boardRef = useRef(board);
  const pieceRef = useRef(piece);

  useEffect(() => { boardRef.current = board; }, [board]);
  useEffect(() => { pieceRef.current = piece; }, [piece]);

  // Persist state
  useEffect(() => {
    persistedState = { board, piece, score };
  }, [board, piece, score]);

  // SPEED RAMP (every 15 sec faster)
  const dropSpeed = useMemo(() => {
    if (mode !== "survival") return 650;
    const level = Math.floor(survivalTime / 15);
    return Math.max(150, 650 - level * 100);
  }, [survivalTime, mode]);

  // Timer
  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      if (mode === "timed") {
        setTimeLeft((t) => {
          if (t <= 1) {
            onExit?.({ reason: "timer_complete", score, linesCleared: 0, piecesPlaced: 0 });
            return 0;
          }
          return t - 1;
        });
      } else {
        setSurvivalTime((t) => t + 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [running, mode, score, onExit]);

  // Movement
  const move = (dx: number) => {
    setPiece((p) => ({ ...p, x: p.x + dx }));
  };

  const drop = () => {
    setPiece((p) => ({ ...p, y: p.y + 1 }));
  };

  // Gravity
  useEffect(() => {
    if (!running) return;
    const interval = setInterval(drop, dropSpeed);
    return () => clearInterval(interval);
  }, [dropSpeed, running]);

  // Prevent scroll
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (["ArrowLeft", "ArrowRight", "ArrowDown", " "].includes(e.key)) {
        e.preventDefault();
      }
      if (e.key === "ArrowLeft") move(-1);
      if (e.key === "ArrowRight") move(1);
    };

    window.addEventListener("keydown", handler, { passive: false });
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div
      className="min-h-screen text-white p-4 relative overflow-hidden"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70" />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4">Loadout Stack</h1>

        <div className="mb-2">
          {mode === "timed"
            ? `Time Left: ${timeLeft}s`
            : `Survival Time: ${survivalTime}s`}
        </div>

        <div className="grid grid-cols-10 gap-1 bg-black p-2">
          {board.map((row, y) =>
            row.map((cell, x) => (
              <div key={`${x}-${y}`} className="w-6 h-6 bg-slate-800" />
            ))
          )}
        </div>

        <button
          onClick={() => onExit?.({ reason: "manual_exit", score, linesCleared: 0, piecesPlaced: 0 })}
          className="mt-4 px-4 py-2 bg-cyan-500 rounded"
        >
          Exit
        </button>
      </div>
    </div>
  );
}
