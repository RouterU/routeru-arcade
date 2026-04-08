import { useState, useEffect, useCallback } from "react";
import { quizQuestions, type QuizQuestion } from "@/data/quizData";
import {
  Trophy,
  Clock,
  Zap,
  CheckCircle,
  XCircle,
  ChevronRight,
  RotateCcw,
} from "lucide-react";

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
  const progress = (currentIndex / questions.length) * 100;

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
      ? "hsl(5 84% 48%)"
      : timerFraction > 0.25
      ? "hsl(38 95% 58%)"
      : "hsl(0 75% 55%)";

  if (finished) {
    const correctCount = answeredQuestions.filter(Boolean).length;

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
              style={{ color: "hsl(38 45% 96%)" }}
            >
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
            <div
              className="text-2xl font-bold"
              style={{ color: "hsl(38 95% 65%)" }}
            >
              {maxStreak}
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
            <div
              className="text-2xl font-bold"
              style={{ color: "hsl(130 60% 60%)" }}
            >
              {Math.round((correctCount / questions.length) * 100)}%
            </div>
            <p className="text-sm mt-1" style={{ color: "hsl(0 0% 68%)" }}>
              Accuracy
            </p>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            data-testid="button-back-to-hub"
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
            data-testid="button-play-again"
            onClick={() => window.location.reload()}
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
          data-testid="button-quiz-back"
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
              <Zap size={12} />
              {streak}x Streak
            </div>
          )}

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
      </div>

      <div className="space-y-2">
        <div
          className="flex items-center justify-between text-sm"
          style={{ color: "hsl(0 0% 70%)" }}
        >
          <span>
            Question {currentIndex + 1} of {questions.length}
          </span>
          <span
            className={`flex items-center gap-1 font-bold ${
              timeLeft <= 5 ? "animate-timer-pulse" : ""
            }`}
            style={{ color: timerColor }}
            data-testid="text-timer"
          >
            <Clock size={14} />
            {timeLeft}s
          </span>
        </div>

        <div
          className="h-1.5 rounded-full overflow-hidden"
          style={{ background: "hsl(0 0% 16%)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${progress}%`, background: "hsl(5 84% 48%)" }}
          />
        </div>

        <div
          className="h-1 rounded-full overflow-hidden"
          style={{ background: "hsl(0 0% 16%)" }}
        >
          <div
            className="timer-bar"
            style={{
              width: `${(timeLeft / TIME_PER_QUESTION) * 100}%`,
              background: timerColor,
            }}
          />
        </div>
      </div>

      <div
        className={`p-6 space-y-6 rounded-3xl border ${
          shake ? "animate-shake" : "animate-slide-in-up"
        }`}
        style={{
          background: "linear-gradient(180deg, hsl(0 0% 15%), hsl(0 0% 11%))",
          borderColor: "hsl(128 20% 24%)",
          boxShadow: "0 14px 32px rgba(0,0,0,0.30)",
        }}
      >
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{
                background:
                  currentQuestion.difficulty === "hard"
                    ? "hsl(0 75% 55% / 0.18)"
                    : currentQuestion.difficulty === "medium"
                    ? "hsl(38 95% 58% / 0.18)"
                    : "hsl(130 60% 50% / 0.18)",
                color:
                  currentQuestion.difficulty === "hard"
                    ? "hsl(0 75% 70%)"
                    : currentQuestion.difficulty === "medium"
                    ? "hsl(38 95% 70%)"
                    : "hsl(130 60% 70%)",
                border:
                  currentQuestion.difficulty === "hard"
                    ? "1px solid hsl(0 75% 55% / 0.25)"
                    : currentQuestion.difficulty === "medium"
                    ? "1px solid hsl(38 95% 58% / 0.25)"
                    : "1px solid hsl(130 60% 50% / 0.25)",
              }}
            >
              {currentQuestion.difficulty.toUpperCase()} · {currentQuestion.points}pts
            </span>
          </div>

          <h2
            className="text-xl font-semibold leading-snug"
            data-testid="text-question"
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
              } else if (
                idx === selectedIndex &&
                idx !== currentQuestion.correctIndex
              ) {
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
                data-testid={`button-option-${idx}`}
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
            className="animate-slide-in-up rounded-2xl p-4 space-y-2"
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
            <div className="flex items-center gap-2">
              {answerState === "correct" ? (
                <CheckCircle size={16} style={{ color: "hsl(130 60% 60%)" }} />
              ) : (
                <XCircle size={16} style={{ color: "hsl(0 75% 65%)" }} />
              )}

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
                  ? `Correct! +${currentQuestion.points + bonusPoints} pts`
                  : "Not quite!"}
              </span>

              {answerState === "correct" && bonusPoints > 0 && (
                <span style={{ color: "hsl(0 0% 68%)" }} className="text-xs">
                  (includes +{bonusPoints} bonus)
                </span>
              )}
            </div>

            <p className="text-sm" style={{ color: "hsl(0 0% 72%)" }}>
              {currentQuestion.explanation}
            </p>

            <button
              data-testid="button-next-question"
              onClick={handleNext}
              className="w-full mt-2 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90"
              style={{
                background: "hsl(5 84% 48%)",
                color: "white",
                boxShadow: "0 8px 18px rgba(170, 24, 24, 0.30)",
              }}
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