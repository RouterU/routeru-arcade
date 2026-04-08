import { useState } from "react";
import {
  Zap,
  BookOpen,
  Database,
  Trophy,
  Star,
  ChevronRight,
  Route,
  FileSearch,
  ShieldCheck,
  Truck,
} from "lucide-react";
import QuizGame from "@/components/QuizGame";
import DataChallengeGame from "@/components/DataChallengeGame";
import RouteRunnerGame from "@/components/RouteRunnerGame";
import ScenarioGame from "@/components/ScenarioGame";
import Leaderboard from "@/components/Leaderboard";
import ScoreSubmit from "@/components/ScoreSubmit";
import { useLeaderboard } from "@/store/gameStore";
import professorImg from "./Professor Gus with clipboard57.jpg";

type GameView =
  | "hub"
  | "quiz"
  | "scenario"
  | "data-challenge"
  | "route-runner"
  | "submit-quiz"
  | "submit-scenario"
  | "submit-data"
  | "submit-route-runner";

interface PendingScore {
  score: number;
  streak?: number;
  game: "quiz" | "scenario" | "data-challenge" | "route-runner";
}

const GAMES = [
  {
    id: "quiz" as const,
    icon: Route,
    title: "Route Blitz",
    description:
      "Race the clock on routing decisions, service priorities, late risks, and dispatch tradeoffs.",
    color: "hsl(5 84% 48%)",
    badge: "8 Questions",
    difficulty: "Mixed",
    cta: "Dispatch",
  },
  {
    id: "scenario" as const,
    icon: ShieldCheck,
    title: "What Would You Do?",
    description:
      "Work through real-world routing and dispatch situations and make the best operational decision.",
    color: "hsl(5 84% 48%)",
    badge: "5 Scenarios",
    difficulty: "Medium",
    cta: "Dispatch",
  },
  {
    id: "data-challenge" as const,
    icon: FileSearch,
    title: "Issue Hunter",
    description:
      "Review route and account data to spot Off Day, Under Minimum, and publish-risk issues.",
    color: "hsl(5 84% 48%)",
    badge: "3 Challenges",
    difficulty: "Hard",
    cta: "Dispatch",
  },
  {
    id: "route-runner" as const,
    icon: Truck,
    title: "Route Runner",
    description:
      "A hybrid training game with 6 questions and 3 driving rounds. Answer, drive, dodge obstacles, and collect packages.",
    color: "hsl(5 84% 48%)",
    badge: "6 Questions • 3 Runs",
    difficulty: "Arcade",
    cta: "Play Route Runner!",
  },
];

