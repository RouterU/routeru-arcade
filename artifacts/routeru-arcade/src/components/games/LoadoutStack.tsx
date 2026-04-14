import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import bgImage from "@/pages/RouterU.png";

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
  title?: string;
  onExit?: (payload?: LoadoutStackExitPayload) => void;
}

type Cell = string | null;
type Board = Cell[][];
type Point = { x: number; y: number };

type PieceDef = {
  key: string;
  color: string;
  rotations: Point[][];
};

type ActivePiece = {
  key: string;
  color: string;
  rotationIndex: number;
  x: number;
  y: number;
  rotations: Point[][];
};

type PersistedStackState = {
  board: Board;
  piece: ActivePiece;
  nextPiece: ActivePiece;
  score: number;
  linesCleared: number;
  piecesPlaced: number;
} | null;

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 16;
const NORMAL_DROP_MS = 650;
const FAST_DROP_MS = 60;
const DEFAULT_TIMED_SECONDS = 15;

let persistedStackState: PersistedStackState = null;

const PIECES: PieceDef[] = [
  {
    key: "I",
    color: "bg-cyan-400",
    rotations: [
      [
        { x: -1, y: 0 },
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 2, y: 0 },
      ],
      [
        { x: 0, y: -1 },
        { x: 0, y: 0 },
        { x: 0, y: 1 },
        { x: 0, y: 2 },
      ],
    ],
  },
  {
    key: "O",
    color: "bg-yellow-400",
    rotations: [
      [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 1 },
      ],
    ],
  },
  {
    key: "T",
    color: "bg-violet-500",
    rotations: [
      [
        { x: -1, y: 0 },
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 0, y: 1 },
      ],
      [
        { x: 0, y: -1 },
        { x: 0, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 0 },
      ],
      [
        { x: -1, y: 0 },
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 0, y: -1 },
      ],
      [
        { x: 0, y: -1 },
        { x: 0, y: 0 },
        { x: 0, y: 1 },
        { x: -1, y: 0 },
      ],
    ],
  },
  {
    key: "L",
    color: "bg-orange-400",
    rotations: [
      [
        { x: -1, y: 0 },
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 1, y: 1 },
      ],
      [
        { x: 0, y: -1 },
        { x: 0, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: -1 },
      ],
      [
        { x: -1, y: -1 },
        { x: -1, y: 0 },
        { x: 0, y: 0 },
        { x: 1, y: 0 },
      ],
      [
        { x: -1, y: 1 },
        { x: 0, y: -1 },
        { x: 0, y: 0 },
        { x: 0, y: 1 },
      ],
    ],
  },
  {
    key: "J",
    color: "bg-blue-500",
    rotations: [
      [
        { x: -1, y: 1 },
        { x: -1, y: 0 },
        { x: 0, y: 0 },
        { x: 1, y: 0 },
      ],
      [
        { x: 0, y: -1 },
        { x: 0, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 1 },
      ],
      [
        { x: -1, y: 0 },
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 1, y: -1 },
      ],
      [
        { x: -1, y: -1 },
        { x: 0, y: -1 },
        { x: 0, y: 0 },
        { x: 0, y: 1 },
      ],
    ],
  },
  {
    key: "S",
    color: "bg-green-500",
    rotations: [
      [
        { x: -1, y: 1 },
        { x: 0, y: 1 },
        { x: 0, y: 0 },
        { x: 1, y: 0 },
      ],
      [
        { x: 0, y: -1 },
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 1, y: 1 },
      ],
    ],
  },
  {
    key: "Z",
    color: "bg-rose-500",
    rotations: [
      [
        { x: -1, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 1 },
      ],
      [
        { x: 1, y: -1 },
        { x: 1, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 1 },
      ],
    ],
  },
];

function createEmptyBoard(): Board {
  return Array.from({ length: BOARD_HEIGHT }, () =>
    Array.from({ length: BOARD_WIDTH }, () => null)
  );
}

function cloneBoard(board: Board): Board {
  return board.map((row) => [...row]);
}

function randomPiece(): ActivePiece {
  const def = PIECES[Math.floor(Math.random() * PIECES.length)];
  return {
    key: def.key,
    color: def.color,
    rotationIndex: 0,
    x: Math.floor(BOARD_WIDTH / 2),
    y: 1,
    rotations: def.rotations,
  };
}

function getFreshGameState() {
  return {
    board: createEmptyBoard(),
    piece: randomPiece(),
    nextPiece: randomPiece(),
    score: 0,
    linesCleared: 0,
    piecesPlaced: 0,
  };
}

function getInitialGameState() {
  return persistedStackState ?? getFreshGameState();
}

function getBlocks(piece: ActivePiece, rotationIndex = piece.rotationIndex): Point[] {
  return piece.rotations[rotationIndex].map((pt) => ({
    x: piece.x + pt.x,
    y: piece.y + pt.y,
  }));
}

