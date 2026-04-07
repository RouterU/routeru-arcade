import { useState, useEffect, useCallback } from "react";
import { quizQuestions, type QuizQuestion } from "@/data/quizData";
import { Trophy, Clock, Zap, CheckCircle, XCircle, ChevronRight, RotateCcw } from "lucide-react";

interface QuizGameProps {
  onComplete: (score: number, streak: number) => void;
  onBack: () => void;
}

type AnswerState = "unanswered" | "correct" | "incorrect";

const TIME_PER_QUESTION = 15;
const SHUFFLE_COUNT = 8;

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function QuizGame({ onComplete, onBack }: QuizGameProps) {
  const [questions] = useState<QuizQuestion[]>(() =>
    shuffleArray(quizQuestions).slice(0, SHUFFLE_COUNT)
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [answerState, setAnswerState] = useState<AnswerState>("unanswered");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [bonusPoints, setBonusPoints] = useState(0);
  const [shake, setShake] = useState(false);
  const [finished, setFinished] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>([]);

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex) / questions.length) * 100;

  const handleTimeUp = useCallback(() => {
    if (answerState === "unanswered") {
      setAnswerState("incorrect");
      setStreak(0);
      setShowExplanation(true);
      setShake(true);
      setTimeout(() => setShake(false), 400);
      setAnsweredQuestions((prev) => {
        const n = [...prev];
        n[currentIndex] = false;
        return n;
      });
    }
  }, [answerState, currentIndex]);

  useEffect(() => {
    if (answerState !== "unanswered" || finished) return;
    if (timeLeft <= 0) {
      handleTimeUp();
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, answerState, finished, handleTimeUp]);

  const handleAnswer = (optionIndex: number) => {
    if (answerState !== "unanswered") return;

    const isCorrect = optionIndex === currentQuestion.correctIndex;
    setSelectedIndex(optionIndex);

    const streakBonus = streak >= 3 ? Math.floor(streak / 3) * 50 : 0;
    const timeBonus = Math.floor((timeLeft / TIME_PER_QUESTION) * 50);
    const earned = isCorrect ? currentQuestion.points + streakBonus + timeBonus : 0;

    setBonusPoints(streakBonus + timeBonus);

    if (isCorrect) {
      setAnswerState("correct");
      setScore((s) => s + earned);
      setStreak((s) => {
        const ns = s + 1;
        setMaxStreak((ms) => Math.max(ms, ns));
        return ns;
      });
    } else {
      setAnswerState("incorrect");
      setStreak(0);
      setShake(true);
      setTimeout(() => setShake(false), 400);
    }

    setShowExplanation(true);
    setAnsweredQuestions((prev) => {
      const n = [...prev];
      n[currentIndex] = isCorrect;
      return n;
    });
  };

  const handleNext = () => {
    if (currentIndex + 1 >= questions.length) {
      setFinished(true);
      onComplete(score, maxStreak);
    } else {
      setCurrentIndex((i) => i + 1);
      setAnswerState("unanswered");
      setSelectedIndex(null);
      setShowExplanation(false);
      setTimeLeft(TIME_PER_QUESTION);
      setBonusPoints(0);
    }
  };

  const timerFraction = timeLeft / TIME_PER_QUESTION;
  const timerColor =
    timerFraction > 0.5
      ? "hsl(262 80% 65%)"
      : timerFraction > 0.25
        ? "hsl(38 95% 58%)"
        : "hsl(0 75% 55%)";

  if (finished) {
    const correctCount = answeredQuestions.filter(Boolean).length;
    return (
      <div className="animate-pop-in max-w-2xl mx-auto text-center space-y-8 py-8">
        <div className="space-y-2">
          <div className="text-6xl font-bold score-number">{score.toLocaleString()}</div>
          <p className="text-muted-foreground text-lg">Final Score</p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="game-card p-4">
            <div className="text-2xl font-bold text-foreground">{correctCount}/{questions.length}</div>
            <p className="text-muted-foreground text-sm mt-1">Correct</p>
          </div>
          <div className="game-card p-4">
            <div className="text-2xl font-bold" style={{ color: "hsl(38 95% 65%)" }}>
              {maxStreak}
            </div>
            <p className="text-muted-foreground text-sm mt-1">Best Streak</p>
          </div>
          <div className="game-card p-4">
            <div className="text-2xl font-bold" style={{ color: "hsl(130 60% 60%)" }}>
              {Math.round((correctCount / questions.length) * 100)}%
            </div>
            <p className="text-muted-foreground text-sm mt-1">Accuracy</p>
          </div>
        </div>
        <div className="flex gap-4 justify-center">
          <button
            data-testid="button-back-to-hub"
            onClick={onBack}
            className="px-6 py-3 rounded-xl border border-border text-foreground font-semibold hover:bg-secondary transition-all"
          >
            Back to Hub
          </button>
          <button
            data-testid="button-play-again"
            onClick={() => window.location.reload()}
            className="px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all"
            style={{ background: "hsl(262 80% 65%)", color: "white" }}
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
          data-testid="button-quiz-back"
          onClick={onBack}
          className="text-muted-foreground hover:text-foreground transition-colors text-sm flex items-center gap-1"
        >
          ← Back
        </button>
        <div className="flex items-center gap-4">
          {streak >= 2 && (
            <div className="streak-badge flex items-center gap-1">
              <Zap size={12} />
              {streak}x Streak
            </div>
          )}
          <div className="flex items-center gap-2 text-foreground">
            <Trophy size={16} style={{ color: "hsl(38 95% 58%)" }} />
            <span className="font-bold score-number text-lg">{score.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Question {currentIndex + 1} of {questions.length}</span>
          <span
            className={`flex items-center gap-1 font-bold ${timeLeft <= 5 ? "animate-timer-pulse" : ""}`}
            style={{ color: timerColor }}
            data-testid="text-timer"
          >
            <Clock size={14} />
            {timeLeft}s
          </span>
        </div>
        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${progress}%`, background: "hsl(262 80% 65%)" }}
          />
        </div>
        <div className="h-1 bg-secondary rounded-full overflow-hidden">
          <div
            className="timer-bar"
            style={{ width: `${(timeLeft / TIME_PER_QUESTION) * 100}%`, background: timerColor }}
          />
        </div>
      </div>

      <div className={`game-card p-6 space-y-6 ${shake ? "animate-shake" : "animate-slide-in-up"}`}>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{
                background:
                  currentQuestion.difficulty === "hard"
                    ? "hsl(0 75% 55% / 0.2)"
                    : currentQuestion.difficulty === "medium"
                      ? "hsl(38 95% 58% / 0.2)"
                      : "hsl(130 60% 50% / 0.2)",
                color:
                  currentQuestion.difficulty === "hard"
                    ? "hsl(0 75% 70%)"
                    : currentQuestion.difficulty === "medium"
                      ? "hsl(38 95% 70%)"
                      : "hsl(130 60% 70%)",
              }}
            >
              {currentQuestion.difficulty.toUpperCase()} · {currentQuestion.points}pts
            </span>
          </div>
          <h2 className="text-xl font-semibold text-foreground leading-snug" data-testid="text-question">
            {currentQuestion.question}
          </h2>
        </div>

        <div className="space-y-3">
          {currentQuestion.options.map((option, idx) => {
            let btnClass = "answer-btn";
            if (answerState !== "unanswered") {
              if (idx === currentQuestion.correctIndex) btnClass += " correct";
              else if (idx === selectedIndex && !( idx === currentQuestion.correctIndex)) btnClass += " incorrect";
            }
            return (
              <button
                key={idx}
                data-testid={`button-option-${idx}`}
                className={btnClass}
                onClick={() => handleAnswer(idx)}
                disabled={answerState !== "unanswered"}
              >
                <span className="flex items-center gap-3">
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                    style={{ background: "hsl(230 22% 20%)" }}
                  >
                    {String.fromCharCode(65 + idx)}
                  </span>
                  {option}
                </span>
              </button>
            );
          })}
        </div>

        {showExplanation && (
          <div
            className="animate-slide-in-up rounded-xl p-4 space-y-2"
            style={{
              background:
                answerState === "correct"
                  ? "hsl(130 60% 45% / 0.1)"
                  : "hsl(0 75% 55% / 0.1)",
              border: `1px solid ${answerState === "correct" ? "hsl(130 60% 50% / 0.3)" : "hsl(0 75% 55% / 0.3)"}`,
            }}
          >
            <div className="flex items-center gap-2">
              {answerState === "correct" ? (
                <CheckCircle size={16} style={{ color: "hsl(130 60% 60%)" }} />
              ) : (
                <XCircle size={16} style={{ color: "hsl(0 75% 65%)" }} />
              )}
              <span
                className="font-semibold text-sm"
                style={{
                  color: answerState === "correct" ? "hsl(130 60% 70%)" : "hsl(0 75% 70%)",
                }}
              >
                {answerState === "correct" ? `Correct! +${currentQuestion.points + bonusPoints} pts` : "Not quite!"}
              </span>
              {answerState === "correct" && bonusPoints > 0 && (
                <span className="text-xs text-muted-foreground">(includes +{bonusPoints} bonus)</span>
              )}
            </div>
            <p className="text-muted-foreground text-sm">{currentQuestion.explanation}</p>
            <button
              data-testid="button-next-question"
              onClick={handleNext}
              className="w-full mt-2 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90"
              style={{ background: "hsl(262 80% 65%)", color: "white" }}
            >
              {currentIndex + 1 >= questions.length ? "View Results" : "Next Question"}
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
