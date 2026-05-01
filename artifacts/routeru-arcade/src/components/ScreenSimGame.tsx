import { useEffect, useState } from "react";
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
  maxWidth?: string;
  coachTip?: string;
}

interface ScreenSimQuestion {
  id: number;
  title: string;
  image?: string;
  correctZones?: CorrectZone[];
  maxWidth?: string;
  steps?: ScreenStep[];
  question: string;
  explanation: string;
  video?: string;
}

interface ScreenSimGameProps {
  onComplete: (score: number) => void;
  onBack: () => void;
}

interface SavedScreenSimProgress {
  date: string;
  currentIndex: number;
  completedToday: boolean;
}

const MAX_WRONG_CLICKS = 3;
const SHOW_HOTSPOT_DEBUG = true;

// Toggle this OFF while testing.
// Turn it ON when you want users limited to one scored attempt per day.
const ENABLE_DAILY_ATTEMPT_LOCK = false;

const STORAGE_KEY = "screenSimDailyProgress";

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

function loadSavedProgress(): SavedScreenSimProgress | null {
  if (!ENABLE_DAILY_ATTEMPT_LOCK) return null;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as SavedScreenSimProgress;

    if (parsed.date !== getTodayKey()) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

function saveProgress(progress: SavedScreenSimProgress) {
  if (!ENABLE_DAILY_ATTEMPT_LOCK) return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // localStorage may be unavailable in some browsers/settings.
  }
}

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
    correctZones: [{ x: 42, y: 37, width: 3, height: 3 }],
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
        correctZones: [{ x: 10, y: 45, width: 45, height: 6 }],
        maxWidth: "250px",
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
  {
    id: 7,
    title: "Reassign Schedule",
    question:
      "What are the steps to reassign a route to a different schedule? Hint: Where do I right click?",
    steps: [
      {
        image: "/screenshots/route-planner-2.jpg",
        correctZones: [{ x: 14, y: 28, width: 24, height: 20 }],
      },
      {
        image: "/screenshots/route-planner-routes-rightclick.jpg",
        correctZones: [{ x: 42, y: 29, width: 8, height: 5 }],
      },
      {
        image: "/screenshots/route-planner-reassign-schedule.jpg",
        correctZones: [{ x: 37, y: 46, width: 27, height: 14 }],
      },
    ],
    explanation:
      "Correct, remember to always double check the schedule you are sending it to before double clicking.",
    video: "/screenshots/Reassign Schedule.mp4",
  },
  {
    id: 8,
    title: "Create Resource 1",
    question:
      "I want to create a route from my template, can you show how to get there?",
    steps: [
      {
        image: "/screenshots/route-planner-2.jpg",
        correctZones: [{ x: 0, y: 20, width: 14, height: 7 }],
      },
      {
        image: "/screenshots/route-planner-menu-data.jpg",
        correctZones: [{ x: 0, y: 50, width: 45, height: 6 }],
      },
      {
        image: "/screenshots/route-planner-menu-dataroute.jpg",
        correctZones: [{ x: 0, y: 56, width: 22, height: 6 }],
      },
    ],
    explanation:
      "Correct, remember that ‘standards’ equals ‘templates’ in Route Planner.",
  },
  {
    id: 9,
    title: "Create Resource 2",
    question:
      "Now that you guided me to the right place, can you show me how to actually create the route, also known as ‘Resource’? I already right clicked on the route I want to create; I need help with the rest.",
    steps: [
      {
        image: "/screenshots/route-planner-resource-templates.jpg",
        correctZones: [{ x: 36, y: 29, width: 10, height: 5 }],
      },
      {
        image: "/screenshots/route-planner-create-resource.jpg",
        correctZones: [
      { x: 39, y: 44, width: 10, height: 5 },
      { x: 56, y: 44, width: 10, height: 5 },
      { x: 43, y: 55, width: 22, height: 5 },
      { x: 43, y: 61, width: 22, height: 5 },    
        coachTip: "💡 Coach Tip: Out of the 5 options, what are the 4 most important ones?",
      },
    ],
    explanation:
      "Correct, always double check these areas before creating your resource.",
    video: "/screenshots/How to create resources.mp4",
  },
];

