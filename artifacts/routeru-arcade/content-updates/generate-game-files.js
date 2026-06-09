import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const contentDir = __dirname;
const baseDir = path.resolve(contentDir, "..");
const dataDir = path.join(baseDir, "src", "data");
const templatePath = path.join(contentDir, "master-template.json");

const raw = fs.readFileSync(templatePath, "utf8");
const content = JSON.parse(raw);

function writeFile(fileName, fileContent) {
  const fullPath = path.join(dataDir, fileName);
  fs.writeFileSync(fullPath, fileContent, "utf8");
  console.log(`Updated ${fileName}`);
}

function normalizeDifficulty(value) {
  const rawValue = String(value || "")
    .trim()
    .toLowerCase()
    .replaceAll("_", "-")
    .replaceAll(" ", "-");

  if (rawValue === "easy") return "new-hire";
  if (rawValue === "medium") return "intermediate";
  if (rawValue === "hard") return "expert";
  if (rawValue === "newhire") return "new-hire";
  if (rawValue === "new-hire") return "new-hire";
  if (rawValue === "intermediate") return "intermediate";
  if (rawValue === "expert") return "expert";

  return "intermediate";
}

function normalizeTopic(value) {
  const rawValue = String(value || "")
    .trim()
    .toLowerCase()
    .replaceAll("_", "-")
    .replaceAll(" ", "-");

  if (
    rawValue === "descartes" ||
    rawValue === "route-planner" ||
    rawValue === "descartes-route-planner" ||
    rawValue === "descartes-routeplanner" ||
    rawValue === "drp" ||
    rawValue === "rp"
  ) {
    return "descartes-route-planner";
  }

  if (rawValue === "sous") return "sous";
  if (rawValue === "tandem") return "tandem";
  if (rawValue === "omnitrax" || rawValue === "omni-trax") return "omnitrax";

  return "descartes-route-planner";
}

function getDifficulty(item) {
  return (
    item.difficulty ??
    item.Difficulty ??
    item.difficultyLevel ??
    item.DifficultyLevel
  );
}

function getTopic(item) {
  return (
    item.topic ??
    item.Topic ??
    item.trainingMaterial ??
    item.TrainingMaterial
  );
}

function prepareItems(items = []) {
  return items.map((item) => ({
    ...item,
    difficulty: normalizeDifficulty(getDifficulty(item)),
    topic: normalizeTopic(getTopic(item)),
  }));
}

function toTsExport(typeDefs, exportName, data, typeName) {
  return `${typeDefs}

export const ${exportName}: ${typeName}[] = ${JSON.stringify(data, null, 2)};\n`;
}

const sharedTypes = `export type TrainingDifficulty = "new-hire" | "intermediate" | "expert";

export type TrainingTopic =
  | "descartes-route-planner"
  | "sous"
  | "tandem"
  | "omnitrax";`;

const quizTypes = `${sharedTypes}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: TrainingDifficulty;
  points: number;
  topic: TrainingTopic;
}`;

const scenarioTypes = `export type OutcomeLevel = "good" | "ok" | "bad";

${sharedTypes}

export interface Choice {
  text: string;
  outcome: OutcomeLevel;
  explanation: string;
  points: number;
}

export interface Scenario {
  id: number;
  title: string;
  situation: string;
  choices: Choice[];
  difficulty: TrainingDifficulty;
  topic: TrainingTopic;
}`;

const dataChallengeTypes = `${sharedTypes}

export interface RouteEntry {
  id: number;
  prefix: string;
  nextHop: string;
  metric: string;
  protocol: string;
  age: string;
  flags: string;
  issue?: string;
  hasIssue: boolean;
}

export interface DataChallenge {
  id: number;
  title: string;
  description: string;
  hint: string;
  routingTable: RouteEntry[];
  correctIssueIds: number[];
  explanation: string;
  difficulty: TrainingDifficulty;
  topic: TrainingTopic;
}`;

const routeRunnerTypes = `${sharedTypes}

export interface RouteRunnerQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: TrainingDifficulty;
  points: number;
  topic: TrainingTopic;
}`;

writeFile(
  "quizData.ts",
  toTsExport(quizTypes, "quizQuestions", prepareItems(content.quiz), "QuizQuestion")
);

writeFile(
  "scenarioData.ts",
  toTsExport(scenarioTypes, "scenarios", prepareItems(content.scenarios), "Scenario")
);

writeFile(
  "dataChallenge.ts",
  toTsExport(
    dataChallengeTypes,
    "dataChallenges",
    prepareItems(content.dataChallenges),
    "DataChallenge"
  )
);

writeFile(
  "routeRunnerData.ts",
  toTsExport(
    routeRunnerTypes,
    "routeRunnerQuestions",
    prepareItems(content.routeRunner),
    "RouteRunnerQuestion"
  )
);

console.log("All game data files generated successfully.");
