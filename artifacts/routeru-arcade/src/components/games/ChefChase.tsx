import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import chefSprite from "@/pages/chefchaos.png";
import vampireSprite from "@/pages/vampire.png";
import ghostSprite from "@/pages/ghost.png";
import monsterSprite from "@/pages/monster.png";

type ChefChaseMode = "timed" | "survival";

interface ChefChaseExitPayload {
  reason: "timer_complete" | "caught" | "manual_exit" | "completed";
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
  id: "sysco" | "pfg" | "gfs";
  x: number;
  y: number;
  released: boolean;
  releaseAt: number;
  homeX: number;
  homeY: number;
};

const DEFAULT_TIMED_SECONDS = 15;
const BASE_MOVE_MS = 165;
const ENEMY_BASE_MS = 250;
const FINAL_LEVEL_1_SECONDS = 12;
const FINAL_LEVEL_2_SECONDS = 12;

const CHEF_SIZE = 98;
const ENEMY_SIZE = 98;
const PEN_ENEMY_SIZE = 72;

const POWER_MODE_SECONDS = 7;
const ENEMY_EAT_POINTS = 125;

// 1 = wall, 0 = path
const MAZE: Tile[][] = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

const GRID_ROWS = MAZE.length;
const GRID_COLS = MAZE[0].length;

const START_CHEF: Position = { x: 1, y: 1 };

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

function getEnemySprite(id: Enemy["id"]) {
  if (id === "sysco") return vampireSprite;
  if (id === "pfg") return ghostSprite;
  return monsterSprite;
}

function getEnemyName(id: Enemy["id"]) {
  if (id === "sysco") return "Sysco Vampire";
  if (id === "pfg") return "PFG Ghost";
  return "GFS Monster";
}

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
      const isPen =
        (x === 6 && y === 7) ||
        (x === 7 && y === 7) ||
        (x === 8 && y === 7) ||
        (x === 6 && y === 8) ||
        (x === 7 && y === 8) ||
        (x === 8 && y === 8);
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

function buildEnemiesForLevel(level: 1 | 2): Enemy[] {
  if (level === 1) {
    return [
      { id: "sysco", x: 13, y: 1, released: true, releaseAt: 0, homeX: 7, homeY: 7 },
      { id: "pfg", x: 7, y: 7, released: false, releaseAt: 6, homeX: 7, homeY: 7 },
      { id: "gfs", x: 7, y: 8, released: false, releaseAt: 12, homeX: 7, homeY: 8 },
    ];
  }

  return [
    { id: "sysco", x: 13, y: 1, released: true, releaseAt: 0, homeX: 7, homeY: 7 },
    { id: "pfg", x: 7, y: 7, released: false, releaseAt: 4, homeX: 7, homeY: 7 },
    { id: "gfs", x: 7, y: 8, released: false, releaseAt: 8, homeX: 7, homeY: 8 },
  ];
}

