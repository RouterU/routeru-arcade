import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

type ChefChaseMode = "timed" | "survival";

interface ChefChaseExitPayload {
  reason: "timer_complete" | "caught" | "manual_exit";
  score: number;
  pelletsCollected: number;
  bonusCollected: number;
}

interface ChefChaseProps {
  mode?: ChefChaseMode;
  timedSeconds?: number;
  title?: string;
  onExit?: (payload?: ChefChaseExitPayload) => void;
}

type Tile = 0 | 1;
type Position = { x: number; y: number };
type Direction = "up" | "down" | "left" | "right";

type Enemy = {
  id: string;
  x: number;
  y: number;
  colorClass: string;
  label: string;
  released: boolean;
  releaseAt: number;
};

type PersistedChefChaseState = {
  pellets: boolean[][];
  bonusMap: string[][];
  chef: Position;
  chefDir: Direction;
  enemies: Enemy[];
  score: number;
  pelletsCollected: number;
  bonusCollected: number;
  survivalSeconds: number;
  elapsedSeconds: number;
} | null;

const DEFAULT_TIMED_SECONDS = 15;
const TILE_SIZE = 38;
const MOVE_MS = 180;
const ENEMY_BASE_MS = 260;

let persistedChefChaseState: PersistedChefChaseState = null;

