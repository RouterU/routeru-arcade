import { useState } from "react";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";

interface CorrectZone {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ScreenStep {
  image: string;
  correctZones: CorrectZone[];
  maxWidth?: string; // ✅ NEW
}

interface ScreenSimQuestion {
  id: number;
  title: string;
  image?: string;
  correctZones?: CorrectZone[];
  steps?: ScreenStep[];
  question: string;
  explanation: string;
  video?: string;
}

interface ScreenSimGameProps {
  onComplete: (score: number) => void;
  onBack: () => void;
}

const MAX_WRONG_CLICKS = 3;
const SHOW_HOTSPOT_DEBUG = false;

const QUESTIONS: ScreenSimQuestion[] = [
  {
    id: 1,
    title: "Schedule Change",
    image: "/screenshots/route-planner-1.jpg",
    question: "Where would you click to select your schedule?",
    correctZones: [{ x: 82, y: 11, width: 14, height: 9 }],
    explanation:
      "This is the favorites dropdown. You can add multiple schedules to appear in this dropdown.",
    video: "/screenshots/How to add a schedule to your favorites.mp4",
  },
  {
    id: 2,
    title: "Route Resource",
    image: "/screenshots/route-planner-resource-1.jpg",
    question:
      "What are the steps in order to change this routes start time? You must click all required areas.",
    correctZones: [
      { x: 0, y: 81, width: 14, height: 9 },
      { x: 26, y: 13, width: 12, height: 5 },
      { x: 26, y: 18, width: 12, height: 4 },
    ],
    explanation:
      "These are the required areas involved in correctly changing the route start time.",
    video: "/screenshots/How to change a date on a route.mp4",
  },
  {
    id: 3,
    title: "Unassigned Stop",
    image: "/screenshots/route-planner-map-unassignedstop.jpg",
    question: "Where is the Unassigned stop on the map?",
    correctZones: [{ x: 58, y: 41, width: 3, height: 3 }],
    explanation: "Unassigned stops on the map will have a 'U' displayed.",
  },
  {
    id: 4,
    title: "Data Filter Options",
    question:
      "I can't see the icons like my coworkers, can you show me the steps to fix it?",
    steps: [
      {
        image: "/screenshots/route-planner-1.jpg",
        correctZones: [{ x: 0, y: 38, width: 14, height: 7 }],
      },
      {
        image: "/screenshots/route-planner-datafilter-options1.jpg",
        correctZones: [{ x: 6, y: 50, width: 38, height: 6 }],
        maxWidth: "850px", // ✅ FIXED ZOOM HERE
      },
      {
        image: "/screenshots/route-planner-menu-datafilter.jpg",
        correctZones: [{ x: 18, y: 20, width: 28, height: 8 }],
      },
    ],
    explanation: "Open the Data Filters, then select 'Options'.",
  },
  {
    id: 5,
    title: "Schedule Filter",
    image: "/screenshots/route-planner-data-filtered.jpg",
    question:
      "I have nothing in my Planning Schedule, I need help!!!. Can you find where the issue is showing? Hint: There's more than 1 spot.",
    correctZones: [
      { x: 80, y: 1, width: 20, height: 6 },
      { x: 33, y: 7, width: 13, height: 4 },
    ],
    explanation:
      "Saved filters or bad filters are the most common reasons people can't find their data.",
  },
  {
    id: 6,
    title: "Route Alerts",
    image: "/screenshots/route-planner-routes.jpg",
    question:
      "What 3 columns/areas make you aware that there is a possible issue with a route?",
    correctZones: [
      { x: 0, y: 18, width: 2, height: 25 },
      { x: 7, y: 17, width: 3, height: 26 },
      { x: 10, y: 17, width: 5, height: 26 },
    ],
    explanation:
      "Although there are several other areas you can check route issues, these are the most useful because they clearly point out that there is a problem.",
  },
];

export default function ScreenSimGame({
  onComplete,
  onBack,
}: ScreenSimGameProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [result, setResult] = useState<"correct" | "failed" | null>(null);
  const [clickPoints, setClickPoints] = useState<
    { x: number; y: number; correct: boolean }[]
  >([]);
  const [foundZones, setFoundZones] = useState<number[]>([]);
  const [wrongClicks, setWrongClicks] = useState(0);
  const [perfectStreak, setPerfectStreak] = useState(0);
  const [showWrongPopup, setShowWrongPopup] = useState(false);
  const [bonusTriggered, setBonusTriggered] = useState(false);

  const current = QUESTIONS[currentIndex];

  const currentStep = current.steps
    ? current.steps[stepIndex]
    : {
        image: current.image!,
        correctZones: current.correctZones!,
      };

  const handleImageClick = (event: React.MouseEvent<HTMLImageElement>) => {
    if (result) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = ((event.clientX - rect.left) / rect.width) * 100;
    const clickY = ((event.clientY - rect.top) / rect.height) * 100;

    let matchedZoneIndex = -1;

    currentStep.correctZones.forEach((zone, index) => {
      if (
        clickX >= zone.x &&
        clickX <= zone.x + zone.width &&
        clickY >= zone.y &&
        clickY <= zone.y + zone.height &&
        !foundZones.includes(index)
      ) {
        matchedZoneIndex = index;
      }
    });

    const isCorrectClick = matchedZoneIndex !== -1;

    setClickPoints((prev) => [
      ...prev,
      { x: clickX, y: clickY, correct: isCorrectClick },
    ]);

    if (!isCorrectClick) {
      const updatedWrong = wrongClicks + 1;
      setWrongClicks(updatedWrong);
      setScore((prev) => Math.max(0, prev - 10));
      setShowWrongPopup(true);

      if (updatedWrong >= MAX_WRONG_CLICKS) {
        setPerfectStreak(0);
        setResult("failed");
      }

      return;
    }

    const updatedFoundZones = [...foundZones, matchedZoneIndex];
    setFoundZones(updatedFoundZones);

    if (updatedFoundZones.length === currentStep.correctZones.length) {
      if (current.steps && stepIndex < current.steps.length - 1) {
        setStepIndex((prev) => prev + 1);
        setFoundZones([]);
        setClickPoints([]);
        setShowWrongPopup(false);
        return;
      }

      let newScore = score + 100;
      let newStreak = perfectStreak;

      if (wrongClicks === 0) {
        newStreak += 1;
        setPerfectStreak(newStreak);

        if (newStreak % 3 === 0) {
          newScore += 15;
          setBonusTriggered(true);
        }
      } else {
        setPerfectStreak(0);
      }

      setScore(newScore);
      setResult("correct");
    }
  };

  const handleNext = () => {
    setResult(null);
    setClickPoints([]);
    setFoundZones([]);
    setWrongClicks(0);
    setStepIndex(0);
    setShowWrongPopup(false);
    setBonusTriggered(false);

    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      return;
    }

    onComplete(score);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between">
        <button onClick={onBack} className="text-white flex gap-2 items-center">
          <ArrowLeft /> Back
        </button>
        <div className="text-white font-bold">Score: {score}</div>
      </div>

      <h2 className="text-white text-xl">{current.question}</h2>

      {current.steps && (
        <p className="text-yellow-300 text-sm">
          Step {stepIndex + 1} of {current.steps.length}
        </p>
      )}

      <div
        className="relative rounded-2xl overflow-hidden border"
        style={{
          borderColor: "hsl(128 20% 28%)",
          background: "hsl(0 0% 8%)",
          maxWidth: currentStep.maxWidth || "100%",
          margin: "0 auto",
        }}
      >
        <img
          src={currentStep.image}
          alt={current.title}
          onClick={handleImageClick}
          className="w-full block cursor-crosshair"
        />

        {clickPoints.map((p, i) => (
          <div
            key={i}
            className={`absolute w-5 h-5 rounded-full ${
              p.correct ? "bg-green-500" : "bg-red-500"
            }`}
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
          />
        ))}
      </div>
    </div>
  );
}