function isValidPosition(
  board: Board,
  piece: ActivePiece,
  rotationIndex = piece.rotationIndex,
  dx = 0,
  dy = 0
): boolean {
  return piece.rotations[rotationIndex].every((pt) => {
    const x = piece.x + pt.x + dx;
    const y = piece.y + pt.y + dy;

    if (x < 0 || x >= BOARD_WIDTH || y >= BOARD_HEIGHT) return false;
    if (y < 0) return true;

    return !board[y][x];
  });
}

function lockPiece(board: Board, piece: ActivePiece): Board {
  const next = cloneBoard(board);

  for (const block of getBlocks(piece)) {
    if (
      block.y >= 0 &&
      block.y < BOARD_HEIGHT &&
      block.x >= 0 &&
      block.x < BOARD_WIDTH
    ) {
      next[block.y][block.x] = piece.color;
    }
  }

  return next;
}

function clearLines(board: Board): { board: Board; linesCleared: number } {
  const keptRows = board.filter((row) => row.some((cell) => !cell));
  const linesCleared = BOARD_HEIGHT - keptRows.length;
  const freshRows = Array.from({ length: linesCleared }, () =>
    Array.from({ length: BOARD_WIDTH }, () => null)
  );

  return {
    board: [...freshRows, ...keptRows],
    linesCleared,
  };
}

function scoreForLines(lines: number): number {
  if (lines <= 0) return 0;
  if (lines === 1) return 100;
  if (lines === 2) return 250;
  if (lines === 3) return 450;
  return 700;
}