export default function ScreenSimGame({
  onComplete,
  onBack,
}: ScreenSimGameProps) {
  const savedProgress = loadSavedProgress();

  const [currentIndex, setCurrentIndex] = useState(
    savedProgress?.completedToday ? 0 : savedProgress?.currentIndex ?? 0
  );
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
  const [completedToday, setCompletedToday] = useState(
    savedProgress?.completedToday ?? false
  );

  const current = QUESTIONS[currentIndex];

  const currentStep = current.steps
    ? current.steps[stepIndex]
    : {
        image: current.image!,
        correctZones: current.correctZones!,
        maxWidth: current.maxWidth,
        coachTip: undefined,
      };

  useEffect(() => {
    if (!completedToday) {
      saveProgress({
        date: getTodayKey(),
        currentIndex,
        completedToday: false,
      });
    }
  }, [currentIndex, completedToday]);

  const saveScoreAndExit = () => {
    saveProgress({
      date: getTodayKey(),
      currentIndex,
      completedToday: true,
    });

    setCompletedToday(true);
    onComplete(score);
  };

  const handleImageClick = (event: React.MouseEvent<HTMLImageElement>) => {
    if (result || completedToday) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = ((event.clientX - rect.left) / rect.width) * 100;
    const clickY = ((event.clientY - rect.top) / rect.height) * 100;

    console.log({
      questionId: current.id,
      title: current.title,
      step: current.steps ? stepIndex + 1 : 1,
      x: Number(clickX.toFixed(1)),
      y: Number(clickY.toFixed(1)),
    });

    let matchedZoneIndex = -1;

    currentStep.correctZones.forEach((zone, index) => {
      const isInside =
        clickX >= zone.x &&
        clickX <= zone.x + zone.width &&
        clickY >= zone.y &&
        clickY <= zone.y + zone.height;

      if (isInside && !foundZones.includes(index)) {
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
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);

      saveProgress({
        date: getTodayKey(),
        currentIndex: nextIndex,
        completedToday: false,
      });

      return;
    }

    saveProgress({
      date: getTodayKey(),
      currentIndex,
      completedToday: true,
    });

    setCompletedToday(true);
    onComplete(score);
  };

  if (completedToday && ENABLE_DAILY_ATTEMPT_LOCK) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 text-white">
        <button onClick={onBack} className="text-white flex gap-2 items-center">
          <ArrowLeft /> Back
        </button>

        <div className="bg-slate-900 border border-white/20 rounded-2xl p-6 space-y-3">
          <h2 className="text-2xl font-bold">Today's simulation is complete</h2>
          <p className="text-sm text-slate-300">
            You already saved or completed your simulation score today. Come back
            tomorrow for another scored attempt.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-white flex gap-2 items-center">
            <ArrowLeft /> Back
          </button>

          <button
            onClick={saveScoreAndExit}
            className="bg-yellow-400 text-black px-4 py-2 rounded font-bold"
          >
            Save Score & Exit
          </button>
        </div>

        <div className="text-white font-bold">Score: {score}</div>
      </div>

      <h2 className="text-white text-xl">{current.question}</h2>

      {current.steps && (
        <p className="text-yellow-300 text-sm">
          Step {stepIndex + 1} of {current.steps.length}
        </p>
      )}

      {currentStep.coachTip && (
        <div className="bg-blue-900/60 border border-blue-400 text-white rounded-xl p-3 text-sm shadow-md">
          {currentStep.coachTip}
        </div>
      )}

      <p className="text-sm text-yellow-300">
        Perfect Streak: {perfectStreak}
      </p>

      {ENABLE_DAILY_ATTEMPT_LOCK &&
        savedProgress &&
        !savedProgress.completedToday &&
        savedProgress.currentIndex > 0 &&
        score === 0 && (
          <div className="bg-slate-800 border border-white/20 text-white rounded-xl p-3 text-sm">
            Resumed from Question {currentIndex + 1}. Your score has started
            over for this attempt.
          </div>
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
          className="w-full block cursor-crosshair select-none"
          draggable={false}
        />

        {clickPoints.map((p, i) => (
          <div
            key={i}
            className={`absolute w-5 h-5 rounded-full border-2 border-white -translate-x-1/2 -translate-y-1/2 ${
              p.correct ? "bg-green-500" : "bg-red-500"
            }`}
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              boxShadow: "0 0 14px rgba(255,255,255,0.55)",
            }}
          />
        ))}

        {SHOW_HOTSPOT_DEBUG &&
          currentStep.correctZones.map((zone, index) => (
            <div
              key={index}
              className="absolute rounded-lg border-4 border-green-400 bg-green-400/20 pointer-events-none"
              style={{
                left: `${zone.x}%`,
                top: `${zone.y}%`,
                width: `${zone.width}%`,
                height: `${zone.height}%`,
              }}
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
        <div className="bg-green-900 p-4 rounded-xl text-white space-y-4">
          <div>
            <CheckCircle /> Correct!
            <p className="mt-2">{current.explanation}</p>
          </div>

          {current.video && (
            <div className="rounded-xl overflow-hidden border border-white/20 bg-black">
              <video src={current.video} controls className="w-full block">
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          {bonusTriggered && (
            <div className="mt-2 text-yellow-300">
              🎉 Perfect streak bonus +15!
            </div>
          )}

          <button
            onClick={handleNext}
            className="mt-3 bg-white text-black px-4 py-2 rounded"
          >
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
