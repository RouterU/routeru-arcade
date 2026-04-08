import { useEffect, useMemo, useRef, useState } from "react";
import {
  Trophy,
  ChevronRight,
  RotateCcw,
  Route,
  Package,
  TrafficCone,
  Truck,
} from "lucide-react";
import { quizQuestions, type QuizQuestion } from "@/data/quizData";
import truckImg from "../pages/truck.png";
import packageImg from "../pages/package.png";
import goldCrateImg from "../pages/gold-crate.png";
import fuelCanImg from "../pages/fuel-can.png";
import coneImg from "../pages/traffic-cone.png";
import palletImg from "../pages/pallet.png";
import carImg from "../pages/traffic-car.png";

interface RouteRunnerGameProps {
  onComplete: (score: number) => void;
  onBack: () => void;
}

type Phase = "question" | "drive" | "results";
type AnswerState = "unanswered" | "correct" | "incorrect";
type DriveItemType = "package" | "gold" | "fuel" | "cone" | "pallet" | "car";

interface DriveItem {
  id: number;
  lane: number;
  y: number;
  type: DriveItemType;
}

const QUESTION_COUNT = 6;
const DRIVE_DURATIONS = [15, 15, 20];
const ROAD_LANES = 3;

const ITEM_META: Record<
  DriveItemType,
  {
    label: string;
    points: number;
    good: boolean;
  }
> = {
  package: {
    label: "PKG",
    points: 25,
    good: true,
  },
  gold: {
    label: "BONUS",
    points: 50,
    good: true,
  },
  fuel: {
    label: "FUEL",
    points: 15,
    good: true,
  },
  cone: {
    label: "CONE",
    points: -20,
    good: false,
  },
  pallet: {
    label: "PALLET",
    points: -25,
    good: false,
  },
  car: {
    label: "TRAFFIC",
    points: -40,
    good: false,
  },
};

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getRandomDriveItemType(): DriveItemType {
  const roll = Math.random();
  if (roll < 0.32) return "package";
  if (roll < 0.42) return "gold";
  if (roll < 0.54) return "fuel";
  if (roll < 0.72) return "cone";
  if (roll < 0.88) return "pallet";
  return "car";
}

function laneToLeftPercent(lane: number) {
  return lane === 0 ? 16 : lane === 1 ? 50 : 84;
}

function itemImage(type: DriveItemType) {
  switch (type) {
    case "package":
      return packageImg;
    case "gold":
      return goldCrateImg;
    case "fuel":
      return fuelCanImg;
    case "cone":
      return coneImg;
    case "pallet":
      return palletImg;
    case "car":
      return carImg;
    default:
      return packageImg;
  }
}

