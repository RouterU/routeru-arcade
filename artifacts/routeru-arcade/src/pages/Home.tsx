import { useState } from "react";
import { Zap, BookOpen, Database, Trophy, Star, ChevronRight } from "lucide-react";
import QuizGame from "@/components/QuizGame";
import ScenarioGame from "@/components/ScenarioGame";
import DataChallengeGame from "@/components/DataChallengeGame";
import Leaderboard from "@/components/Leaderboard";
import ScoreSubmit from "@/components/ScoreSubmit";
import { useLeaderboard } from "@/store/gameStore";

type GameView = "hub" | "quiz" | "scenario" | "data-challenge" | "submit-quiz" | "submit-scenario" | "submit-data";

interface PendingScore {
  score: number;
  streak?: number;
  game: "quiz" | "scenario" | "data-challenge";
}

const GAMES = [
  {
    id: "quiz" as const,
    icon: Zap,
    title: "Speed Quiz",
    description: "Race the clock on routing protocols, BGP, OSPF, and more. Streak bonuses multiply your score.",
    color: "hsl(262 80% 65%)",
    bg: "hsl(262 80% 65% / 0.1)",
    border: "hsl(262 80% 65% / 0.25)",
    badge: "8 Questions",
    badgeBg: "hsl(262 80% 65% / 0.2)",
    badgeColor: "hsl(262 80% 75%)",
    difficulty: "Mixed",
  },
  {
    id: "scenario" as const,
    icon: BookOpen,
    title: "Scenario Decisions",
    description: "Real-world network crises. Make the right call under pressure. Every decision has consequences.",
    color: "hsl(180 70% 45%)",
    bg: "hsl(180 70% 45% / 0.1)",
    border: "hsl(180 70% 45% / 0.25)",
    badge: "5 Scenarios",
    badgeBg: "hsl(180 70% 45% / 0.2)",
    badgeColor: "hsl(180 70% 65%)",
    difficulty: "Medium",
  },
  {
    id: "data-challenge" as const,
    icon: Database,
    title: "Data Challenge",
    description: "Analyze routing tables and BGP tables. Spot the anomalies, bogons, and misconfigurations.",
    color: "hsl(38 95% 55%)",
    bg: "hsl(38 95% 55% / 0.1)",
    border: "hsl(38 95% 55% / 0.25)",
    badge: "3 Datasets",
    badgeBg: "hsl(38 95% 55% / 0.2)",
    badgeColor: "hsl(38 95% 70%)",
    difficulty: "Hard",
  },
];

export default function Home() {
  const [view, setView] = useState<GameView>("hub");
  const [pending, setPending] = useState<PendingScore | null>(null);
  const [sessionScore, setSessionScore] = useState(0);
  const { topEntries, addEntry } = useLeaderboard();

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

  if (view === "quiz") {
    return (
      <div className="min-h-screen px-4 py-8">
        <QuizGame onComplete={handleQuizComplete} onBack={() => setView("hub")} />
      </div>
    );
  }

  if (view === "scenario") {
    return (
      <div className="min-h-screen px-4 py-8">
        <ScenarioGame onComplete={handleScenarioComplete} onBack={() => setView("hub")} />
      </div>
    );
  }

  if (view === "data-challenge") {
    return (
      <div className="min-h-screen px-4 py-8">
        <DataChallengeGame onComplete={handleDataComplete} onBack={() => setView("hub")} />
      </div>
    );
  }

  if (view === "submit-quiz" || view === "submit-scenario" || view === "submit-data") {
    return (
      <div className="min-h-screen px-4 py-8 flex items-center justify-center">
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
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="text-center space-y-3 animate-slide-in-up">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-2"
            style={{ background: "hsl(262 80% 65% / 0.15)", color: "hsl(262 80% 75%)", border: "1px solid hsl(262 80% 65% / 0.25)" }}
          >
            <Star size={12} />
            Gamified Networking Training
          </div>
          <h1
            className="text-5xl md:text-6xl font-bold tracking-tight"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            <span className="score-number">RouterU</span>{" "}
            <span className="text-foreground">Arcade</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Master routing protocols, BGP, and network troubleshooting through fast-paced mini-games.
          </p>
          {sessionScore > 0 && (
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mt-2"
              style={{ background: "hsl(38 95% 55% / 0.15)", color: "hsl(38 95% 70%)", border: "1px solid hsl(38 95% 55% / 0.3)" }}
            >
              <Trophy size={14} />
              Session Score: {sessionScore.toLocaleString()}
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {GAMES.map((game, i) => {
            const Icon = game.icon;
            return (
              <div
                key={game.id}
                className="game-card p-6 space-y-4 animate-slide-in-up cursor-pointer"
                style={{ animationDelay: `${i * 0.08}s` }}
                onClick={() => setView(game.id)}
                data-testid={`card-game-${game.id}`}
              >
                <div className="flex items-start justify-between">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{ background: game.bg, border: `1px solid ${game.border}` }}
                  >
                    <Icon size={22} style={{ color: game.color }} />
                  </div>
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: game.badgeBg, color: game.badgeColor }}
                  >
                    {game.badge}
                  </span>
                </div>
                <div className="space-y-1">
                  <h2 className="text-lg font-bold text-foreground">{game.title}</h2>
                  <p className="text-muted-foreground text-sm leading-relaxed">{game.description}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Difficulty: {game.difficulty}</span>
                  <button
                    data-testid={`button-play-${game.id}`}
                    className="flex items-center gap-1 text-sm font-semibold transition-all hover:gap-2"
                    style={{ color: game.color }}
                    onClick={(e) => { e.stopPropagation(); setView(game.id); }}
                  >
                    Play <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Leaderboard entries={topEntries} currentScore={sessionScore > 0 ? sessionScore : undefined} />

          <div className="game-card p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Star size={18} style={{ color: "hsl(262 80% 65%)" }} />
              <h3 className="font-bold text-foreground">How Scoring Works</h3>
            </div>
            <div className="space-y-3">
              {[
                { icon: Zap, color: "hsl(262 80% 65%)", title: "Speed Quiz", desc: "Base points per question + time bonus + streak multipliers. Answer fast for maximum points." },
                { icon: BookOpen, color: "hsl(180 70% 45%)", title: "Scenarios", desc: "Best decision = 300pts, acceptable = 100pts, poor decision = 0pts. No partial credit." },
                { icon: Database, color: "hsl(38 95% 55%)", title: "Data Challenge", desc: "Points for correct identifications. False positives and missed issues reduce your score." },
              ].map(({ icon: Icon, color, title, desc }) => (
                <div key={title} className="flex gap-3">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: `${color}18` }}
                  >
                    <Icon size={14} style={{ color }} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">{title}</div>
                    <div className="text-xs text-muted-foreground leading-relaxed">{desc}</div>
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