// 1 = wall, 0 = path
const MAZE: Tile[][] = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,1,0,0,0,1,0,0,0,1],
  [1,0,1,1,1,0,1,0,1,0,1,0,1,0,1],
  [1,0,1,0,0,0,0,0,1,0,0,0,1,0,1],
  [1,0,1,0,1,1,1,0,1,1,1,0,1,0,1],
  [1,0,0,0,1,0,0,0,0,0,1,0,0,0,1],
  [1,1,1,0,1,0,1,1,1,0,1,0,1,1,1],
  [1,0,0,0,0,0,1,0,1,0,0,0,0,0,1],
  [1,0,1,1,1,0,1,0,1,0,1,1,1,0,1],
  [1,0,1,0,0,0,0,0,0,0,0,0,1,0,1],
  [1,0,1,0,1,1,1,0,1,1,1,0,1,0,1],
  [1,0,0,0,1,0,0,0,0,0,1,0,0,0,1],
  [1,0,1,1,1,0,1,1,1,0,1,1,1,0,1],
  [1,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

const START_CHEF: Position = { x: 1, y: 1 };

const START_ENEMIES: Enemy[] = [
  { id: "sysco", x: 13, y: 1, colorClass: "bg-red-500", label: "SV", released: true, releaseAt: 0 },
  { id: "pfg", x: 7, y: 7, colorClass: "bg-sky-400", label: "PG", released: false, releaseAt: 6 },
  { id: "gfs", x: 7, y: 8, colorClass: "bg-lime-400", label: "GF", released: false, releaseAt: 12 },
];

const BONUS_ITEMS: Record<string, { points: number; label: string }> = {
  steak: { points: 40, label: "🥩" },
  chicken: { points: 30, label: "🍗" },
  pasta: { points: 35, label: "🍝" },
};

const BONUS_LOCATIONS = [
  { x: 7, y: 1, item: "steak" },
  { x: 7, y: 13, item: "pasta" },
  { x: 3, y: 9, item: "steak" },
  { x: 11, y: 5, item: "pasta" },
  { x: 7, y: 11, item: "chicken" },
];

function inBounds(x: number, y: number) {
  return y >= 0 && y < MAZE.length && x >= 0 && x < MAZE[0].length;
}

function isPath(x: number, y: number) {
  return inBounds(x, y) && MAZE[y][x] === 0;
}

function createInitialPellets() {
  return MAZE.map((row, y) =>
    row.map((cell, x) => {
      const isStart = x === START_CHEF.x && y === START_CHEF.y;
      const isBonus = BONUS_LOCATIONS.some((b) => b.x === x && b.y === y);
      const isPen = (x === 7 && y === 7) || (x === 7 && y === 8);
      return cell === 0 && !isStart && !isBonus && !isPen;
    })
  );
}

function createInitialBonusMap() {
  const map = MAZE.map((row) => row.map(() => ""));
  for (const bonus of BONUS_LOCATIONS) {
    map[bonus.y][bonus.x] = bonus.item;
  }
  return map;
}

function getFreshState() {
  return {
    pellets: createInitialPellets(),
    bonusMap: createInitialBonusMap(),
    chef: { ...START_CHEF },
    chefDir: "right" as Direction,
    enemies: START_ENEMIES.map((e) => ({ ...e })),
    score: 0,
    pelletsCollected: 0,
    bonusCollected: 0,
    survivalSeconds: 0,
    elapsedSeconds: 0,
  };
}

function getInitialState() {
  return persistedChefChaseState ?? getFreshState();
}

function nextPos(pos: Position, dir: Direction): Position {
  if (dir === "up") return { x: pos.x, y: pos.y - 1 };
  if (dir === "down") return { x: pos.x, y: pos.y + 1 };
  if (dir === "left") return { x: pos.x - 1, y: pos.y };
  return { x: pos.x + 1, y: pos.y };
}

function validDirections(pos: Position): Direction[] {
  const dirs: Direction[] = ["up", "down", "left", "right"];
  return dirs.filter((dir) => {
    const n = nextPos(pos, dir);
    return isPath(n.x, n.y);
  });
}

function manhattan(a: Position, b: Position) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function chooseEnemyMove(enemy: Position, chef: Position): Direction {
  const dirs = validDirections(enemy);
  if (dirs.length === 0) return "left";

  const roll = Math.random();
  if (roll < 0.22) {
    return dirs[Math.floor(Math.random() * dirs.length)];
  }

  let bestDir = dirs[0];
  let bestScore = Number.POSITIVE_INFINITY;

  for (const dir of dirs) {
    const n = nextPos(enemy, dir);
    const d = manhattan(n, chef);
    if (d < bestScore) {
      bestScore = d;
      bestDir = dir;
    }
  }

  return bestDir;
}

export default function ChefChase({
  mode = "timed",
  timedSeconds = DEFAULT_TIMED_SECONDS,
  title = "Chef Chase",
  onExit,
}: ChefChaseProps) {
  const initial = useMemo(() => getInitialState(), []);

  const [pellets, setPellets] = useState<boolean[][]>(() => initial.pellets);
  const [bonusMap, setBonusMap] = useState<string[][]>(() => initial.bonusMap);
  const [chef, setChef] = useState<Position>(() => initial.chef);
  const [chefDir, setChefDir] = useState<Direction>(() => initial.chefDir);
  const [queuedDir, setQueuedDir] = useState<Direction | null>(null);
  const [enemies, setEnemies] = useState<Enemy[]>(() => initial.enemies);
  const [score, setScore] = useState(initial.score);
  const [pelletsCollected, setPelletsCollected] = useState(initial.pelletsCollected);
  const [bonusCollected, setBonusCollected] = useState(initial.bonusCollected);
  const [timeLeft, setTimeLeft] = useState<number | null>(
    mode === "timed" ? Math.max(1, timedSeconds) : null
  );
  const [survivalSeconds, setSurvivalSeconds] = useState(initial.survivalSeconds);
  const [elapsedSeconds, setElapsedSeconds] = useState(initial.elapsedSeconds);
  const [isRunning, setIsRunning] = useState(true);

  const chefRef = useRef(chef);
  const chefDirRef = useRef(chefDir);
  const queuedDirRef = useRef<Direction | null>(queuedDir);
  const enemiesRef = useRef(enemies);
  const scoreRef = useRef(score);
  const pelletsCollectedRef = useRef(pelletsCollected);
  const bonusCollectedRef = useRef(bonusCollected);
  const pelletsRef = useRef(pellets);
  const bonusMapRef = useRef(bonusMap);

  useEffect(() => { chefRef.current = chef; }, [chef]);
  useEffect(() => { chefDirRef.current = chefDir; }, [chefDir]);
  useEffect(() => { queuedDirRef.current = queuedDir; }, [queuedDir]);
  useEffect(() => { enemiesRef.current = enemies; }, [enemies]);
  useEffect(() => { scoreRef.current = score; }, [score]);
  useEffect(() => { pelletsCollectedRef.current = pelletsCollected; }, [pelletsCollected]);
  useEffect(() => { bonusCollectedRef.current = bonusCollected; }, [bonusCollected]);
  useEffect(() => { pelletsRef.current = pellets; }, [pellets]);
  useEffect(() => { bonusMapRef.current = bonusMap; }, [bonusMap]);

  useEffect(() => {
    persistedChefChaseState = {
      pellets,
      bonusMap,
      chef,
      chefDir,
      enemies,
      score,
      pelletsCollected,
      bonusCollected,
      survivalSeconds,
      elapsedSeconds,
    };
  }, [pellets, bonusMap, chef, chefDir, enemies, score, pelletsCollected, bonusCollected, survivalSeconds, elapsedSeconds]);

  const enemyMoveMs = useMemo(() => {
    if (mode !== "survival") return ENEMY_BASE_MS;
    const level = Math.floor(survivalSeconds / 15);
    return Math.max(120, ENEMY_BASE_MS - level * 20);
  }, [mode, survivalSeconds]);

  const exitGame = useCallback(
    (reason: "timer_complete" | "caught" | "manual_exit") => {
      setIsRunning(false);

      if (reason === "caught" || mode === "survival") {
        persistedChefChaseState = null;
      }

      onExit?.({
        reason,
        score: scoreRef.current,
        pelletsCollected: pelletsCollectedRef.current,
        bonusCollected: bonusCollectedRef.current,
      });
    },
    [mode, onExit]
  );

  const collectAtPosition = useCallback((pos: Position) => {
    const pGrid = pelletsRef.current.map((row) => [...row]);
    const bGrid = bonusMapRef.current.map((row) => [...row]);
    let gained = 0;
    let pelletGain = 0;
    let bonusGain = 0;

    if (pGrid[pos.y][pos.x]) {
      pGrid[pos.y][pos.x] = false;
      gained += 10;
      pelletGain += 1;
    }

    const bonusItem = bGrid[pos.y][pos.x];
    if (bonusItem) {
      gained += BONUS_ITEMS[bonusItem].points;
      bonusGain += 1;
      bGrid[pos.y][pos.x] = "";
    }

    if (gained > 0) {
      setPellets(pGrid);
      setBonusMap(bGrid);
      setScore((prev) => prev + gained);
      if (pelletGain) setPelletsCollected((prev) => prev + pelletGain);
      if (bonusGain) setBonusCollected((prev) => prev + bonusGain);
    }
  }, []);

  const moveChefStep = useCallback(() => {
    if (!isRunning) return;

    const current = chefRef.current;
    let activeDir = chefDirRef.current;
    const queued = queuedDirRef.current;

    if (queued) {
      const tryQueued = nextPos(current, queued);
      if (isPath(tryQueued.x, tryQueued.y)) {
        activeDir = queued;
        setChefDir(queued);
        setQueuedDir(null);
      }
    }

    const next = nextPos(current, activeDir);
    if (!isPath(next.x, next.y)) {
      return;
    }

    setChef(next);
    collectAtPosition(next);

    const hit = enemiesRef.current.some(
      (enemy) => enemy.released && enemy.x === next.x && enemy.y === next.y
    );
    if (hit) {
      exitGame("caught");
    }
  }, [collectAtPosition, exitGame, isRunning]);

  const moveEnemiesStep = useCallback(() => {
    if (!isRunning) return;

    setEnemies((prev) => {
      const updated = prev.map((enemy) => {
        if (!enemy.released) return enemy;

        const dir = chooseEnemyMove({ x: enemy.x, y: enemy.y }, chefRef.current);
        const next = nextPos({ x: enemy.x, y: enemy.y }, dir);
        return isPath(next.x, next.y) ? { ...enemy, x: next.x, y: next.y } : enemy;
      });

      const caught = updated.some(
        (enemy) => enemy.released && enemy.x === chefRef.current.x && enemy.y === chefRef.current.y
      );

      if (caught) {
        window.setTimeout(() => exitGame("caught"), 0);
      }

      return updated;
    });
  }, [exitGame, isRunning]);

  useEffect(() => {
    if (!isRunning) return;
    const interval = window.setInterval(moveChefStep, MOVE_MS);
    return () => window.clearInterval(interval);
  }, [isRunning, moveChefStep]);

  useEffect(() => {
    if (!isRunning) return;
    const interval = window.setInterval(moveEnemiesStep, enemyMoveMs);
    return () => window.clearInterval(interval);
  }, [enemyMoveMs, isRunning, moveEnemiesStep]);

  useEffect(() => {
    if (!isRunning) return;

    const timer = window.setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);

      setEnemies((prev) =>
        prev.map((enemy) => {
          if (!enemy.released && elapsedSeconds + 1 >= enemy.releaseAt) {
            return { ...enemy, released: true };
          }
          return enemy;
        })
      );

      if (mode === "timed") {
        setTimeLeft((prev) => {
          if (prev === null) return prev;
          if (prev <= 1) {
            window.clearInterval(timer);
            exitGame("timer_complete");
            return 0;
          }
          return prev - 1;
        });
      } else {
        setSurvivalSeconds((prev) => prev + 1);
      }
    }, 1000);

    return () => window.clearInterval(timer);
  }, [elapsedSeconds, exitGame, isRunning, mode]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isRunning) return;

      const controlledKeys = [
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        "a",
        "d",
        "w",
        "s",
      ];

      if (controlledKeys.includes(event.key) || controlledKeys.includes(event.key.toLowerCase())) {
        event.preventDefault();
      }

      if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") setQueuedDir("left");
      if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") setQueuedDir("right");
      if (event.key === "ArrowUp" || event.key.toLowerCase() === "w") setQueuedDir("up");
      if (event.key === "ArrowDown" || event.key.toLowerCase() === "s") setQueuedDir("down");
    };

    window.addEventListener("keydown", handleKeyDown, { passive: false });
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isRunning]);

  const remainingPellets = useMemo(
    () => pellets.reduce((sum, row) => sum + row.filter(Boolean).length, 0),
    [pellets]
  );

  const boardWidth = MAZE[0].length * TILE_SIZE;
  const boardHeight = MAZE.length * TILE_SIZE;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-6 overflow-hidden">
      <div className="mx-auto max-w-[1500px] grid gap-4 lg:grid-cols-[320px_1fr_280px]">
        <div className="rounded-3xl bg-slate-900/90 border border-slate-700 p-4 shadow-2xl">
          <div className="mb-4">
            <div className="text-xs uppercase tracking-[0.2em] text-amber-300">
              Mini Game
            </div>
            <h1 className="text-3xl font-black mt-1">{title}</h1>
            <p className="text-sm text-slate-300 mt-2">
              {mode === "survival"
                ? "Final round: survive the maze as enemies release and speed up."
                : "Collect food, grab bonus proteins, and avoid the rivals."}
            </p>
          </div>

          <div className="grid gap-3">
            <StatCard label="Score" value={score} />
            <StatCard label="Pellets" value={pelletsCollected} />
            <StatCard label="Bonus Foods" value={bonusCollected} />
            <StatCard
              label={mode === "survival" ? "Survival" : "Time Left"}
              value={mode === "survival" ? `${survivalSeconds}s` : `${timeLeft ?? 0}s`}
            />
          </div>

          <div className="mt-4 rounded-2xl bg-slate-800/70 p-3 border border-slate-700">
            <div className="text-sm font-bold mb-2">Controls</div>
            <div className="space-y-1 text-sm text-slate-300">
              <div>← ↑ ↓ → Move</div>
              <div>W A S D also works</div>
              <div>Chef keeps moving like an arcade maze game</div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => exitGame("manual_exit")}
            className="mt-4 w-full rounded-2xl bg-amber-400 hover:bg-amber-300 transition px-4 py-3 font-bold text-slate-950"
          >
            Exit Round
          </button>
        </div>

        <div className="rounded-3xl bg-slate-900/90 border border-slate-700 p-4 shadow-2xl flex items-center justify-center">
          <div
            className="relative rounded-2xl overflow-hidden border border-slate-700 bg-slate-950"
            style={{ width: boardWidth, height: boardHeight }}
          >
            {MAZE.map((row, y) =>
              row.map((cell, x) => {
                const isWall = cell === 1;
                const hasPellet = pellets[y][x];
                const bonus = bonusMap[y][x];
                const isChef = chef.x === x && chef.y === y;
                const enemy = enemies.find((e) => e.x === x && e.y === y && e.released);

                return (
                  <div
                    key={`${x}-${y}`}
                    className="absolute"
                    style={{
                      left: x * TILE_SIZE,
                      top: y * TILE_SIZE,
                      width: TILE_SIZE,
                      height: TILE_SIZE,
                    }}
                  >
                    <div
                      className={`w-full h-full ${
                        isWall ? "bg-blue-900 border border-blue-500/40" : "bg-slate-950"
                      }`}
                    />

                    {!isWall && hasPellet && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-300" />
                      </div>
                    )}

                    {!isWall && bonus && (
                      <div className="absolute inset-0 flex items-center justify-center text-xl">
                        {BONUS_ITEMS[bonus].label}
                      </div>
                    )}

                    {enemy && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div
                          className={`w-7 h-7 rounded-full ${enemy.colorClass} flex items-center justify-center text-[10px] font-black text-slate-950`}
                        >
                          {enemy.label}
                        </div>
                      </div>
                    )}

                    {isChef && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-7 h-7 rounded-full bg-white border-2 border-red-500 flex items-center justify-center text-sm">
                          👨‍🍳
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}

            <div
              className="absolute rounded-xl border-2 border-dashed border-slate-500/70 bg-slate-800/60 flex items-center justify-center text-[11px] font-semibold text-slate-300"
              style={{
                left: 6 * TILE_SIZE,
                top: 6.5 * TILE_SIZE,
                width: 3 * TILE_SIZE,
                height: 2 * TILE_SIZE,
              }}
            >
              PEN
            </div>

            {enemies
              .filter((enemy) => !enemy.released)
              .map((enemy, idx) => (
                <div
                  key={enemy.id}
                  className="absolute flex items-center justify-center"
                  style={{
                    left: (6.7 + (idx % 2) * 1.2) * TILE_SIZE,
                    top: (6.9 + Math.floor(idx / 2) * 0.9) * TILE_SIZE,
                    width: TILE_SIZE,
                    height: TILE_SIZE,
                  }}
                >
                  <div
                    className={`w-7 h-7 rounded-full ${enemy.colorClass} flex items-center justify-center text-[10px] font-black text-slate-950 opacity-80`}
                  >
                    {enemy.label}
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="rounded-3xl bg-slate-900/90 border border-slate-700 p-4 shadow-2xl">
          <div className="text-xs uppercase tracking-[0.2em] text-cyan-300">
            Targets
          </div>

          <div className="mt-3 space-y-3">
            <LegendRow label="Apple / Orange / Fruit pickups" value="+10" colorClass="bg-red-300" />
            <LegendRow label="Steak" value="+40" emoji="🥩" />
            <LegendRow label="Chicken Leg" value="+30" emoji="🍗" />
            <LegendRow label="Pasta Bowl" value="+35" emoji="🍝" />
          </div>

          <div className="mt-4 rounded-2xl bg-slate-800/70 p-3 border border-slate-700">
            <div className="text-sm font-bold mb-2">Maze Status</div>
            <div className="space-y-1 text-sm text-slate-300">
              <div>Remaining food: {remainingPellets}</div>
              <div>Enemies active: {enemies.filter((e) => e.released).length}</div>
              <div>Enemies in pen: {enemies.filter((e) => !e.released).length}</div>
              <div>Mode: {mode === "survival" ? "Final Survival" : "Timed Round"}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1500px] mt-4 grid gap-3 md:grid-cols-4">
        <MobileButton label="Left" onClick={() => setQueuedDir("left")} />
        <MobileButton label="Up" onClick={() => setQueuedDir("up")} />
        <MobileButton label="Right" onClick={() => setQueuedDir("right")} />
        <MobileButton label="Down" onClick={() => setQueuedDir("down")} />
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

function LegendRow({
  label,
  value,
  colorClass,
  emoji,
}: {
  label: string;
  value: string;
  colorClass?: string;
  emoji?: string;
}) {
  return (
    <div className="rounded-2xl p-3 border flex items-center gap-3 bg-slate-800/70 border-slate-700">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-slate-900 border border-slate-700">
        {emoji ? (
          <span className="text-lg">{emoji}</span>
        ) : (
          <div className={`w-4 h-4 rounded-full ${colorClass ?? "bg-white"}`} />
        )}
      </div>
      <div className="flex-1">
        <div className="text-sm font-semibold text-slate-100">{label}</div>
        <div className="text-xs text-slate-400">{value}</div>
      </div>
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
