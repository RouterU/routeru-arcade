import { useState } from "react";
import { dataChallenges, type RouteEntry } from "@/data/dataChallenge";
import { Trophy, Search, CheckCircle, XCircle, HelpCircle, ChevronRight, RotateCcw } from "lucide-react";

interface DataChallengeProps {
  onComplete: (score: number) => void;
  onBack: () => void;
}

export default function DataChallengeGame({ onComplete, onBack }: DataChallengeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [finished, setFinished] = useState(false);
  const [roundScores, setRoundScores] = useState<number[]>([]);

  const challenge = dataChallenges[currentIndex];
  const progress = ((currentIndex) / dataChallenges.length) * 100;

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
    if (isSelected) return "border-violet-500/50 bg-violet-500/10";
    return "";
  };

  if (finished) {
    const maxPossible = dataChallenges.length * 580;
    const pct = Math.round((score / maxPossible) * 100);

    return (
      <div className="animate-pop-in max-w-2xl mx-auto text-center space-y-8 py-8">
        <div className="space-y-2">
          <div className="text-6xl font-bold score-number">{score.toLocaleString()}</div>
          <p className="text-muted-foreground text-lg">Final Score</p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {roundScores.map((rs, i) => (
            <div key={i} className="game-card p-4">
              <div className="text-xl font-bold text-foreground">{rs}</div>
              <p className="text-muted-foreground text-sm mt-1">Round {i + 1}</p>
            </div>
          ))}
        </div>
        <div className="game-card p-4">
          <div className="text-3xl font-bold score-number mb-1">{pct}%</div>
          <p className="text-muted-foreground text-sm">Accuracy Rating</p>
          <p className="text-muted-foreground text-sm mt-2">
            {pct >= 80
              ? "Expert analyst! Your eyes catch what others miss."
              : pct >= 60
                ? "Solid performance. Keep honing your diagnostic skills."
                : "Practice makes perfect — study common routing anomalies."}
          </p>
        </div>
        <div className="flex gap-4 justify-center">
          <button
            data-testid="button-data-back"
            onClick={onBack}
            className="px-6 py-3 rounded-xl border border-border text-foreground font-semibold hover:bg-secondary transition-all"
          >
            Back to Hub
          </button>
          <button
            data-testid="button-data-replay"
            onClick={() => { setCurrentIndex(0); setScore(0); setSelected(new Set()); setSubmitted(false); setShowHint(false); setFinished(false); setRoundScores([]); }}
            className="px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all"
            style={{ background: "hsl(38 95% 55%)", color: "white" }}
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
          <span>Challenge {currentIndex + 1} of {dataChallenges.length}</span>
          <span style={{ color: "hsl(38 95% 65%)" }}>Data Analysis Mode</span>
        </div>
        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, background: "hsl(38 95% 55%)" }}
          />
        </div>
      </div>

      <div className="animate-slide-in-up game-card p-6 space-y-5">
        <div className="space-y-2">
          <div
            className="text-xs font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1"
            style={{ background: "hsl(38 95% 55% / 0.2)", color: "hsl(38 95% 70%)" }}
          >
            <Search size={10} />
            DATA CHALLENGE {currentIndex + 1}
          </div>
          <h2 className="text-xl font-bold text-foreground" data-testid="text-challenge-title">
            {challenge.title}
          </h2>
          <p className="text-foreground/80 text-sm leading-relaxed">{challenge.description}</p>
        </div>

        {!submitted && (
          <button
            data-testid="button-show-hint"
            onClick={() => setShowHint(!showHint)}
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <HelpCircle size={14} />
            {showHint ? "Hide hint" : "Show hint"}
          </button>
        )}
        {showHint && !submitted && (
          <div
            className="animate-slide-in-up rounded-lg p-3 text-sm"
            style={{ background: "hsl(262 80% 65% / 0.1)", border: "1px solid hsl(262 80% 65% / 0.25)" }}
          >
            <span style={{ color: "hsl(262 80% 75%)" }}>Hint: </span>
            <span className="text-muted-foreground">{challenge.hint}</span>
          </div>
        )}

        <div className="space-y-2">
          <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wide">
            {submitted ? "Results — highlighted rows show issues found" : "Click rows you believe have issues:"}
          </p>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "hsl(230 22% 14%)" }}>
                  <th className="text-left px-3 py-2.5 text-muted-foreground font-medium text-xs">#</th>
                  <th className="text-left px-3 py-2.5 text-muted-foreground font-medium text-xs">Prefix/ID</th>
                  <th className="text-left px-3 py-2.5 text-muted-foreground font-medium text-xs">Next-Hop/Intf</th>
                  <th className="text-left px-3 py-2.5 text-muted-foreground font-medium text-xs">Metric</th>
                  <th className="text-left px-3 py-2.5 text-muted-foreground font-medium text-xs">Proto/State</th>
                  <th className="text-left px-3 py-2.5 text-muted-foreground font-medium text-xs">Age</th>
                  {submitted && <th className="text-left px-3 py-2.5 text-muted-foreground font-medium text-xs">Status</th>}
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
                      className={`border-t border-border transition-all duration-150 ${!submitted ? "cursor-pointer hover:bg-white/3" : ""} ${rowClass}`}
                      style={isSelected && !submitted ? { borderLeft: "3px solid hsl(262 80% 65%)" } : {}}
                    >
                      <td className="px-3 py-2.5 text-muted-foreground font-mono text-xs">{entry.id}</td>
                      <td className="px-3 py-2.5 text-foreground font-mono text-xs font-medium">{entry.prefix}</td>
                      <td className="px-3 py-2.5 text-foreground/80 font-mono text-xs">{entry.nextHop}</td>
                      <td className="px-3 py-2.5 text-foreground/80 font-mono text-xs">{entry.metric}</td>
                      <td className="px-3 py-2.5 text-foreground/80 font-mono text-xs">{entry.protocol}</td>
                      <td className="px-3 py-2.5 text-muted-foreground font-mono text-xs">{entry.age}</td>
                      {submitted && (
                        <td className="px-3 py-2.5">
                          {entry.hasIssue && isSelected && <CheckCircle size={14} style={{ color: "hsl(130 60% 60%)" }} />}
                          {entry.hasIssue && !isSelected && <XCircle size={14} style={{ color: "hsl(38 95% 65%)" }} />}
                          {!entry.hasIssue && isSelected && <XCircle size={14} style={{ color: "hsl(0 75% 65%)" }} />}
                          {!entry.hasIssue && !isSelected && <CheckCircle size={14} className="opacity-30" style={{ color: "hsl(130 60% 60%)" }} />}
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
            style={{ background: "hsl(38 95% 55%)", color: "white" }}
          >
            Submit Analysis ({selected.size} selected)
          </button>
        )}

        {submitted && (
          <div
            className="animate-slide-in-up rounded-xl p-4 space-y-3"
            style={{ background: "hsl(262 80% 65% / 0.1)", border: "1px solid hsl(262 80% 65% / 0.25)" }}
          >
            <div className="font-semibold text-sm" style={{ color: "hsl(262 80% 75%)" }}>
              Analysis Complete — Round Score: {roundScores[roundScores.length - 1]}
            </div>
            <p className="text-muted-foreground text-sm">{challenge.explanation}</p>
            <button
              data-testid="button-next-challenge"
              onClick={handleNext}
              className="w-full mt-1 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90"
              style={{ background: "hsl(262 80% 65%)", color: "white" }}
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
