import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// content-updates folder
const contentDir = __dirname;

// artifacts/routeru-arcade folder
const baseDir = path.resolve(contentDir, "..");

// src/data folder
const dataDir = path.join(baseDir, "src", "data");
const templatePath = path.join(contentDir, "master-template.json");

const raw = fs.readFileSync(templatePath, "utf8");
const content = JSON.parse(raw);

function writeFile(fileName, fileContent) {
  const fullPath = path.join(dataDir, fileName);
  fs.writeFileSync(fullPath, fileContent, "utf8");
  console.log(`Updated ${fileName}`);
}

function toTsExport(typeDefs, exportName, data) {
  return `${typeDefs}

export const ${exportName} = ${JSON.stringify(data, null, 2)};\n`;
}

const quizTypes = `export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  points: number;
}`;

const scenarioTypes = `export type OutcomeLevel = "good" | "ok" | "bad";

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
}`;

const dataChallengeTypes = `export interface RouteEntry {
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
}`;

const routeRunnerTypes = `export interface RouteRunnerQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  points: number;
}`;

writeFile(
  "quizData.ts",
  toTsExport(quizTypes, "quizQuestions", content.quiz)
);

writeFile(
  "scenarioData.ts",
  toTsExport(scenarioTypes, "scenarios", content.scenarios)
);

writeFile(
  "dataChallenge.ts",
  toTsExport(dataChallengeTypes, "dataChallenges", content.dataChallenges)
);

writeFile(
  "routeRunnerData.ts",
  toTsExport(routeRunnerTypes, "routeRunnerQuestions", content.routeRunner)
);

console.log("All game data files generated successfully.");