export default function Home() {
  const [view, setView] = useState<GameView>("hub");
  const [pending, setPending] = useState<PendingScore | null>(null);
  const [sessionScore, setSessionScore] = useState(0);
  const { topEntries, addEntry, resetLeaderboard } = useLeaderboard();

  const handleQuizComplete = (score: number, streak: number) => {
    setSessionScore((s) => s + score);
    setPending({ score, streak, game: "quiz" });
    setView("submit-quiz");
  };

  const handleScenarioComplete = (score: number) => {
    setSessionScore((s) => s + score);
    setPending({ score, game: "scenario" });
    setView("submit-scenario");
  };

  const handleDataComplete = (score: number) => {
    setSessionScore((s) => s + score);
    setPending({ score, game: "data-challenge" });
    setView("submit-data");
  };

  const handleRouteRunnerComplete = (score: number) => {
    setSessionScore((s) => s + score);
    setPending({ score, game: "route-runner" });
    setView("submit-route-runner");
  };

  const handleSubmitScore = (name: string) => {
    if (!pending) return;
    addEntry(name, pending.score, pending.game);
    setPending(null);
    setView("hub");
  };

  const handleSkipSubmit = () => {
    setPending(null);
    setView("hub");
  };

  const pageBackground = {
    background: `
      radial-gradient(circle at 18% 18%, hsla(128, 46%, 30%, 0.65), transparent 32%),
      radial-gradient(circle at 82% 6%, hsla(5, 84%, 42%, 0.38), transparent 26%),
      radial-gradient(circle at 50% 45%, hsla(128, 32%, 18%, 0.35), transparent 42%),
      linear-gradient(180deg, hsl(128 38% 14%), hsl(0 0% 7%) 58%, hsl(0 0% 5%))
    `,
  } as const;

  if (view === "quiz") {
    return (
      <div className="min-h-screen px-4 py-8" style={pageBackground}>
        <QuizGame onComplete={handleQuizComplete} onBack={() => setView("hub")} />
      </div>
    );
  }

  if (view === "scenario") {
    return (
      <div className="min-h-screen px-4 py-8" style={pageBackground}>
        <ScenarioGame onComplete={handleScenarioComplete} onBack={() => setView("hub")} />
      </div>
    );
  }

  if (view === "data-challenge") {
    return (
      <div className="min-h-screen px-4 py-8" style={pageBackground}>
        <DataChallengeGame onComplete={handleDataComplete} onBack={() => setView("hub")} />
      </div>
    );
  }

  if (view === "route-runner") {
    return (
      <div className="min-h-screen px-4 py-8" style={pageBackground}>
        <RouteRunnerGame
          onComplete={handleRouteRunnerComplete}
          onBack={() => setView("hub")}
        />
      </div>
    );
  }

  if (
    view === "submit-quiz" ||
    view === "submit-scenario" ||
    view === "submit-data" ||
    view === "submit-route-runner"
  ) {
    return (
      <div
        className="min-h-screen px-4 py-8 flex items-center justify-center"
        style={pageBackground}
      >
        <ScoreSubmit
          score={pending?.score ?? 0}
          game={pending?.game ?? "quiz"}
          onSubmit={handleSubmitScore}
          onSkip={handleSkipSubmit}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8" style={pageBackground}>
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="grid lg:grid-cols-[1.2fr_.8fr] gap-8 items-center animate-slide-in-up">
          <div className="text-center lg:text-left space-y-4">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-2"
              style={{
                background: "hsl(5 84% 48% / 0.14)",
                color: "hsl(38 45% 96%)",
                border: "1px solid hsl(5 84% 48% / 0.35)",
                boxShadow: "0 0 0 1px hsl(128 20% 22%) inset",
              }}
            >
              <Star size={12} />
              US Foods Router Training
            </div>

            <h1
              className="text-5xl md:text-6xl font-bold tracking-tight"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                color: "hsl(38 45% 96%)",
                textShadow: "0 0 24px rgba(0,0,0,0.28)",
              }}
            >
              <span style={{ color: "hsl(38 45% 96%)" }}>RouterU</span>{" "}
              <span style={{ color: "hsl(5 84% 48%)" }}>Arcade</span>
            </h1>

            <p
              className="text-lg max-w-2xl lg:max-w-xl leading-relaxed mx-auto lg:mx-0"
              style={{ color: "hsl(0 0% 76%)" }}
            >
              Sharpen routing judgment, service protection, and exception handling through
              fast-paced mini-games built for real operations.
            </p>

            {sessionScore > 0 && (
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mt-2"
                style={{
                  background: "hsl(128 35% 24% / 0.78)",
                  color: "hsl(38 45% 96%)",
                  border: "1px solid hsl(128 22% 32%)",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
                }}
              >
                <Trophy size={14} style={{ color: "hsl(38 88% 61%)" }} />
                Session Score: {sessionScore.toLocaleString()}
              </div>
            )}
          </div>

          <div className="flex justify-center lg:justify-end">
            <div
              className="relative rounded-[2rem] border p-4"
              style={{
                background:
                  "linear-gradient(180deg, hsl(128 24% 20%), hsl(0 0% 12%))",
                borderColor: "hsl(128 20% 30%)",
                boxShadow: "0 18px 45px rgba(0,0,0,0.32)",
              }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-2 rounded-t-[2rem]"
                style={{ background: "hsl(5 84% 48%)" }}
              />
              <img
                src={professorImg}
                alt="US Foods training professor mascot"
                className="w-[220px] md:w-[260px] h-auto object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
          {GAMES.map((game, i) => {
            const Icon = game.icon;

            return (
              <div
                key={game.id}
                className="rounded-3xl p-6 cursor-pointer transition-all hover:-translate-y-1 animate-slide-in-up"
                style={{
                  animationDelay: `${i * 0.08}s`,
                  background: "linear-gradient(180deg, hsl(0 0% 15%), hsl(0 0% 11%))",
                  border: "1px solid hsl(128 20% 28%)",
                  boxShadow: "0 14px 32px rgba(0,0,0,0.30)",
                }}
                onClick={() => setView(game.id)}
                data-testid={`card-game-${game.id}`}
              >
                <div className="flex items-center justify-between mb-5">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{
                      background: "hsl(128 34% 22%)",
                      border: "1px solid hsl(128 20% 32%)",
                      boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.02)",
                    }}
                  >
                    <Icon size={19} style={{ color: "hsl(38 45% 96%)" }} />
                  </div>

                  <span
                    className="text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{
                      background: "hsl(5 84% 48% / 0.18)",
                      color: "hsl(38 45% 96%)",
                      border: "1px solid hsl(5 84% 48% / 0.22)",
                    }}
                  >
                    {game.badge}
                  </span>
                </div>

                <h2
                  className="text-2xl font-bold mb-3 leading-tight"
                  style={{ color: "hsl(38 45% 96%)" }}
                >
                  {game.title}
                </h2>

                <p
                  className="text-sm leading-relaxed mb-6"
                  style={{ color: "hsl(0 0% 74%)" }}
                >
                  {game.description}
                </p>

                <div className="flex items-center justify-between">
                  <span
                    className="text-xs font-medium"
                    style={{ color: "hsl(0 0% 58%)" }}
                  >
                    Difficulty: {game.difficulty}
                  </span>

                  <button
                    data-testid={`button-play-${game.id}`}
                    className="flex items-center gap-1 text-sm font-semibold transition-all hover:gap-2"
                    style={{ color: game.color }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setView(game.id);
                    }}
                  >
                    {game.cta} <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div
              className="rounded-3xl border"
              style={{
                background: "linear-gradient(180deg, hsl(0 0% 15%), hsl(0 0% 11%))",
                borderColor: "hsl(128 20% 28%)",
                boxShadow: "0 14px 32px rgba(0,0,0,0.30)",
              }}
            >
              <Leaderboard
                entries={topEntries}
                currentScore={sessionScore > 0 ? sessionScore : undefined}
              />
            </div>

            <button
              type="button"
              onClick={() => {
                const confirmed = window.confirm(
                  "Reset the leaderboard for all scores saved on this device?"
                );
                if (confirmed) resetLeaderboard();
              }}
              className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
              style={{
                background: "hsl(5 84% 48%)",
                color: "white",
                boxShadow: "0 8px 18px rgba(170, 24, 24, 0.32)",
              }}
            >
              Reset Leaderboard
            </button>
          </div>

          <div
            className="p-5 space-y-4 rounded-3xl border"
            style={{
              background: "linear-gradient(180deg, hsl(0 0% 15%), hsl(0 0% 11%))",
              borderColor: "hsl(128 20% 28%)",
              boxShadow: "0 14px 32px rgba(0,0,0,0.30)",
            }}
          >
            <div className="flex items-center gap-2">
              <Star size={18} style={{ color: "hsl(5 84% 48%)" }} />
              <h3
                className="font-bold"
                style={{ color: "hsl(38 45% 96%)" }}
              >
                How Scoring Works
              </h3>
            </div>

            <div className="space-y-4">
              {[
                {
                  icon: Zap,
                  color: "hsl(5 84% 48%)",
                  title: "Route Blitz",
                  desc: "Base points per question + time bonus + streak multipliers.",
                },
                {
                  icon: BookOpen,
                  color: "hsl(5 84% 48%)",
                  title: "What Would You Do?",
                  desc: "Best operational choice earns the most points.",
                },
                {
                  icon: Database,
                  color: "hsl(38 95% 55%)",
                  title: "Issue Hunter",
                  desc: "Spot issues accurately to maximize your audit score.",
                },
                {
                  icon: Truck,
                  color: "hsl(5 84% 48%)",
                  title: "Route Runner",
                  desc: "6 questions, 3 drive rounds, and bonus points from packages and survival.",
                },
              ].map(({ icon: Icon, color, title, desc }) => (
                <div key={title} className="flex gap-3">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                    style={{
                      background: `${color}18`,
                      border: `1px solid ${color}25`,
                    }}
                  >
                    <Icon size={14} style={{ color }} />
                  </div>

                  <div>
                    <div
                      className="text-sm font-semibold mb-1"
                      style={{ color: "hsl(38 45% 96%)" }}
                    >
                      {title}
                    </div>
                    <div
                      className="text-xs leading-relaxed"
                      style={{ color: "hsl(0 0% 72%)" }}
                    >
                      {desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}