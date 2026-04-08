import { useState } from "react";
import { dataChallenges, type RouteEntry } from "@/data/dataChallenge";
import {
  Trophy,
  Search,
  CheckCircle,
  XCircle,
  HelpCircle,
  ChevronRight,
  RotateCcw,
} from "lucide-react";

interface DataChallengeProps {
  onComplete: (score: number) => void;
  onBack: () => void;
}

export default function DataChallengeGame({
  onComplete,
  onBack,
}: DataChallengeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [finished, setFinished] = useState(false);
  const [roundScores, setRoundScores] = useState<number[]>([]);

  const challenge = dataChallenges[currentIndex];
  const progress = (currentIndex / dataChallenges.length) * 100;

  const toggleRow = (id: number) => {
    if (submitted) return;

    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSubmit = () => {
    if (submitted) return;
    setSubmitted(true);

    const correct = new Set(challenge.correctIssueIds);
    let earned = 0;
    let truePos = 0;
    let falsePos = 0;
    let falseNeg = 0;

    selected.forEach((id) => {
      if (correct.has(id)) truePos++;
      else falsePos++;
    });

    correct.forEach((id) => {
      if (!selected.has(id)) falseNeg++;
    });

    const basePoints = 400;
    earned = Math.max(0, basePoints - falsePos * 80 - falseNeg * 80 + truePos * 60);
    setScore((s) => s + earned);
    setRoundScores((r) => [...r, earned]);
  };

  const handleNext = () => {
    if (currentIndex + 1 >= dataChallenges.length) {
      setFinished(true);
      onComplete(score);
    } else {
      setCurrentIndex((i) => i + 1);
      setSelected(new Set());
      setSubmitted(false);
      setShowHint(false);
    }
  };

  const getRowStyle = (entry: RouteEntry) => {
    const isSelected = selected.has(entry.id);

    if (submitted) {
      if (entry.hasIssue && isSelected) return "border-green-500/50 bg-green-500/10";
      if (entry.hasIssue && !isSelected) return "border-orange-500/50 bg-orange-500/10";
      if (!entry.hasIssue && isSelected) return "border-red-500/50 bg-red-500/10";
      return "";
    }

    if (isSelected) return "border-red-500/40 bg-red-500/10";
    return "";
  };

  if (finished) {
    const maxPossible = dataChallenges.length * 580;
    const pct = Math.round((score / maxPossible) * 100);

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
          {roundScores.map((rs, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl border"
              style={{
                background: "linear-gradient(180deg, hsl(0 0% 15%), hsl(0 0% 11%))",
                borderColor: "hsl(128 20% 24%)",
              }}
            >
              <div
                className="text-xl font-bold"
                style={{ color: "hsl(38 45% 96%)" }}
              >
                {rs}
              </div>
              <p className="text-sm mt-1" style={{ color: "hsl(0 0% 68%)" }}>
                Round {i + 1}
              </p>
            </div>
          ))}
        </div>

        <div
          className="p-4 rounded-2xl border"
          style={{
            background: "linear-gradient(180deg, hsl(0 0% 15%), hsl(0 0% 11%))",
            borderColor: "hsl(128 20% 24%)",
          }}
        >
          <div
            className="text-3xl font-bold score-number mb-1"
            style={{ color: "hsl(130 60% 60%)" }}
          >
            {pct}%
          </div>
          <p className="text-sm" style={{ color: "hsl(0 0% 68%)" }}>
            Accuracy Rating
          </p>
          <p className="text-sm mt-2" style={{ color: "hsl(0 0% 72%)" }}>
            {pct >= 80
              ? "Excellent work. You’re spotting route and publish issues quickly."
              : pct >= 60
              ? "Solid performance. Keep sharpening your route review instincts."
              : "Keep practicing. Strong auditing comes from repetition and review."}
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            data-testid="button-data-back"
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
            data-testid="button-data-replay"
            onClick={() => {
              setCurrentIndex(0);
              setScore(0);
              setSelected(new Set());
              setSubmitted(false);
              setShowHint(false);
              setFinished(false);
              setRoundScores([]);
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
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button
          data-testid="button-data-nav-back"
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
            Challenge {currentIndex + 1} of {dataChallenges.length}
          </span>
          <span style={{ color: "hsl(5 84% 48%)" }}>Route Audit Mode</span>
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
        <div className="space-y-2">
          <div
            className="text-xs font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1"
            style={{
              background: "hsl(5 84% 48% / 0.16)",
              color: "hsl(38 45% 96%)",
              border: "1px solid hsl(5 84% 48% / 0.25)",
            }}
          >
            <Search size={10} />
            DATA CHALLENGE {currentIndex + 1}
          </div>

          <h2
            className="text-xl font-bold"
            data-testid="text-challenge-title"
            style={{ color: "hsl(38 45% 96%)" }}
          >
            {challenge.title}
          </h2>

          <p
            className="text-sm leading-relaxed"
            style={{ color: "hsl(0 0% 74%)" }}
          >
            {challenge.description}
          </p>
        </div>

        {!submitted && (
          <button
            data-testid="button-show-hint"
            onClick={() => setShowHint(!showHint)}
            className="flex items-center gap-2 text-xs transition-colors"
            style={{ color: "hsl(0 0% 68%)" }}
          >
            <HelpCircle size={14} />
            {showHint ? "Hide hint" : "Show hint"}
          </button>
        )}

        {showHint && !submitted && (
          <div
            className="animate-slide-in-up rounded-xl p-3 text-sm"
            style={{
              background: "hsl(128 30% 20% / 0.55)",
              border: "1px solid hsl(128 22% 30%)",
            }}
          >
            <span style={{ color: "hsl(38 45% 96%)" }}>Hint: </span>
            <span style={{ color: "hsl(0 0% 74%)" }}>{challenge.hint}</span>
          </div>
        )}

        <div className="space-y-2">
          <p
            className="text-xs uppercase font-semibold tracking-wide"
            style={{ color: "hsl(0 0% 66%)" }}
          >
            {submitted
              ? "Results — highlighted rows show issues found"
              : "Click rows you believe have issues:"}
          </p>

          <div
            className="overflow-x-auto rounded-2xl border"
            style={{
              borderColor: "hsl(128 20% 24%)",
              background: "hsl(0 0% 12%)",
            }}
          >
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "hsl(0 0% 14%)" }}>
                  <th className="text-left px-3 py-2.5 text-xs font-medium" style={{ color: "hsl(0 0% 68%)" }}>#</th>
                  <th className="text-left px-3 py-2.5 text-xs font-medium" style={{ color: "hsl(0 0% 68%)" }}>Route / Stop</th>
                  <th className="text-left px-3 py-2.5 text-xs font-medium" style={{ color: "hsl(0 0% 68%)" }}>Assignment / Owner</th>
                  <th className="text-left px-3 py-2.5 text-xs font-medium" style={{ color: "hsl(0 0% 68%)" }}>Load / Detail</th>
                  <th className="text-left px-3 py-2.5 text-xs font-medium" style={{ color: "hsl(0 0% 68%)" }}>Status / Type</th>
                  <th className="text-left px-3 py-2.5 text-xs font-medium" style={{ color: "hsl(0 0% 68%)" }}>Stage</th>
                  {submitted && (
                    <th className="text-left px-3 py-2.5 text-xs font-medium" style={{ color: "hsl(0 0% 68%)" }}>
                      Result
                    </th>
                  )}
                </tr>
              </thead>

              <tbody>
                {challenge.routingTable.map((entry) => {
                  const isSelected = selected.has(entry.id);
                  const rowClass = getRowStyle(entry);

                  return (
                    <tr
                      key={entry.id}
                      data-testid={`row-entry-${entry.id}`}
                      onClick={() => toggleRow(entry.id)}
                      className={`border-t transition-all duration-150 ${
                        !submitted ? "cursor-pointer hover:bg-white/5" : ""
                      } ${rowClass}`}
                      style={{
                        borderColor: "hsl(0 0% 18%)",
                        ...(isSelected && !submitted
                          ? { borderLeft: "3px solid hsl(5 84% 48%)" }
                          : {}),
                      }}
                    >
                      <td className="px-3 py-2.5 font-mono text-xs" style={{ color: "hsl(0 0% 64%)" }}>
                        {entry.id}
                      </td>
                      <td className="px-3 py-2.5 font-mono text-xs font-medium" style={{ color: "hsl(38 45% 96%)" }}>
                        {entry.prefix}
                      </td>
                      <td className="px-3 py-2.5 font-mono text-xs" style={{ color: "hsl(0 0% 76%)" }}>
                        {entry.nextHop}
                      </td>
                      <td className="px-3 py-2.5 font-mono text-xs" style={{ color: "hsl(0 0% 76%)" }}>
                        {entry.metric}
                      </td>
                      <td className="px-3 py-2.5 font-mono text-xs" style={{ color: "hsl(0 0% 76%)" }}>
                        {entry.protocol}
                      </td>
                      <td className="px-3 py-2.5 font-mono text-xs" style={{ color: "hsl(0 0% 64%)" }}>
                        {entry.age}
                      </td>

                      {submitted && (
                        <td className="px-3 py-2.5">
                          {entry.hasIssue && isSelected && (
                            <CheckCircle size={14} style={{ color: "hsl(130 60% 60%)" }} />
                          )}
                          {entry.hasIssue && !isSelected && (
                            <XCircle size={14} style={{ color: "hsl(38 95% 65%)" }} />
                          )}
                          {!entry.hasIssue && isSelected && (
                            <XCircle size={14} style={{ color: "hsl(0 75% 65%)" }} />
                          )}
                          {!entry.hasIssue && !isSelected && (
                            <CheckCircle
                              size={14}
                              className="opacity-30"
                              style={{ color: "hsl(130 60% 60%)" }}
                            />
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {!submitted && (
          <button
            data-testid="button-submit-analysis"
            onClick={handleSubmit}
            disabled={selected.size === 0}
            className="w-full py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: "hsl(5 84% 48%)",
              color: "white",
              boxShadow: "0 8px 18px rgba(170, 24, 24, 0.30)",
            }}
          >
            Submit Analysis ({selected.size} selected)
          </button>
        )}

        {submitted && (
          <div
            className="animate-slide-in-up rounded-2xl p-4 space-y-3"
            style={{
              background: "hsl(128 30% 20% / 0.55)",
              border: "1px solid hsl(128 22% 30%)",
            }}
          >
            <div
              className="font-semibold text-sm"
              style={{ color: "hsl(38 45% 96%)" }}
            >
              Analysis Complete — Round Score:{" "}
              {roundScores[roundScores.length - 1]}
            </div>

            <p className="text-sm" style={{ color: "hsl(0 0% 72%)" }}>
              {challenge.explanation}
            </p>

            <button
              data-testid="button-next-challenge"
              onClick={handleNext}
              className="w-full mt-1 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90"
              style={{
                background: "hsl(5 84% 48%)",
                color: "white",
                boxShadow: "0 8px 18px rgba(170, 24, 24, 0.30)",
              }}
            >
              {currentIndex + 1 >= dataChallenges.length ? "View Results" : "Next Challenge"}
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}