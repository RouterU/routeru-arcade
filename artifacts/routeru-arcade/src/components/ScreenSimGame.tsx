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
}

interface ScreenSimQuestion {
  id: number;
  title: string;
  image?: string;
  correctZones?: CorrectZone[];
  steps?: ScreenStep[];
  question: string;
  explanation: string;
}

interface ScreenSimGameProps {
  onComplete: (score: number) => void;
  onBack: () => void;
}

const MAX_WRONG_CLICKS = 3;

const QUESTIONS: ScreenSimQuestion[] = [
  {
    id: 1,
    title: "Schedule Change",
    image: "/screenshots/route-planner-1.jpg",
    question: "Where would you click to select your schedule?",
    correctZones: [{ x: 82, y: 11, width: 14, height: 9 }],
    explanation:
      "This is the favorites dropdown. You can add multiple schedules to appear in this dropdown.",
  },
  {
    id: 2,
    title: "Route Resource",
    image: "/screenshots/route-planner-resource-1.jpg",
    question:
      "Where would you click to correctly change the route start time? You must click all required areas.",
    correctZones: [
      { x: 0, y: 81, width: 14, height: 9 },
      { x: 26, y: 12, width: 12, height: 6 },
      { x: 26, y: 18, width: 12, height: 4 },
    ],
    explanation:
      "These are the required areas involved in correctly changing the route start time.",
  },
  {
    id: 3,
    title: "Unassigned Stop",
    image: "/screenshots/route-planner-map-unassignedstop.jpg",
    question: "Where is the Unassigned stop on the map?",
    correctZones: [{ x: 58, y: 42, width: 3, height: 3 }],
    explanation: "Unassigned stops on the map will have a 'U' displayed.",
  },
  {
  id: 4,
  title: "Data Filter Options",
  question: "I can't see the icons like my coworkers, can you show me where to fix it?",
  steps: [
    {
      image: "/screenshots/route-planner-resource-1.jpg",
      correctZones: [{ x: 82, y: 11, width: 10, height: 8 }]
    },
    {
      image: "/screenshots/route-planner-menu-datafilter.jpg",
      correctZones: [{ x: 40, y: 30, width: 20, height: 10 }]
    }
  ],
  explanation: "Open the Data Filters, then select 'Options'."
},
];

export default function ScreenSimGame({ onComplete, onBack }: ScreenSimGameProps) {
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

    // ❌ WRONG
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

    // ✅ CORRECT
    const updatedFoundZones = [...foundZones, matchedZoneIndex];
    setFoundZones(updatedFoundZones);

    if (updatedFoundZones.length === currentStep.correctZones.length) {
      // 🔁 NEXT STEP
      if (current.steps && stepIndex < current.steps.length - 1) {
        setStepIndex((prev) => prev + 1);
        setFoundZones([]);
        setClickPoints([]);
        return;
      }

      // 🎯 COMPLETE QUESTION
      let newScore = score + 100;
      let newStreak = perfectStreak;

      setBonusTriggered(false);

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

      <p className="text-sm text-yellow-300">
        Perfect Streak: {perfectStreak}
      </p>

      <div className="relative">
        <img
          src={currentStep.image}
          onClick={handleImageClick}
          className="w-full cursor-crosshair"
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

      {showWrongPopup && !result && (
        <div className="bg-red-900 p-4 rounded-xl text-white">
          Not the right place, try again.
          <br />
          {MAX_WRONG_CLICKS - wrongClicks} of {MAX_WRONG_CLICKS} attempts left.
        </div>
      )}

      {result === "correct" && (
        <div className="bg-green-900 p-4 rounded-xl text-white">
          <CheckCircle /> Correct!
          <p className="mt-2">{current.explanation}</p>

          {bonusTriggered && (
            <div className="mt-2 text-yellow-300">
              🎉 Perfect streak bonus +15!
            </div>
          )}

          <button onClick={handleNext} className="mt-3 bg-white text-black px-4 py-2 rounded">
            Next
          </button>
        </div>
      )}

      {result === "failed" && (
        <div className="bg-red-800 p-5 rounded-xl text-white">
          <XCircle />
          <h3 className="text-xl font-bold mt-2">Training Failed</h3>
          <p>You used all attempts. Restart training to try again.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-white text-black px-4 py-2 rounded"
          >
            Restart Training
          </button>
        </div>
      )}
    </div>
  );
}
