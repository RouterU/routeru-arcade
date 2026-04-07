# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Artifacts

### RouterU Arcade (`artifacts/routeru-arcade`)
- **Type**: React + Vite SPA (frontend-only, no backend)
- **Preview Path**: `/`
- **Description**: Gamified networking training platform with three mini-games
- **Games**:
  - Speed Quiz: 8 random questions on routing protocols with timer, streak tracking, bonus points
  - Scenario Decisions: 5 real-world network troubleshooting scenarios with multiple choice outcomes
  - Data Challenge: 3 routing/BGP table analysis rounds — identify anomalous entries
- **Features**: Scoring system, streak bonuses, leaderboard (in-memory seeded data), score submission
- **Theme**: Dark mode with purple/teal/gold accent palette
- **Key files**:
  - `src/data/quizData.ts` — Quiz questions
  - `src/data/scenarioData.ts` — Scenario decision data
  - `src/data/dataChallenge.ts` — Routing table datasets
  - `src/store/gameStore.ts` — Leaderboard state hook
  - `src/components/QuizGame.tsx` — Quiz mini-game
  - `src/components/ScenarioGame.tsx` — Scenario mini-game
  - `src/components/DataChallengeGame.tsx` — Data analysis mini-game
  - `src/components/Leaderboard.tsx` — Leaderboard UI
  - `src/pages/Home.tsx` — Hub / game selection

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