export default function LoadoutStack({
  mode = "timed",
  timedSeconds = DEFAULT_TIMED_SECONDS,
  title = "Loadout Stack",
  onExit,
}: LoadoutStackProps) {
  const initialState = useMemo(() => getInitialGameState(), []);

  const [board, setBoard] = useState<Board>(() => initialState.board);
  const [piece, setPiece] = useState<ActivePiece>(() => initialState.piece);
  const [nextPiece, setNextPiece] = useState<ActivePiece>(() => initialState.nextPiece);
  const [score, setScore] = useState(() => initialState.score);
  const [linesCleared, setLinesCleared] = useState(() => initialState.linesCleared);
  const [piecesPlaced, setPiecesPlaced] = useState(() => initialState.piecesPlaced);
  const [isRunning, setIsRunning] = useState(true);
  const [isFastDropping, setIsFastDropping] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(
    mode === "timed" ? Math.max(1, timedSeconds) : null
  );
  const [survivalSeconds, setSurvivalSeconds] = useState(0);

  const boardRef = useRef(board);
  const pieceRef = useRef(piece);
  const scoreRef = useRef(score);
  const linesRef = useRef(linesCleared);
  const piecesPlacedRef = useRef(piecesPlaced);

  useEffect(() => {
    boardRef.current = board;
  }, [board]);

  useEffect(() => {
    pieceRef.current = piece;
  }, [piece]);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  useEffect(() => {
    linesRef.current = linesCleared;
  }, [linesCleared]);

  useEffect(() => {
    piecesPlacedRef.current = piecesPlaced;
  }, [piecesPlaced]);

  useEffect(() => {
    persistedStackState = {
      board,
      piece,
      nextPiece,
      score,
      linesCleared,
      piecesPlaced,
    };
  }, [board, piece, nextPiece, score, linesCleared, piecesPlaced]);

  const survivalDropMs = useMemo(() => {
    const level = Math.floor(survivalSeconds / 15);
    return Math.max(220, NORMAL_DROP_MS - level * 90);
  }, [survivalSeconds]);

  const exitGame = useCallback(
    (reason: "timer_complete" | "top_out" | "manual_exit") => {
      setIsRunning(false);

      if (reason === "top_out" || mode === "survival") {
        persistedStackState = null;
      }

      onExit?.({
        reason,
        score: scoreRef.current,
        linesCleared: linesRef.current,
        piecesPlaced: piecesPlacedRef.current,
      });
    },
    [mode, onExit]
  );

  const spawnNextPiece = useCallback(
    (workingBoard: Board) => {
      const spawned: ActivePiece = {
        ...nextPiece,
        x: Math.floor(BOARD_WIDTH / 2),
        y: 1,
        rotationIndex: 0,
      };

      setNextPiece(randomPiece());

      if (!isValidPosition(workingBoard, spawned)) {
        exitGame("top_out");
        return null;
      }

      setPiece(spawned);
      return spawned;
    },
    [nextPiece, exitGame]
  );

  const movePiece = useCallback(
    (dx: number, dy: number) => {
      setPiece((current) => {
        if (!isRunning) return current;

        if (isValidPosition(boardRef.current, current, current.rotationIndex, dx, dy)) {
          return { ...current, x: current.x + dx, y: current.y + dy };
        }

        return current;
      });
    },
    [isRunning]
  );

  const rotatePiece = useCallback(() => {
    setPiece((current) => {
      if (!isRunning) return current;

      const nextRotation = (current.rotationIndex + 1) % current.rotations.length;

      if (isValidPosition(boardRef.current, current, nextRotation)) {
        return { ...current, rotationIndex: nextRotation };
      }

      if (isValidPosition(boardRef.current, current, nextRotation, -1, 0)) {
        return { ...current, x: current.x - 1, rotationIndex: nextRotation };
      }

      if (isValidPosition(boardRef.current, current, nextRotation, 1, 0)) {
        return { ...current, x: current.x + 1, rotationIndex: nextRotation };
      }

      return current;
    });
  }, [isRunning]);

  const stepDown = useCallback(() => {
    if (!isRunning) return;

    const currentBoard = boardRef.current;
    const currentPiece = pieceRef.current;

    if (isValidPosition(currentBoard, currentPiece, currentPiece.rotationIndex, 0, 1)) {
      setPiece((prev) => ({ ...prev, y: prev.y + 1 }));
      return;
    }

    const lockedBoard = lockPiece(currentBoard, currentPiece);
    const { board: clearedBoard, linesCleared: cleared } = clearLines(lockedBoard);

    setBoard(clearedBoard);
    setPiecesPlaced((prev) => prev + 1);
    setScore((prev) => prev + 10 + scoreForLines(cleared));

    if (cleared > 0) {
      setLinesCleared((prev) => prev + cleared);
    }

    spawnNextPiece(clearedBoard);
  }, [isRunning, spawnNextPiece]);

  const hardDrop = useCallback(() => {
    if (!isRunning) return;

    let current = pieceRef.current;

    while (isValidPosition(boardRef.current, current, current.rotationIndex, 0, 1)) {
      current = { ...current, y: current.y + 1 };
    }

    setPiece(current);
    pieceRef.current = current;
    stepDown();
  }, [isRunning, stepDown]);

  useEffect(() => {
    if (!isRunning) return;

    const dropMs =
      mode === "survival"
        ? isFastDropping
          ? FAST_DROP_MS
          : survivalDropMs
        : isFastDropping
        ? FAST_DROP_MS
        : NORMAL_DROP_MS;

    const interval = window.setInterval(stepDown, dropMs);
    return () => window.clearInterval(interval);
  }, [isFastDropping, isRunning, stepDown, mode, survivalDropMs]);

  useEffect(() => {
    if (!isRunning) return;

    if (mode === "timed") {
      const timer = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === null) return prev;

          if (prev <= 1) {
            window.clearInterval(timer);
            exitGame("timer_complete");
            return 0;
          }

          return prev - 1;
        });
      }, 1000);

      return () => window.clearInterval(timer);
    }

    const survivalTimer = window.setInterval(() => {
      setSurvivalSeconds((prev) => prev + 1);
    }, 1000);

    return () => window.clearInterval(survivalTimer);
  }, [mode, isRunning, exitGame]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isRunning) return;

      const controlledKeys = [
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        " ",
        "a",
        "d",
        "w",
        "s",
        "x",
      ];

      if (controlledKeys.includes(event.key) || controlledKeys.includes(event.key.toLowerCase())) {
        event.preventDefault();
      }

      if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
        movePiece(-1, 0);
      }

      if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
        movePiece(1, 0);
      }

      if (
        event.key === "ArrowUp" ||
        event.key.toLowerCase() === "w" ||
        event.key.toLowerCase() === "x"
      ) {
        rotatePiece();
      }

      if (event.key === "ArrowDown" || event.key.toLowerCase() === "s") {
        setIsFastDropping(true);
      }

      if (event.key === " ") {
        hardDrop();
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === "ArrowDown" || event.key.toLowerCase() === "s") {
        event.preventDefault();
        setIsFastDropping(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown, { passive: false });
    window.addEventListener("keyup", handleKeyUp, { passive: false });

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [hardDrop, isRunning, movePiece, rotatePiece]);

  const renderBoard = useMemo(() => {
    const displayBoard = cloneBoard(board);

    for (const block of getBlocks(piece)) {
      if (
        block.y >= 0 &&
        block.y < BOARD_HEIGHT &&
        block.x >= 0 &&
        block.x < BOARD_WIDTH
      ) {
        displayBoard[block.y][block.x] = piece.color;
      }
    }

    return displayBoard;
  }, [board, piece]);

  const nextBlocks = useMemo(() => {
    const originShiftX = 1;
    const originShiftY = 1;

    return nextPiece.rotations[0].map((pt) => ({
      x: pt.x + originShiftX,
      y: pt.y + originShiftY,
    }));
  }, [nextPiece]);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-6 overflow-hidden">
      <div className="mx-auto max-w-6xl grid gap-4 lg:grid-cols-[320px_1fr_280px]">
        <div className="rounded-3xl bg-slate-900/90 border border-slate-700 p-4 shadow-2xl">
          <div className="mb-4">
            <div className="text-xs uppercase tracking-[0.2em] text-cyan-300">
              Mini Game
            </div>
            <h1 className="text-3xl font-black mt-1">{title}</h1>
            <p className="text-sm text-slate-300 mt-2">
              {mode === "survival"
                ? "Final round: keep stacking until you hit the top. Speed increases every 15 seconds."
                : "Timed round: continue your stack and clear rows before time runs out."}
            </p>
          </div>

          <div className="grid gap-3">
            <StatCard label="Score" value={score} />
            <StatCard label="Rows Cleared" value={linesCleared} />
            <StatCard label="Pieces Placed" value={piecesPlaced} />
            <StatCard
              label={mode === "survival" ? "Survival" : "Time Left"}
              value={mode === "survival" ? `${survivalSeconds}s` : `${timeLeft ?? 0}s`}
            />
          </div>

          <div className="mt-4 rounded-2xl bg-slate-800/70 p-3 border border-slate-700">
            <div className="text-sm font-bold mb-2">Controls</div>
            <div className="space-y-1 text-sm text-slate-300">
              <div>← / → or A / D Move</div>
              <div>↑ or W Rotate</div>
              <div>↓ or S Soft Drop</div>
              <div>Space Hard Drop</div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => exitGame("manual_exit")}
            className="mt-4 w-full rounded-2xl bg-cyan-500 hover:bg-cyan-400 transition px-4 py-3 font-bold text-slate-950"
          >
            Exit Round
          </button>
        </div>

        <div className="rounded-3xl bg-slate-900/90 border border-slate-700 p-4 shadow-2xl flex items-center justify-center">
          <div
            className="relative overflow-hidden rounded-2xl border border-slate-700"
            style={{
              width: "100%",
              maxWidth: 520,
              aspectRatio: `${BOARD_WIDTH} / ${BOARD_HEIGHT}`,
              backgroundColor: "#020617",
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${bgImage})`,
                backgroundSize: "70%",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                opacity: 0.18,
                filter: "blur(0.5px)",
              }}
            />

            <div
              className="absolute inset-0"
              style={{
                background: "rgba(2, 6, 23, 0.45)",
              }}
            />

            <div
              className="relative z-10 grid gap-1 h-full w-full p-3"
              style={{
                gridTemplateColumns: `repeat(${BOARD_WIDTH}, minmax(0, 1fr))`,
              }}
            >
              {renderBoard.flatMap((row, y) =>
                row.map((cell, x) => (
                  <div
                    key={`${x}-${y}`}
                    className={`rounded-md border border-slate-800/80 ${
                      cell ?? "bg-slate-900/55"
                    }`}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-slate-900/90 border border-slate-700 p-4 shadow-2xl">
          <div className="text-xs uppercase tracking-[0.2em] text-amber-300">
            Next Piece
          </div>

          <div className="mt-3 rounded-2xl bg-slate-800/80 p-4 border border-slate-700">
            <div className="grid grid-cols-4 gap-1 w-32 h-32 mx-auto">
              {Array.from({ length: 16 }).map((_, idx) => {
                const x = idx % 4;
                const y = Math.floor(idx / 4);
                const filled = nextBlocks.some((block) => block.x === x && block.y === y);

                return (
                  <div
                    key={idx}
                    className={`rounded-md border border-slate-700 ${
                      filled ? nextPiece.color : "bg-slate-900"
                    }`}
                  />
                );
              })}
            </div>
          </div>

          <div className="mt-4 rounded-2xl bg-slate-800/70 p-3 border border-slate-700">
            <div className="text-sm font-bold mb-2">Scoring</div>
            <div className="space-y-1 text-sm text-slate-300">
              <div>+10 each piece placed</div>
              <div>+100 single row</div>
              <div>+250 double row</div>
              <div>+450 triple row</div>
              <div>+700 four-row clear</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl mt-4 grid gap-3 md:grid-cols-4">
        <MobileButton label="Left" onClick={() => movePiece(-1, 0)} />
        <MobileButton label="Rotate" onClick={rotatePiece} />
        <MobileButton label="Right" onClick={() => movePiece(1, 0)} />
        <MobileButton label="Drop" onClick={hardDrop} />
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-slate-800/70 p-3 border border-slate-700">
      <div className="text-xs uppercase tracking-wider text-slate-400">{label}</div>
      <div className="text-2xl font-black mt-1">{value}</div>
    </div>
  );
}

function MobileButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-2xl bg-slate-800 border border-slate-700 px-4 py-4 font-bold text-white active:scale-[0.98] transition"
    >
      {label}
    </button>
  );
}
