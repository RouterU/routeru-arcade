import { useState } from "react";
import { ArrowLeft, CheckCircle, MousePointerClick } from "lucide-react";

interface CorrectZone {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ScreenSimQuestion {
  id: number;
  title: string;
  image: string;
  question: string;
  correctZones: CorrectZone[];
  explanation: string;
}

interface ScreenSimGameProps {
  onComplete: (score: number) => void;
  onBack: () => void;
}

const QUESTIONS: ScreenSimQuestion[] = [
  {
    id: 1,
    title: "Schedule Change",
    image: "/screenshots/route-planner-1.jpg",
    question: "Where would you click to select your schedule?",
    correctZones: [
      {
        x: 82,
        y: 11,
        width: 22,
        height: 9,
      },
    ],
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
      {
        x: 84,
        y: 15,
        width: 14,
        height: 7,
      },
      {
        x: 2,
        y: 86,
        width: 10,
        height: 7,
      },
      {
        x: 28,
        y: 32,
        width: 12,
        height: 8,
      },
    ],
    explanation:
      "These are the required areas involved in correctly changing the route start time. The user must identify each required screen location to complete the task.",
  },
];

export default function ScreenSimGame({ onComplete, onBack }: ScreenSimGameProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [result, setResult] = useState<"correct" | null>(null);
  const [clickPoints, setClickPoints] = useState<
    { x: number; y: number; correct: boolean }[]
  >([]);
  const [foundZones, setFoundZones] = useState<number[]>([]);
  const [showZones, setShowZones] = useState(false);

  const current = QUESTIONS[currentIndex];
  const questionNumber = currentIndex + 1;
  const totalQuestions = QUESTIONS.length;

  const handleImageClick = (event: React.MouseEvent<HTMLImageElement>) => {
    if (result) return;

    const rect = event.currentTarget.getBoundingClientRect();

    const clickX = ((event.clientX - rect.left) / rect.width) * 100;
    const clickY = ((event.clientY - rect.top) / rect.height) * 100;

    console.log({
      questionId: current.id,
      x: Math.round(clickX),
      y: Math.round(clickY),
    });

    let matchedZoneIndex = -1;

    current.correctZones.forEach((zone, index) => {
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

    setClickPoints((previous) => [
      ...previous,
      {
        x: clickX,
        y: clickY,
        correct: isCorrectClick,
      },
    ]);

    if (!isCorrectClick) return;

    const updatedFoundZones = [...foundZones, matchedZoneIndex];
    setFoundZones(updatedFoundZones);

    if (updatedFoundZones.length === current.correctZones.length) {
      setScore((previous) => previous + 100);
      setResult("correct");
      setShowZones(true);
    }
  };

  const handleNext = () => {
    setResult(null);
    setClickPoints([]);
    setFoundZones([]);
    setShowZones(false);

    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex((previous) => previous + 1);
      return;
    }

    onComplete(score);
  };

  const currentDisplayScore = score;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
          style={{
            background: "hsl(0 0% 13%)",
            color: "hsl(38 45% 96%)",
            border: "1px solid hsl(128 20% 28%)",
          }}
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div
          className="px-4 py-2 rounded-xl text-sm font-bold"
          style={{
            background: "hsl(5 84% 48%)",
            color: "white",
          }}
        >
          Score: {currentDisplayScore.toLocaleString()}
        </div>
      </div>

      <div
        className="rounded-3xl p-6 border"
        style={{
          background: "linear-gradient(180deg, hsl(0 0% 15%), hsl(0 0% 11%))",
          borderColor: "hsl(128 20% 28%)",
          boxShadow: "0 14px 32px rgba(0,0,0,0.30)",
        }}
      >
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-3"
              style={{
                background: "hsl(38 95% 55% / 0.14)",
                color: "hsl(38 45% 96%)",
                border: "1px solid hsl(38 95% 55% / 0.28)",
              }}
            >
              <MousePointerClick size={13} />
              Find the Fix
            </div>

            <h1
              className="text-3xl font-bold"
              style={{ color: "hsl(38 45% 96%)" }}
            >
              {current.title}
            </h1>

            <p className="mt-2 text-sm" style={{ color: "hsl(0 0% 70%)" }}>
              Question {questionNumber} of {totalQuestions}
            </p>
          </div>

          <div
            className="text-sm font-semibold px-3 py-1.5 rounded-full"
            style={{
              background: "hsl(128 34% 22%)",
              color: "hsl(38 45% 96%)",
              border: "1px solid hsl(128 20% 32%)",
            }}
          >
            Click Simulation
          </div>
        </div>

        <div
          className="rounded-2xl p-4 mb-5"
          style={{
            background: "hsl(0 0% 10%)",
            border: "1px solid hsl(128 20% 24%)",
          }}
        >
          <h2
            className="text-xl font-semibold"
            style={{ color: "hsl(38 45% 96%)" }}
          >
            {current.question}
          </h2>

          <p className="text-sm mt-2" style={{ color: "hsl(0 0% 68%)" }}>
            Click directly on the screenshot where the user should make the
            change.
          </p>

          <p className="text-sm mt-2 font-semibold" style={{ color: "hsl(38 95% 55%)" }}>
            Found {foundZones.length} of {current.correctZones.length} required area
            {current.correctZones.length === 1 ? "" : "s"}.
          </p>
        </div>

        <div
          className="relative rounded-2xl overflow-hidden border"
          style={{
            borderColor: "hsl(128 20% 28%)",
            background: "hsl(0 0% 8%)",
          }}
        >
          <img
            src={current.image}
            alt={current.title}
            onClick={handleImageClick}
            className="w-full block cursor-crosshair select-none"
            draggable={false}
          />

          {clickPoints.map((point, index) => (
            <div
              key={index}
              className={`absolute w-6 h-6 rounded-full border-2 -translate-x-1/2 -translate-y-1/2 ${
                point.correct
                  ? "bg-green-500 border-white"
                  : "bg-red-500 border-white"
              }`}
              style={{
                left: `${point.x}%`,
                top: `${point.y}%`,
                boxShadow: "0 0 18px rgba(255,255,255,0.65)",
              }}
            />
          ))}

          {showZones &&
            current.correctZones.map((zone, index) => (
              <div
                key={index}
                className="absolute rounded-lg border-4 border-green-400 bg-green-400/20"
                style={{
                  left: `${zone.x}%`,
                  top: `${zone.y}%`,
                  width: `${zone.width}%`,
                  height: `${zone.height}%`,
                }}
              />
            ))}
        </div>

        {result && (
          <div
            className="mt-5 rounded-2xl p-5 border"
            style={{
              background: "hsl(128 42% 18% / 0.9)",
              borderColor: "hsl(128 55% 42%)",
            }}
          >
            <div className="flex items-start gap-3">
              <CheckCircle size={24} style={{ color: "hsl(128 70% 60%)" }} />

              <div className="flex-1">
                <h3
                  className="text-xl font-bold"
                  style={{ color: "hsl(38 45% 96%)" }}
                >
                  Correct!
                </h3>

                <p
                  className="mt-2 text-sm leading-relaxed"
                  style={{ color: "hsl(0 0% 86%)" }}
                >
                  {current.explanation}
                </p>

                <button
                  type="button"
                  onClick={handleNext}
                  className="mt-4 px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-90"
                  style={{
                    background: "hsl(38 95% 55%)",
                    color: "hsl(0 0% 8%)",
                  }}
                >
                  {currentIndex < QUESTIONS.length - 1
                    ? "Next Question"
                    : "Finish Training"}
                </button>
              </div>
            </div>
          </div>
        )}

        {!result && (
          <div className="mt-4 text-xs" style={{ color: "hsl(0 0% 56%)" }}>
            Tip: For setup/testing, open the browser console. Every click logs the
            x/y percentage so you can adjust the correct zones.
          </div>
        )}
      </div>
    </div>
  );
}