export default function RouteRunnerGame({
  onComplete,
  onBack,
}: RouteRunnerGameProps) {
  const [questions] = useState<QuizQuestion[]>(() =>
    shuffleArray(quizQuestions).slice(0, QUESTION_COUNT)
  );

  const [phase, setPhase] = useState<Phase>("question");

  const [currentIndex, setCurrentIndex] = useState(0);
  const [questionScore, setQuestionScore] = useState(0);
  const [driveScore, setDriveScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  const [answerState, setAnswerState] = useState<AnswerState>("unanswered");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [questionBonus, setQuestionBonus] = useState(0);

  const [driveRound, setDriveRound] = useState(0);
  const [driveLane, setDriveLane] = useState(1);
  const [driveItems, setDriveItems] = useState<DriveItem[]>([]);
  const [driveTimeLeft, setDriveTimeLeft] = useState(DRIVE_DURATIONS[0]);
  const [driveRoundScore, setDriveRoundScore] = useState(0);
  const [driveEnded, setDriveEnded] = useState(false);
  const [lastDriveGain, setLastDriveGain] = useState(0);
  const [lastDriveBonus, setLastDriveBonus] = useState(0);

  const itemIdRef = useRef(0);
  const driveLaneRef = useRef(1);
  const driveRoundScoreRef = useRef(0);
  const driveEndedRef = useRef(false);

  const currentQuestion = questions[currentIndex];
  const totalScore = questionScore + driveScore;

  const questionProgress = useMemo(() => {
    return (currentIndex / questions.length) * 100;
  }, [currentIndex, questions.length]);

  const resetQuestionState = () => {
    setAnswerState("unanswered");
    setSelectedIndex(null);
    setShowExplanation(false);
    setQuestionBonus(0);
  };

  const startDriveRound = (roundIndex: number) => {
    setDriveRound(roundIndex);
    setDriveLane(1);
    driveLaneRef.current = 1;
    setDriveItems([]);
    setDriveTimeLeft(DRIVE_DURATIONS[roundIndex] ?? 15);
    setDriveRoundScore(0);
    driveRoundScoreRef.current = 0;
    setDriveEnded(false);
    driveEndedRef.current = false;
    setLastDriveGain(0);
    setLastDriveBonus(0);
    setPhase("drive");
  };

  const handleAnswer = (optionIndex: number) => {
    if (answerState !== "unanswered") return;

    const isCorrect = optionIndex === currentQuestion.correctIndex;
    setSelectedIndex(optionIndex);

    const streakBonus = isCorrect && streak >= 1 ? 25 * (streak + 1) : 0;
    setQuestionBonus(streakBonus);

    if (isCorrect) {
      const earned = currentQuestion.points + streakBonus;
      setAnswerState("correct");
      setQuestionScore((s) => s + earned);
      setCorrectCount((c) => c + 1);
      setStreak((s) => {
        const next = s + 1;
        setBestStreak((b) => Math.max(b, next));
        return next;
      });
    } else {
      setAnswerState("incorrect");
      setStreak(0);
    }

    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    const nextIndex = currentIndex + 1;

    if (nextIndex % 2 === 0) {
      setCurrentIndex(nextIndex);
      resetQuestionState();
      startDriveRound(nextIndex / 2 - 1);
      return;
    }

    setCurrentIndex(nextIndex);
    resetQuestionState();
  };

  useEffect(() => {
    if (phase !== "drive" || driveEnded) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") {
        setDriveLane((prev) => {
          const next = Math.max(0, prev - 1);
          driveLaneRef.current = next;
          return next;
        });
      }
      if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") {
        setDriveLane((prev) => {
          const next = Math.min(ROAD_LANES - 1, prev + 1);
          driveLaneRef.current = next;
          return next;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [phase, driveEnded]);

  useEffect(() => {
    if (phase !== "drive" || driveEnded) return;

    const spawnInterval = setInterval(() => {
      const lane = Math.floor(Math.random() * ROAD_LANES);
      const type = getRandomDriveItemType();

      setDriveItems((prev) => [
        ...prev,
        {
          id: itemIdRef.current++,
          lane,
          y: -10,
          type,
        },
      ]);
    }, 800);

    const moveInterval = setInterval(() => {
      setDriveItems((prev) => {
        let delta = 0;
        const next: DriveItem[] = [];

        for (const item of prev) {
          const newY = item.y + 5;
          const collision =
            item.lane === driveLaneRef.current && newY >= 76 && newY <= 92;

          if (collision) {
            delta += ITEM_META[item.type].points;
            continue;
          }

          if (newY <= 110) {
            next.push({ ...item, y: newY });
          }
        }

        if (delta !== 0) {
          driveRoundScoreRef.current = Math.max(0, driveRoundScoreRef.current + delta);
          setDriveRoundScore(driveRoundScoreRef.current);
        }

        return next;
      });
    }, 100);

    const timerInterval = setInterval(() => {
      setDriveTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(spawnInterval);
          clearInterval(moveInterval);
          clearInterval(timerInterval);

          if (!driveEndedRef.current) {
            driveEndedRef.current = true;
            setDriveEnded(true);

            const surviveBonus = 100;
            const roundTotal = Math.max(0, driveRoundScoreRef.current + surviveBonus);

            setLastDriveBonus(surviveBonus);
            setLastDriveGain(roundTotal);
            setDriveScore((s) => s + roundTotal);
          }

          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(spawnInterval);
      clearInterval(moveInterval);
      clearInterval(timerInterval);
    };
  }, [phase, driveEnded]);

  const handleContinueAfterDrive = () => {
    if (currentIndex >= questions.length) {
      setPhase("results");
    } else {
      setPhase("question");
    }
  };

  const handleReplay = () => {
    window.location.reload();
  };

  if (phase === "results") {
    const performanceLabel =
      totalScore >= 1700
        ? "Elite Dispatcher"
        : totalScore >= 1200
        ? "Route Ready"
        : totalScore >= 800
        ? "Road Tested"
        : "Needs More Seat Time";

    return (
      <div className="animate-pop-in max-w-3xl mx-auto text-center space-y-8 py-8">
        <div className="space-y-2">
          <div
            className="text-6xl font-bold score-number"
            style={{ color: "hsl(38 95% 58%)" }}
          >
            {totalScore.toLocaleString()}
          </div>
          <p className="text-lg" style={{ color: "hsl(0 0% 72%)" }}>
            Final Route Runner Score
          </p>
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
            style={{
              background: "hsl(5 84% 48% / 0.14)",
              color: "hsl(38 45% 96%)",
              border: "1px solid hsl(5 84% 48% / 0.30)",
            }}
          >
            <Truck size={12} />
            {performanceLabel}
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          <div
            className="p-4 rounded-2xl border"
            style={{
              background: "linear-gradient(180deg, hsl(0 0% 15%), hsl(0 0% 11%))",
              borderColor: "hsl(128 20% 24%)",
            }}
          >
            <div className="text-2xl font-bold" style={{ color: "hsl(38 45% 96%)" }}>
              {correctCount}/{questions.length}
            </div>
            <p className="text-sm mt-1" style={{ color: "hsl(0 0% 68%)" }}>
              Correct
            </p>
          </div>

          <div
            className="p-4 rounded-2xl border"
            style={{
              background: "linear-gradient(180deg, hsl(0 0% 15%), hsl(0 0% 11%))",
              borderColor: "hsl(128 20% 24%)",
            }}
          >
            <div className="text-2xl font-bold" style={{ color: "hsl(38 95% 65%)" }}>
              {bestStreak}
            </div>
            <p className="text-sm mt-1" style={{ color: "hsl(0 0% 68%)" }}>
              Best Streak
            </p>
          </div>

          <div
            className="p-4 rounded-2xl border"
            style={{
              background: "linear-gradient(180deg, hsl(0 0% 15%), hsl(0 0% 11%))",
              borderColor: "hsl(128 20% 24%)",
            }}
          >
            <div className="text-2xl font-bold" style={{ color: "hsl(130 60% 60%)" }}>
              {questionScore.toLocaleString()}
            </div>
            <p className="text-sm mt-1" style={{ color: "hsl(0 0% 68%)" }}>
              Question Score
            </p>
          </div>

          <div
            className="p-4 rounded-2xl border"
            style={{
              background: "linear-gradient(180deg, hsl(0 0% 15%), hsl(0 0% 11%))",
              borderColor: "hsl(128 20% 24%)",
            }}
          >
            <div className="text-2xl font-bold" style={{ color: "hsl(5 84% 48%)" }}>
              {driveScore.toLocaleString()}
            </div>
            <p className="text-sm mt-1" style={{ color: "hsl(0 0% 68%)" }}>
              Driving Bonus
            </p>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={onBack}
            className="px-6 py-3 rounded-xl font-semibold transition-all"
            style={{
              background: "hsl(0 0% 14%)",
              color: "hsl(38 45% 96%)",
              border: "1px solid hsl(128 20% 24%)",
            }}
          >
            Back to Hub
          </button>

          <button
            onClick={handleReplay}
            className="px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all"
            style={{
              background: "hsl(0 0% 18%)",
              color: "hsl(38 45% 96%)",
              border: "1px solid hsl(128 20% 24%)",
            }}
          >
            <RotateCcw size={16} />
            Play Again
          </button>

          <button
            onClick={() => onComplete(totalScore)}
            className="px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all"
            style={{
              background: "hsl(5 84% 48%)",
              color: "white",
              boxShadow: "0 8px 18px rgba(170, 24, 24, 0.30)",
            }}
          >
            Submit Score
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  if (phase === "drive") {
    const truckTilt = driveLane === 0 ? -4 : driveLane === 2 ? 4 : 0;

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="text-sm flex items-center gap-1 transition-colors"
            style={{ color: "hsl(0 0% 72%)" }}
          >
            ← Back
          </button>

          <div className="flex items-center gap-4">
            <div
              className="text-sm font-semibold"
              style={{ color: "hsl(38 45% 96%)" }}
            >
              Drive Round {driveRound + 1} of 3
            </div>

            <div className="flex items-center gap-2">
              <Trophy size={16} style={{ color: "hsl(38 95% 58%)" }} />
              <span
                className="font-bold score-number text-lg"
                style={{ color: "hsl(38 45% 96%)" }}
              >
                {totalScore.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div
          className="rounded-3xl border p-5 space-y-5"
          style={{
            background: "linear-gradient(180deg, hsl(0 0% 15%), hsl(0 0% 11%))",
            borderColor: "hsl(128 20% 24%)",
            boxShadow: "0 14px 32px rgba(0,0,0,0.30)",
          }}
        >
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="space-y-1">
              <div
                className="text-xs font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1"
                style={{
                  background: "hsl(5 84% 48% / 0.16)",
                  color: "hsl(38 45% 96%)",
                  border: "1px solid hsl(5 84% 48% / 0.25)",
                }}
              >
                <Route size={10} />
                ROUTE RUNNER
              </div>

              <h2
                className="text-2xl font-bold"
                style={{ color: "hsl(38 45% 96%)" }}
              >
                Keep the truck rolling.
              </h2>

              <p className="text-sm" style={{ color: "hsl(0 0% 74%)" }}>
                Use ← / → or A / D to dodge obstacles and pick up packages.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div
                className="px-4 py-3 rounded-2xl text-center border"
                style={{
                  background: "hsl(0 0% 13%)",
                  borderColor: "hsl(128 20% 24%)",
                }}
              >
                <div className="text-xs" style={{ color: "hsl(0 0% 66%)" }}>
                  Time
                </div>
                <div
                  className="text-xl font-bold"
                  style={{ color: "hsl(5 84% 48%)" }}
                >
                  {driveTimeLeft}s
                </div>
              </div>

              <div
                className="px-4 py-3 rounded-2xl text-center border"
                style={{
                  background: "hsl(0 0% 13%)",
                  borderColor: "hsl(128 20% 24%)",
                }}
              >
                <div className="text-xs" style={{ color: "hsl(0 0% 66%)" }}>
                  Round
                </div>
                <div
                  className="text-xl font-bold"
                  style={{ color: "hsl(38 95% 58%)" }}
                >
                  {driveRoundScore}
                </div>
              </div>

              <div
                className="px-4 py-3 rounded-2xl text-center border"
                style={{
                  background: "hsl(0 0% 13%)",
                  borderColor: "hsl(128 20% 24%)",
                }}
              >
                <div className="text-xs" style={{ color: "hsl(0 0% 66%)" }}>
                  Total
                </div>
                <div
                  className="text-xl font-bold"
                  style={{ color: "hsl(130 60% 60%)" }}
                >
                  {driveScore + driveRoundScore}
                </div>
              </div>
            </div>
          </div>

          <div
            className="relative mx-auto overflow-hidden rounded-[2rem] border"
            style={{
              width: "100%",
              maxWidth: "620px",
              height: "540px",
              background:
                "linear-gradient(180deg, hsl(0 0% 22%), hsl(0 0% 16%) 20%, hsl(0 0% 18%) 100%)",
              borderColor: "hsl(128 20% 24%)",
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(90deg, hsl(128 20% 18%) 0%, hsl(0 0% 18%) 12%, hsl(0 0% 18%) 88%, hsl(128 20% 18%) 100%)",
                opacity: 0.55,
              }}
            />

            {[1, 2].map((divider) => (
              <div
                key={divider}
                className="absolute top-0 bottom-0"
                style={{
                  left: `${(divider / ROAD_LANES) * 100}%`,
                  width: "2px",
                  background:
                    "repeating-linear-gradient(to bottom, rgba(255,255,255,0.28) 0 18px, transparent 18px 34px)",
                  transform: "translateX(-1px)",
                }}
              />
            ))}

            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute"
                style={{
                  left: "50%",
                  top: `${i * 14 - 8}%`,
                  width: "8px",
                  height: "50px",
                  borderRadius: "999px",
                  background: "rgba(255,255,255,0.18)",
                  transform: "translateX(-50%)",
                }}
              />
            ))}

            {driveItems.map((item) => (
              <div
                key={item.id}
                className="absolute"
                style={{
                  left: `${laneToLeftPercent(item.lane)}%`,
                  top: `${item.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <img
                  src={itemImage(item.type)}
                  alt={item.type}
                  className="pointer-events-none select-none"
                  style={{
                    width: item.type === "car" ? "70px" : "50px",
                    height: "auto",
                    objectFit: "contain",
                    filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.35))",
                  }}
                />
              </div>
            ))}

            <img
              src={truckImg}
              alt="US Foods semi truck"
              className="absolute bottom-4 h-auto pointer-events-none select-none"
              style={{
                left: `${laneToLeftPercent(driveLane)}%`,
                width: "150px",
                transform: `translateX(-50%) rotate(${truckTilt}deg)`,
                filter: "drop-shadow(0 12px 20px rgba(0,0,0,0.45))",
                transition: "left 180ms ease, transform 180ms ease",
              }}
            />

            {driveEnded && (
              <div
                className="absolute inset-0 flex items-center justify-center p-6"
                style={{ background: "rgba(0,0,0,0.58)" }}
              >
                <div
                  className="w-full max-w-md rounded-3xl border p-6 text-center space-y-4"
                  style={{
                    background:
                      "linear-gradient(180deg, hsl(0 0% 15%), hsl(0 0% 11%))",
                    borderColor: "hsl(128 20% 24%)",
                  }}
                >
                  <div
                    className="text-xs font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1"
                    style={{
                      background: "hsl(5 84% 48% / 0.16)",
                      color: "hsl(38 45% 96%)",
                      border: "1px solid hsl(5 84% 48% / 0.25)",
                    }}
                  >
                    <Truck size={10} />
                    DRIVE ROUND COMPLETE
                  </div>

                  <div
                    className="text-4xl font-bold score-number"
                    style={{ color: "hsl(38 95% 58%)" }}
                  >
                    +{lastDriveGain}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div
                      className="rounded-2xl p-3 border"
                      style={{
                        background: "hsl(0 0% 13%)",
                        borderColor: "hsl(128 20% 24%)",
                      }}
                    >
                      <div className="text-xs" style={{ color: "hsl(0 0% 66%)" }}>
                        Pickups / Hits
                      </div>
                      <div
                        className="text-lg font-bold"
                        style={{ color: "hsl(38 45% 96%)" }}
                      >
                        {driveRoundScore}
                      </div>
                    </div>

                    <div
                      className="rounded-2xl p-3 border"
                      style={{
                        background: "hsl(0 0% 13%)",
                        borderColor: "hsl(128 20% 24%)",
                      }}
                    >
                      <div className="text-xs" style={{ color: "hsl(0 0% 66%)" }}>
                        Survival Bonus
                      </div>
                      <div
                        className="text-lg font-bold"
                        style={{ color: "hsl(130 60% 60%)" }}
                      >
                        +{lastDriveBonus}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleContinueAfterDrive}
                    className="w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all"
                    style={{
                      background: "hsl(5 84% 48%)",
                      color: "white",
                      boxShadow: "0 8px 18px rgba(170, 24, 24, 0.30)",
                    }}
                  >
                    {currentIndex >= questions.length
                      ? "View Results"
                      : "Continue Training"}
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-3">
            {[
              {
                icon: Package,
                label: "Package",
                value: "+25",
                color: "hsl(128 30% 58%)",
              },
              {
                icon: Trophy,
                label: "Gold Crate",
                value: "+50",
                color: "hsl(38 95% 58%)",
              },
              {
                icon: TrafficCone,
                label: "Obstacle",
                value: "-20 to -40",
                color: "hsl(0 75% 65%)",
              },
            ].map(({ icon: Icon, label, value, color }) => (
              <div
                key={label}
                className="rounded-2xl p-3 border flex items-center gap-3"
                style={{
                  background: "hsl(0 0% 13%)",
                  borderColor: "hsl(128 20% 24%)",
                }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: `${color}18`, border: `1px solid ${color}25` }}
                >
                  <Icon size={15} style={{ color }} />
                </div>
                <div>
                  <div
                    className="text-sm font-semibold"
                    style={{ color: "hsl(38 45% 96%)" }}
                  >
                    {label}
                  </div>
                  <div className="text-xs" style={{ color: "hsl(0 0% 68%)" }}>
                    {value}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-sm flex items-center gap-1 transition-colors"
          style={{ color: "hsl(0 0% 72%)" }}
        >
          ← Back
        </button>

        <div className="flex items-center gap-4">
          {streak >= 2 && (
            <div
              className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold"
              style={{
                background: "hsl(5 84% 48% / 0.15)",
                color: "hsl(38 45% 96%)",
                border: "1px solid hsl(5 84% 48% / 0.30)",
              }}
            >
              <Trophy size={12} />
              {streak}x Streak
            </div>
          )}

          <div className="flex items-center gap-2">
            <Trophy size={16} style={{ color: "hsl(38 95% 58%)" }} />
            <span
              className="font-bold score-number text-lg"
              style={{ color: "hsl(38 45% 96%)" }}
            >
              {totalScore.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div
          className="flex items-center justify-between text-sm"
          style={{ color: "hsl(0 0% 70%)" }}
        >
          <span>
            Question {currentIndex + 1} of {questions.length}
          </span>
          <span style={{ color: "hsl(5 84% 48%)" }}>
            Route Runner Mode
          </span>
        </div>

        <div
          className="h-1.5 rounded-full overflow-hidden"
          style={{ background: "hsl(0 0% 16%)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${questionProgress}%`, background: "hsl(5 84% 48%)" }}
          />
        </div>
      </div>

      <div
        className="p-6 space-y-6 rounded-3xl border animate-slide-in-up"
        style={{
          background: "linear-gradient(180deg, hsl(0 0% 15%), hsl(0 0% 11%))",
          borderColor: "hsl(128 20% 24%)",
          boxShadow: "0 14px 32px rgba(0,0,0,0.30)",
        }}
      >
        <div className="space-y-2">
          <div
            className="text-xs font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1"
            style={{
              background: "hsl(5 84% 48% / 0.16)",
              color: "hsl(38 45% 96%)",
              border: "1px solid hsl(5 84% 48% / 0.25)",
            }}
          >
            <Route size={10} />
            ROUTE RUNNER QUESTION {currentIndex + 1}
          </div>

          <h2
            className="text-xl font-semibold leading-snug"
            style={{ color: "hsl(38 45% 96%)" }}
          >
            {currentQuestion.question}
          </h2>
        </div>

        <div className="space-y-3">
          {currentQuestion.options.map((option, idx) => {
            let buttonStyle: React.CSSProperties = {
              background: "hsl(0 0% 13%)",
              border: "1px solid hsl(128 18% 22%)",
              color: "hsl(38 45% 96%)",
            };

            if (answerState !== "unanswered") {
              if (idx === currentQuestion.correctIndex) {
                buttonStyle = {
                  background: "hsl(130 60% 45% / 0.12)",
                  border: "1px solid hsl(130 60% 50% / 0.35)",
                  color: "hsl(38 45% 96%)",
                };
              } else if (idx === selectedIndex && idx !== currentQuestion.correctIndex) {
                buttonStyle = {
                  background: "hsl(0 75% 55% / 0.12)",
                  border: "1px solid hsl(0 75% 55% / 0.35)",
                  color: "hsl(38 45% 96%)",
                };
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                disabled={answerState !== "unanswered"}
                className="w-full text-left rounded-2xl px-4 py-4 transition-all"
                style={buttonStyle}
              >
                <span className="flex items-center gap-3">
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                    style={{
                      background: "hsl(128 26% 20%)",
                      color: "hsl(38 45% 96%)",
                      border: "1px solid hsl(128 18% 26%)",
                    }}
                  >
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{option}</span>
                </span>
              </button>
            );
          })}
        </div>

        {showExplanation && (
          <div
            className="animate-slide-in-up rounded-2xl p-4 space-y-3"
            style={{
              background:
                answerState === "correct"
                  ? "hsl(130 60% 45% / 0.10)"
                  : "hsl(0 75% 55% / 0.10)",
              border: `1px solid ${
                answerState === "correct"
                  ? "hsl(130 60% 50% / 0.28)"
                  : "hsl(0 75% 55% / 0.28)"
              }`,
            }}
          >
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="font-semibold text-sm"
                style={{
                  color:
                    answerState === "correct"
                      ? "hsl(130 60% 70%)"
                      : "hsl(0 75% 70%)",
                }}
              >
                {answerState === "correct"
                  ? `Correct! +${currentQuestion.points + questionBonus} pts`
                  : "Not quite!"}
              </span>

              {answerState === "correct" && questionBonus > 0 && (
                <span className="text-xs" style={{ color: "hsl(0 0% 68%)" }}>
                  (includes +{questionBonus} streak bonus)
                </span>
              )}
            </div>

            <p className="text-sm" style={{ color: "hsl(0 0% 72%)" }}>
              {currentQuestion.explanation}
            </p>

            <button
              onClick={handleNextQuestion}
              className="w-full mt-1 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90"
              style={{
                background: "hsl(5 84% 48%)",
                color: "white",
                boxShadow: "0 8px 18px rgba(170, 24, 24, 0.30)",
              }}
            >
              {currentIndex === questions.length - 1
                ? "Start Final Run"
                : (currentIndex + 1) % 2 === 0
                ? "Start Drive Round"
                : "Next Question"}
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}