function getFreshState(level: 1 | 2) {
  return {
    pellets: createInitialPellets(),
    bonusMap: createInitialBonusMap(),
    chef: { ...START_CHEF },
    chefDir: "right" as Direction,
    enemies: buildEnemiesForLevel(level),
    score: 0,
    pelletsCollected: 0,
    bonusCollected: 0,
    survivalSeconds: 0,
    elapsedSeconds: 0,
  };
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

function chooseEnemyMove(
  enemy: Position,
  chef: Position,
  level: 1 | 2,
  vulnerable: boolean
): Direction {
  const dirs = validDirections(enemy);
  if (dirs.length === 0) return "left";

  const randomChance = vulnerable ? 0.42 : level === 1 ? 0.22 : 0.12;
  const roll = Math.random();

  if (roll < randomChance) {
    return dirs[Math.floor(Math.random() * dirs.length)];
  }

  let bestDir = dirs[0];
  let bestScore = vulnerable ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;

  for (const dir of dirs) {
    const n = nextPos(enemy, dir);
    const d = manhattan(n, chef);

    if (!vulnerable && d < bestScore) {
      bestScore = d;
      bestDir = dir;
    }

    if (vulnerable && d > bestScore) {
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
  const startingLevel: 1 | 2 = 1;
  const initial = useMemo(() => getFreshState(startingLevel), []);

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
  const [level, setLevel] = useState<1 | 2>(1);
  const [showLevelMessage, setShowLevelMessage] = useState(mode === "survival");
  const [levelMessage, setLevelMessage] = useState(mode === "survival" ? "LEVEL 1" : "");
  const [powerModeSeconds, setPowerModeSeconds] = useState(0);

  const [tileSize, setTileSize] = useState(46);

  const chefRef = useRef(chef);
  const chefDirRef = useRef(chefDir);
  const queuedDirRef = useRef<Direction | null>(queuedDir);
  const enemiesRef = useRef(enemies);
  const scoreRef = useRef(score);
  const pelletsCollectedRef = useRef(pelletsCollected);
  const bonusCollectedRef = useRef(bonusCollected);
  const pelletsRef = useRef(pellets);
  const bonusMapRef = useRef(bonusMap);
  const levelRef = useRef(level);
  const powerModeRef = useRef(powerModeSeconds);

  useEffect(() => {
    const calcTileSize = () => {
      const viewportW = window.innerWidth;
      const viewportH = window.innerHeight;

      const reservedSidePanels = viewportW >= 1024 ? 300 + 260 + 70 : 40;
      const reservedVertical = 120;

      const availableW = Math.max(560, viewportW - reservedSidePanels);
      const availableH = Math.max(560, viewportH - reservedVertical);

      const byWidth = Math.floor(availableW / GRID_COLS);
      const byHeight = Math.floor(availableH / GRID_ROWS);

      const next = Math.max(38, Math.min(72, Math.min(byWidth, byHeight)));
      setTileSize(next);
    };

    calcTileSize();
    window.addEventListener("resize", calcTileSize);
    return () => window.removeEventListener("resize", calcTileSize);
  }, []);

  useEffect(() => {
    chefRef.current = chef;
  }, [chef]);
  useEffect(() => {
    chefDirRef.current = chefDir;
  }, [chefDir]);
  useEffect(() => {
    queuedDirRef.current = queuedDir;
  }, [queuedDir]);
  useEffect(() => {
    enemiesRef.current = enemies;
  }, [enemies]);
  useEffect(() => {
    scoreRef.current = score;
  }, [score]);
  useEffect(() => {
    pelletsCollectedRef.current = pelletsCollected;
  }, [pelletsCollected]);
  useEffect(() => {
    bonusCollectedRef.current = bonusCollected;
  }, [bonusCollected]);
  useEffect(() => {
    pelletsRef.current = pellets;
  }, [pellets]);
  useEffect(() => {
    bonusMapRef.current = bonusMap;
  }, [bonusMap]);
  useEffect(() => {
    levelRef.current = level;
  }, [level]);
  useEffect(() => {
    powerModeRef.current = powerModeSeconds;
  }, [powerModeSeconds]);

  useEffect(() => {
    if (!showLevelMessage) return;
    const timeout = window.setTimeout(() => {
      setShowLevelMessage(false);
    }, 1600);
    return () => window.clearTimeout(timeout);
  }, [showLevelMessage]);

  const enemyMoveMs = useMemo(() => {
    if (mode !== "survival") return ENEMY_BASE_MS;
    if (level === 1) return ENEMY_BASE_MS;
    return 180;
  }, [mode, level]);

  const resetForLevelTwo = useCallback(() => {
    const nextState = getFreshState(2);

    setPellets(nextState.pellets);
    setBonusMap(nextState.bonusMap);
    setChef(nextState.chef);
    setChefDir(nextState.chefDir);
    setQueuedDir(null);
    setEnemies(nextState.enemies);
    setElapsedSeconds(0);
    setPowerModeSeconds(0);
    setLevel(2);
    setLevelMessage("LEVEL 1 COMPLETE");
    setShowLevelMessage(true);
  }, []);

  const exitGame = useCallback(
    (reason: "timer_complete" | "caught" | "manual_exit" | "completed") => {
      setIsRunning(false);
      onExit?.({
        reason,
        score: scoreRef.current,
        pelletsCollected: pelletsCollectedRef.current,
        bonusCollected: bonusCollectedRef.current,
      });
    },
    [onExit]
  );

  const sendEnemyToPen = useCallback(
    (enemyId: Enemy["id"]) => {
      setEnemies((prev) =>
        prev.map((enemy) => {
          if (enemy.id !== enemyId) return enemy;
          const reReleaseDelay = levelRef.current === 1 ? 4 : 3;
          return {
            ...enemy,
            x: enemy.homeX,
            y: enemy.homeY,
            released: false,
            releaseAt: elapsedSeconds + reReleaseDelay,
          };
        })
      );
    },
    [elapsedSeconds]
  );

  const collectAtPosition = useCallback((pos: Position) => {
    const pGrid = pelletsRef.current.map((row) => [...row]);
    const bGrid = bonusMapRef.current.map((row) => [...row]);
    let gained = 0;
    let pelletGain = 0;
    let bonusGain = 0;
    let triggeredPower = false;

    if (pGrid[pos.y][pos.x]) {
      pGrid[pos.y][pos.x] = false;
      gained += 10;
      pelletGain += 1;
    }

    const bonusItem = bGrid[pos.y][pos.x];
    if (bonusItem) {
      gained += BONUS_ITEMS[bonusItem].points;
      bonusGain += 1;
      triggeredPower = true;
      bGrid[pos.y][pos.x] = "";
    }

    if (gained > 0) {
      setPellets(pGrid);
      setBonusMap(bGrid);
      setScore((prev) => prev + gained);
      if (pelletGain) setPelletsCollected((prev) => prev + pelletGain);
      if (bonusGain) setBonusCollected((prev) => prev + bonusGain);
    }

    if (triggeredPower) {
      setPowerModeSeconds(POWER_MODE_SECONDS);
    }
  }, []);

  const moveChefStep = useCallback(() => {
    if (!isRunning || showLevelMessage) return;

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
    if (!isPath(next.x, next.y)) return;

    setChef(next);
    collectAtPosition(next);

    const hitEnemy = enemiesRef.current.find(
      (enemy) => enemy.released && enemy.x === next.x && enemy.y === next.y
    );

    if (hitEnemy) {
      if (powerModeRef.current > 0) {
        setScore((prev) => prev + ENEMY_EAT_POINTS);
        sendEnemyToPen(hitEnemy.id);
      } else {
        exitGame("caught");
      }
    }
  }, [collectAtPosition, exitGame, isRunning, sendEnemyToPen, showLevelMessage]);

  const moveEnemiesStep = useCallback(() => {
    if (!isRunning || showLevelMessage) return;

    setEnemies((prev) => {
      const updated = prev.map((enemy) => {
        if (!enemy.released) return enemy;

        const dir = chooseEnemyMove(
          { x: enemy.x, y: enemy.y },
          chefRef.current,
          levelRef.current,
          powerModeRef.current > 0
        );
        const next = nextPos({ x: enemy.x, y: enemy.y }, dir);
        return isPath(next.x, next.y) ? { ...enemy, x: next.x, y: next.y } : enemy;
      });

      const collidedEnemy = updated.find(
        (enemy) => enemy.released && enemy.x === chefRef.current.x && enemy.y === chefRef.current.y
      );

      if (collidedEnemy) {
        if (powerModeRef.current > 0) {
          window.setTimeout(() => {
            setScore((prev) => prev + ENEMY_EAT_POINTS);
            sendEnemyToPen(collidedEnemy.id);
          }, 0);
        } else {
          window.setTimeout(() => exitGame("caught"), 0);
        }
      }

      return updated;
    });
  }, [exitGame, isRunning, sendEnemyToPen, showLevelMessage]);

  useEffect(() => {
    if (!isRunning) return;
    const interval = window.setInterval(moveChefStep, BASE_MOVE_MS);
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
      if (showLevelMessage) return;

      setElapsedSeconds((prev) => {
        const nextElapsed = prev + 1;

        setEnemies((currentEnemies) =>
          currentEnemies.map((enemy) => {
            if (!enemy.released && nextElapsed >= enemy.releaseAt) {
              return { ...enemy, released: true };
            }
            return enemy;
          })
        );

        return nextElapsed;
      });

      if (powerModeRef.current > 0) {
        setPowerModeSeconds((prev) => Math.max(0, prev - 1));
      }

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
        setSurvivalSeconds((prev) => {
          const next = prev + 1;

          if (levelRef.current === 1 && next >= FINAL_LEVEL_1_SECONDS) {
            window.setTimeout(() => {
              resetForLevelTwo();
            }, 0);
            return next;
          }

          if (levelRef.current === 2 && next >= FINAL_LEVEL_1_SECONDS + FINAL_LEVEL_2_SECONDS) {
            window.clearInterval(timer);
            exitGame("completed");
            return next;
          }

          return next;
        });
      }
    }, 1000);

    return () => window.clearInterval(timer);
  }, [exitGame, isRunning, mode, resetForLevelTwo, showLevelMessage]);

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

      if (
        controlledKeys.includes(event.key) ||
        controlledKeys.includes(event.key.toLowerCase())
      ) {
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

  const boardWidth = GRID_COLS * tileSize;
  const boardHeight = GRID_ROWS * tileSize;

  const chefSize = Math.max(CHEF_SIZE, Math.round(tileSize * 1.55));
  const enemySize = Math.max(ENEMY_SIZE, Math.round(tileSize * 1.55));
  const penEnemySize = Math.max(PEN_ENEMY_SIZE, Math.round(tileSize * 1.2));

  const wallFillClass =
    level === 1 ? "bg-blue-900/95" : "bg-purple-900/95";

  const borderGlow =
    level === 1 ? "rgba(59,130,246,0.45)" : "rgba(217,70,239,0.45)";

  const boardBgClass = "bg-slate-950";

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-6 overflow-hidden">
      <div className="mx-auto max-w-[1900px] grid gap-4 lg:grid-cols-[300px_1fr_260px]">
        <div className="rounded-3xl bg-slate-900/90 border border-slate-700 p-4 shadow-2xl">
          <div className="mb-4">
            <div className="text-xs uppercase tracking-[0.2em] text-amber-300">
              Mini Game
            </div>
            <h1 className="text-3xl font-black mt-1">{title}</h1>
            <p className="text-sm text-slate-300 mt-2">
              {mode === "survival"
                ? "Final round: beat Level 1 to unlock Level 2. Bonus foods weaken villains."
                : "Collect food, trigger power mode, and eat weakened villains."}
            </p>
          </div>

          <div className="grid gap-3">
            <StatCard label="Score" value={score} />
            <StatCard label="Pellets" value={pelletsCollected} />
            <StatCard label="Bonus Foods" value={bonusCollected} />
            <StatCard
              label={mode === "survival" ? "Level" : "Time Left"}
              value={mode === "survival" ? `Level ${level}` : `${timeLeft ?? 0}s`}
            />
            <StatCard
              label="Power Mode"
              value={powerModeSeconds > 0 ? `${powerModeSeconds}s` : "Off"}
            />
          </div>

          <div className="mt-4 rounded-2xl bg-slate-800/70 p-3 border border-slate-700">
            <div className="text-sm font-bold mb-2">Controls</div>
            <div className="space-y-1 text-sm text-slate-300">
              <div>← ↑ ↓ → Move</div>
              <div>W A S D also works</div>
              <div>Bonus foods trigger power mode</div>
              <div>Eat weakened villains for +125</div>
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

        <div className="rounded-3xl bg-slate-900/90 border border-slate-700 p-4 shadow-2xl flex items-center justify-center overflow-hidden">
          <div
            className="flex items-center justify-center w-full"
            style={{ minHeight: "calc(100vh - 120px)" }}
          >
            <div
              className={`relative rounded-[2rem] overflow-hidden border ${boardBgClass}`}
              style={{
                width: boardWidth,
                height: boardHeight,
                borderColor: "rgba(59,130,246,0.35)",
                boxShadow: `0 0 0 1px ${borderGlow} inset, 0 0 28px rgba(0,0,0,0.35)`,
              }}
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
                        left: x * tileSize,
                        top: y * tileSize,
                        width: tileSize,
                        height: tileSize,
                      }}
                    >
                      {isWall ? (
                        <div
                          className={`absolute inset-[12px] rounded-[999px] ${wallFillClass}`}
                          style={{
                            boxShadow: `0 0 0 1px ${borderGlow} inset, 0 0 10px ${borderGlow}`,
                          }}
                        />
                      ) : (
                        <div className="absolute inset-0 bg-slate-950" />
                      )}

                      {!isWall && hasPellet && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div
                            className="rounded-full bg-red-300 shadow-[0_0_10px_rgba(252,165,165,0.7)]"
                            style={{
                              width: Math.max(7, tileSize * 0.15),
                              height: Math.max(7, tileSize * 0.15),
                            }}
                          />
                        </div>
                      )}

                      {!isWall && bonus && (
                        <div
                          className="absolute inset-0 flex items-center justify-center"
                          style={{ fontSize: Math.max(20, tileSize * 0.58) }}
                        >
                          {BONUS_ITEMS[bonus].label}
                        </div>
                      )}

                      {enemy && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <img
                            src={getEnemySprite(enemy.id)}
                            alt={getEnemyName(enemy.id)}
                            className="pointer-events-none select-none"
                            style={{
                              width: enemySize,
                              height: enemySize,
                              objectFit: "contain",
                              imageRendering: "pixelated",
                              transform: powerModeSeconds > 0 ? "scale(1.04)" : "scale(1)",
                              filter:
                                powerModeSeconds > 0
                                  ? "drop-shadow(0 0 12px rgba(147,197,253,0.95)) saturate(0.65) brightness(1.08)"
                                  : "drop-shadow(0 4px 10px rgba(0,0,0,0.55))",
                              opacity: powerModeSeconds > 0 ? 0.82 : 1,
                              transition: "transform 120ms linear, filter 120ms linear, opacity 120ms linear",
                            }}
                          />
                        </div>
                      )}

                      {isChef && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <img
                            src={chefSprite}
                            alt="Chef"
                            className="pointer-events-none select-none"
                            style={{
                              width: chefSize,
                              height: chefSize,
                              objectFit: "contain",
                              imageRendering: "pixelated",
                              filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.58))",
                            }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })
              )}

              <div
                className={`absolute rounded-2xl border-2 border-dashed flex items-center justify-center font-semibold ${
                  level === 1
                    ? "border-slate-500/70 bg-slate-800/40 text-slate-300"
                    : "border-fuchsia-400/70 bg-fuchsia-950/30 text-fuchsia-200"
                }`}
                style={{
                  left: 6 * tileSize,
                  top: 6.5 * tileSize,
                  width: 3 * tileSize,
                  height: 2 * tileSize,
                  fontSize: Math.max(11, tileSize * 0.24),
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
                      left: (6.65 + (idx % 2) * 1.2) * tileSize,
                      top: (6.85 + Math.floor(idx / 2) * 0.9) * tileSize,
                      width: tileSize,
                      height: tileSize,
                    }}
                  >
                    <img
                      src={getEnemySprite(enemy.id)}
                      alt={getEnemyName(enemy.id)}
                      className="pointer-events-none select-none opacity-90"
                      style={{
                        width: penEnemySize,
                        height: penEnemySize,
                        objectFit: "contain",
                        imageRendering: "pixelated",
                        filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.45))",
                      }}
                    />
                  </div>
                ))}

              {showLevelMessage && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-20">
                  <div className="rounded-3xl border border-amber-300/40 bg-slate-900/95 px-8 py-6 text-center shadow-2xl">
                    <div className="text-xs uppercase tracking-[0.25em] text-amber-300 mb-2">
                      Chef Chase
                    </div>
                    <div className="text-3xl font-black text-white">{levelMessage}</div>
                    {level === 2 && (
                      <div className="text-sm text-slate-300 mt-2">
                        New map color. Faster villains. Stay alive.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-slate-900/90 border border-slate-700 p-4 shadow-2xl">
          <div className="text-xs uppercase tracking-[0.2em] text-cyan-300">
            Targets
          </div>

          <div className="mt-3 space-y-3">
            <LegendRow label="Apple / Orange / Fruit pickups" value="+10" colorClass="bg-red-300" />
            <LegendRow label="Steak (Power Food)" value="+40" emoji="🥩" />
            <LegendRow label="Chicken Leg (Power Food)" value="+30" emoji="🍗" />
            <LegendRow label="Pasta Bowl (Power Food)" value="+35" emoji="🍝" />
          </div>

          <div className="mt-4 rounded-2xl bg-slate-800/70 p-3 border border-slate-700">
            <div className="text-sm font-bold mb-2">Maze Status</div>
            <div className="space-y-1 text-sm text-slate-300">
              <div>Remaining food: {remainingPellets}</div>
              <div>Enemies active: {enemies.filter((e) => e.released).length}</div>
              <div>Enemies in pen: {enemies.filter((e) => !e.released).length}</div>
              <div>Power mode: {powerModeSeconds > 0 ? "Active" : "Inactive"}</div>
              <div>
                Mode: {mode === "survival" ? `Final Survival · Level ${level}` : "Timed Round"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1900px] mt-4 grid gap-3 md:grid-cols-4">
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
