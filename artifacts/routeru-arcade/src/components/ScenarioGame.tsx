import { useState } from "react";
import { scenarios, type OutcomeLevel } from "@/data/scenarioData";
import { Trophy, AlertTriangle, CheckCircle, Minus, ChevronRight, RotateCcw } from "lucide-react";

interface ScenarioGameProps {
  onComplete: (score: number) => void;
  onBack: () => void;
}

function OutcomeIcon({ level }: { level: OutcomeLevel }) {
  if (level === "good") return <CheckCircle size={18} style={{ color: "hsl(130 60% 60%)" }} />;
  if (level === "ok") return <Minus size={18} style={{ color: "hsl(38 95% 65%)" }} />;
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
  const progress = ((currentIndex) / scenarios.length) * 100;

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
          <div className="text-6xl font-bold score-number">{score.toLocaleString()}</div>
          <p className="text-muted-foreground text-lg">Final Score</p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="game-card p-4">
            <div className="text-2xl font-bold" style={{ color: "hsl(130 60% 60%)" }}>{goodCount}</div>
            <p className="text-muted-foreground text-sm mt-1">Best Decisions</p>
          </div>
          <div className="game-card p-4">
            <div className="text-2xl font-bold" style={{ color: "hsl(38 95% 65%)" }}>{okCount}</div>
            <p className="text-muted-foreground text-sm mt-1">Acceptable</p>
          </div>
          <div className="game-card p-4">
            <div className="text-2xl font-bold" style={{ color: "hsl(0 75% 65%)" }}>{badCount}</div>
            <p className="text-muted-foreground text-sm mt-1">Poor Calls</p>
          </div>
        </div>
        <div className="game-card p-4">
          <p className="text-muted-foreground text-sm">
            {score >= 1200
              ? "Outstanding! You made excellent decisions under pressure."
              : score >= 800
                ? "Good work. You know your stuff, with room to grow."
                : score >= 400
                  ? "Decent effort. Review the explanations to sharpen your judgment."
                  : "Keep practicing! Network troubleshooting takes experience."}
          </p>
        </div>
        <div className="flex gap-4 justify-center">
          <button
            data-testid="button-scenario-back"
            onClick={onBack}
            className="px-6 py-3 rounded-xl border border-border text-foreground font-semibold hover:bg-secondary transition-all"
          >
            Back to Hub
          </button>
          <button
            data-testid="button-scenario-replay"
            onClick={() => { setCurrentIndex(0); setScore(0); setSelected(null); setFinished(false); setResults([]); }}
            className="px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all"
            style={{ background: "hsl(180 70% 45%)", color: "white" }}
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
          className="text-muted-foreground hover:text-foreground transition-colors text-sm flex items-center gap-1"
        >
          ← Back
        </button>
        <div className="flex items-center gap-2 text-foreground">
          <Trophy size={16} style={{ color: "hsl(38 95% 58%)" }} />
          <span className="font-bold score-number text-lg">{score.toLocaleString()}</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Scenario {currentIndex + 1} of {scenarios.length}</span>
          <span style={{ color: "hsl(180 70% 55%)" }}>Decision Mode</span>
        </div>
        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, background: "hsl(180 70% 45%)" }}
          />
        </div>
      </div>

      <div className="animate-slide-in-up game-card p-6 space-y-5">
        <div className="space-y-3">
          <div
            className="text-xs font-semibold px-2 py-0.5 rounded-full inline-block"
            style={{ background: "hsl(180 70% 45% / 0.2)", color: "hsl(180 70% 65%)" }}
          >
            SCENARIO {currentIndex + 1}
          </div>
          <h2 className="text-xl font-bold text-foreground" data-testid="text-scenario-title">
            {scenario.title}
          </h2>
          <p className="text-foreground/80 leading-relaxed" data-testid="text-scenario-situation">
            {scenario.situation}
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wide">Choose your response:</p>
          {scenario.choices.map((choice, idx) => {
            const isSelected = selected === idx;
            const isRevealed = selected !== null;
            let btnClass = "answer-btn";
            if (isRevealed) {
              if (choice.outcome === "good") btnClass += " outcome-good";
              else if (choice.outcome === "ok") btnClass += " outcome-ok";
              else btnClass += " outcome-bad";
            }
            return (
              <button
                key={idx}
                data-testid={`button-scenario-choice-${idx}`}
                className={btnClass}
                onClick={() => handleChoice(idx)}
                disabled={selected !== null}
              >
                <span className="flex items-start gap-3">
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
                    style={{ background: "hsl(230 22% 20%)" }}
                  >
                    {idx + 1}
                  </span>
                  <span className="flex-1">
                    {choice.text}
                    {isRevealed && (
                      <span className="block mt-2 text-xs opacity-80">
                        <span className="flex items-center gap-1">
                          <OutcomeIcon level={choice.outcome} />
                          <span style={{ color: outcomeColor(choice.outcome) }}>
                            {outcomeLabel(choice.outcome)} · {choice.points > 0 ? `+${choice.points}` : "0"} pts
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
            className="animate-slide-in-up rounded-xl p-4 space-y-2"
            style={{
              background: `${outcomeColor(scenario.choices[selected].outcome)}18`,
              border: `1px solid ${outcomeColor(scenario.choices[selected].outcome)}40`,
            }}
          >
            <div className="flex items-center gap-2">
              <OutcomeIcon level={scenario.choices[selected].outcome} />
              <span className="font-semibold text-sm" style={{ color: outcomeColor(scenario.choices[selected].outcome) }}>
                {outcomeLabel(scenario.choices[selected].outcome)}
              </span>
            </div>
            <p className="text-muted-foreground text-sm">{scenario.choices[selected].explanation}</p>
            <button
              data-testid="button-next-scenario"
              onClick={handleNext}
              className="w-full mt-2 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90"
              style={{ background: "hsl(180 70% 45%)", color: "white" }}
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
