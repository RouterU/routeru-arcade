import { useState } from "react";
import { scenarios, type OutcomeLevel } from "@/data/scenarioData";
import {
  Trophy,
  AlertTriangle,
  CheckCircle,
  Minus,
  ChevronRight,
  RotateCcw,
} from "lucide-react";

interface ScenarioGameProps {
  onComplete: (score: number) => void;
  onBack: () => void;
}

function OutcomeIcon({ level }: { level: OutcomeLevel }) {
  if (level === "good") {
    return <CheckCircle size={18} style={{ color: "hsl(130 60% 60%)" }} />;
  }
  if (level === "ok") {
    return <Minus size={18} style={{ color: "hsl(38 95% 65%)" }} />;
  }
  return <AlertTriangle size={18} style={{ color: "hsl(0 75% 65%)" }} />;
}

function outcomeLabel(level: OutcomeLevel) {
  if (level === "good") return "Best Decision";
  if (level === "ok") return "Acceptable";
  return "Poor Decision";
}

function outcomeColor(level: OutcomeLevel) {
  if (level === "good") return "hsl(130 60% 65%)";
  if (level === "ok") return "hsl(38 95% 65%)";
  return "hsl(0 75% 65%)";
}

export default function ScenarioGame({ onComplete, onBack }: ScenarioGameProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  const [results, setResults] = useState<OutcomeLevel[]>([]);

  const scenario = scenarios[currentIndex];
  const progress = (currentIndex / scenarios.length) * 100;

  const handleChoice = (choiceIdx: number) => {
    if (selected !== null) return;

    setSelected(choiceIdx);
    const choice = scenario.choices[choiceIdx];
    setScore((s) => s + choice.points);
    setResults((r) => [...r, choice.outcome]);
  };

  const handleNext = () => {
    if (currentIndex + 1 >= scenarios.length) {
      setFinished(true);
      onComplete(score);
    } else {
      setCurrentIndex((i) => i + 1);
      setSelected(null);
    }
  };

  if (finished) {
    const goodCount = results.filter((r) => r === "good").length;
    const okCount = results.filter((r) => r === "ok").length;
    const badCount = results.filter((r) => r === "bad").length;

    return (
      <div className="animate-pop-in max-w-2xl mx-auto text-center space-y-8 py-8">
        <div className="space-y-2">
          <div
            className="text-6xl font-bold score-number"
            style={{ color: "hsl(38 95% 58%)" }}
          >
            {score.toLocaleString()}
          </div>
          <p className="text-lg" style={{ color: "hsl(0 0% 72%)" }}>
            Final Score
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div
            className="p-4 rounded-2xl border"
            style={{
              background: "linear-gradient(180deg, hsl(0 0% 15%), hsl(0 0% 11%))",
              borderColor: "hsl(128 20% 24%)",
            }}
          >
            <div
              className="text-2xl font-bold"
              style={{ color: "hsl(130 60% 60%)" }}
            >
              {goodCount}
            </div>
            <p className="text-sm mt-1" style={{ color: "hsl(0 0% 68%)" }}>
              Best Decisions
            </p>
          </div>

          <div
            className="p-4 rounded-2xl border"
            style={{
              background: "linear-gradient(180deg, hsl(0 0% 15%), hsl(0 0% 11%))",
              borderColor: "hsl(128 20% 24%)",
            }}
          >
            <div
              className="text-2xl font-bold"
              style={{ color: "hsl(38 95% 65%)" }}
            >
              {okCount}
            </div>
            <p className="text-sm mt-1" style={{ color: "hsl(0 0% 68%)" }}>
              Acceptable
            </p>
          </div>

          <div
            className="p-4 rounded-2xl border"
            style={{
              background: "linear-gradient(180deg, hsl(0 0% 15%), hsl(0 0% 11%))",
              borderColor: "hsl(128 20% 24%)",
            }}
          >
            <div
              className="text-2xl font-bold"
              style={{ color: "hsl(0 75% 65%)" }}
            >
              {badCount}
            </div>
            <p className="text-sm mt-1" style={{ color: "hsl(0 0% 68%)" }}>
              Poor Calls
            </p>
          </div>
        </div>

        <div
          className="p-4 rounded-2xl border"
          style={{
            background: "linear-gradient(180deg, hsl(0 0% 15%), hsl(0 0% 11%))",
            borderColor: "hsl(128 20% 24%)",
          }}
        >
          <p className="text-sm" style={{ color: "hsl(0 0% 72%)" }}>
            {score >= 1200
              ? "Outstanding! You made strong operational decisions under pressure."
              : score >= 800
              ? "Good work. You’re making solid routing decisions with room to sharpen further."
              : score >= 400
              ? "Decent effort. Review the explanations to improve your decision-making."
              : "Keep practicing. Great routing judgment comes from repetition and review."}
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            data-testid="button-scenario-back"
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
            data-testid="button-scenario-replay"
            onClick={() => {
              setCurrentIndex(0);
              setScore(0);
              setSelected(null);
              setFinished(false);
              setResults([]);
            }}
            className="px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all"
            style={{
              background: "hsl(5 84% 48%)",
              color: "white",
              boxShadow: "0 8px 18px rgba(170, 24, 24, 0.30)",
            }}
          >
            <RotateCcw size={16} />
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button
          data-testid="button-scenario-nav-back"
          onClick={onBack}
          className="text-sm flex items-center gap-1 transition-colors"
          style={{ color: "hsl(0 0% 72%)" }}
        >
          ← Back
        </button>

        <div className="flex items-center gap-2">
          <Trophy size={16} style={{ color: "hsl(38 95% 58%)" }} />
          <span
            className="font-bold score-number text-lg"
            style={{ color: "hsl(38 45% 96%)" }}
          >
            {score.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <div
          className="flex items-center justify-between text-sm"
          style={{ color: "hsl(0 0% 70%)" }}
        >
          <span>
            Scenario {currentIndex + 1} of {scenarios.length}
          </span>
          <span style={{ color: "hsl(5 84% 48%)" }}>Decision Mode</span>
        </div>

        <div
          className="h-1.5 rounded-full overflow-hidden"
          style={{ background: "hsl(0 0% 16%)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, background: "hsl(5 84% 48%)" }}
          />
        </div>
      </div>

      <div
        className="animate-slide-in-up p-6 space-y-5 rounded-3xl border"
        style={{
          background: "linear-gradient(180deg, hsl(0 0% 15%), hsl(0 0% 11%))",
          borderColor: "hsl(128 20% 24%)",
          boxShadow: "0 14px 32px rgba(0,0,0,0.30)",
        }}
      >
        <div className="space-y-3">
          <div
            className="text-xs font-semibold px-2 py-0.5 rounded-full inline-block"
            style={{
              background: "hsl(5 84% 48% / 0.16)",
              color: "hsl(38 45% 96%)",
              border: "1px solid hsl(5 84% 48% / 0.25)",
            }}
          >
            SCENARIO {currentIndex + 1}
          </div>

          <h2
            className="text-xl font-bold"
            data-testid="text-scenario-title"
            style={{ color: "hsl(38 45% 96%)" }}
          >
            {scenario.title}
          </h2>

          <p
            className="leading-relaxed"
            data-testid="text-scenario-situation"
            style={{ color: "hsl(0 0% 74%)" }}
          >
            {scenario.situation}
          </p>
        </div>

        <div className="space-y-3">
          <p
            className="text-xs uppercase font-semibold tracking-wide"
            style={{ color: "hsl(0 0% 66%)" }}
          >
            Choose your response:
          </p>

          {scenario.choices.map((choice, idx) => {
            const isRevealed = selected !== null;

            let buttonStyle: React.CSSProperties = {
              background: "hsl(0 0% 13%)",
              border: "1px solid hsl(128 18% 22%)",
              color: "hsl(38 45% 96%)",
            };

            if (isRevealed) {
              if (choice.outcome === "good") {
                buttonStyle = {
                  background: "hsl(130 60% 45% / 0.12)",
                  border: "1px solid hsl(130 60% 50% / 0.35)",
                  color: "hsl(38 45% 96%)",
                };
              } else if (choice.outcome === "ok") {
                buttonStyle = {
                  background: "hsl(38 95% 55% / 0.10)",
                  border: "1px solid hsl(38 95% 58% / 0.30)",
                  color: "hsl(38 45% 96%)",
                };
              } else {
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
                data-testid={`button-scenario-choice-${idx}`}
                onClick={() => handleChoice(idx)}
                disabled={selected !== null}
                className="w-full text-left rounded-2xl px-4 py-4 transition-all"
                style={buttonStyle}
              >
                <span className="flex items-start gap-3">
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
                    style={{
                      background: "hsl(128 26% 20%)",
                      color: "hsl(38 45% 96%)",
                      border: "1px solid hsl(128 18% 26%)",
                    }}
                  >
                    {idx + 1}
                  </span>

                  <span className="flex-1">
                    {choice.text}

                    {isRevealed && (
                      <span
                        className="block mt-2 text-xs"
                        style={{ opacity: 0.9 }}
                      >
                        <span className="flex items-center gap-1">
                          <OutcomeIcon level={choice.outcome} />
                          <span style={{ color: outcomeColor(choice.outcome) }}>
                            {outcomeLabel(choice.outcome)} ·{" "}
                            {choice.points > 0 ? `+${choice.points}` : "0"} pts
                          </span>
                        </span>
                      </span>
                    )}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {selected !== null && (
          <div
            className="animate-slide-in-up rounded-2xl p-4 space-y-2"
            style={{
              background: `${outcomeColor(scenario.choices[selected].outcome)}18`,
              border: `1px solid ${outcomeColor(scenario.choices[selected].outcome)}40`,
            }}
          >
            <div className="flex items-center gap-2">
              <OutcomeIcon level={scenario.choices[selected].outcome} />
              <span
                className="font-semibold text-sm"
                style={{ color: outcomeColor(scenario.choices[selected].outcome) }}
              >
                {outcomeLabel(scenario.choices[selected].outcome)}
              </span>
            </div>

            <p className="text-sm" style={{ color: "hsl(0 0% 72%)" }}>
              {scenario.choices[selected].explanation}
            </p>

            <button
              data-testid="button-next-scenario"
              onClick={handleNext}
              className="w-full mt-2 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90"
              style={{
                background: "hsl(5 84% 48%)",
                color: "white",
                boxShadow: "0 8px 18px rgba(170, 24, 24, 0.30)",
              }}
            >
              {currentIndex + 1 >= scenarios.length ? "View Results" : "Next Scenario"}
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}