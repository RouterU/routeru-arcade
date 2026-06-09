export type TrainingDifficulty = "new-hire" | "intermediate" | "expert";

export type TrainingTopic =
  | "descartes-route-planner"
  | "sous"
  | "tandem"
  | "omnitrax";

export interface RouteRunnerQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: TrainingDifficulty;
  points: number;
  topic: TrainingTopic;
}

export const routeRunnerQuestions: RouteRunnerQuestion[] = [
  {
    "id": 1,
    "question": "A route is showing unassigned stops marked with 'U' before publish. What should happen first?",
    "options": [
      "Publish anyway and fix later",
      "Assign the stops to a valid route or place non-shipping stops on a 999 route",
      "Archive the stops",
      "Delete the stops from the schedule"
    ],
    "correctIndex": 1,
    "explanation": "All stops must be accounted for before publish. Non-shipping stops should be placed on a 999 route.",
    "difficulty": "new-hire",
    "points": 100,
    "topic": "descartes-route-planner"
  },
  {
    "id": 2,
    "question": "A yellow diamond appears after publish. What does it indicate?",
    "options": [
      "Publish failed",
      "Route is locked",
      "Successful send to Tandem",
      "Successful publish to Omni"
    ],
    "correctIndex": 2,
    "explanation": "A yellow diamond indicates the route was successfully sent to Tandem.",
    "difficulty": "intermediate",
    "points": 150,
    "topic": "descartes-route-planner"
  },
  {
    "id": 3,
    "question": "Where should route and sequence locks be maintained long-term?",
    "options": [
      "Route Planner map settings",
      "SOUS Routing Attributes",
      "Driver profile notes",
      "Dispatch comments"
    ],
    "correctIndex": 1,
    "explanation": "Persistent route and sequence locks are maintained in SOUS Routing Attributes.",
    "difficulty": "new-hire",
    "points": 200,
    "topic": "sous"
  },
  {
    "id": 4,
    "question": "A route will not publish and some orders remain in status 20. What should you check?",
    "options": [
      "Route Detail for blocked orders",
      "Archive schedule",
      "Driver meal break settings",
      "Map zoom level"
    ],
    "correctIndex": 0,
    "explanation": "Orders stuck in status 20 can block publishing and should be reviewed in Route Detail.",
    "difficulty": "intermediate",
    "points": 150,
    "topic": "descartes-route-planner"
  },
  {
    "id": 5,
    "question": "After cut is taken, how long should routers generally wait for BGO to complete before moving routes and stops?",
    "options": [
      "5 minutes",
      "10 minutes",
      "15 minutes",
      "30 minutes"
    ],
    "correctIndex": 2,
    "explanation": "Routers should generally wait about 15 minutes after cut for BGO processing to complete.",
    "difficulty": "new-hire",
    "points": 100,
    "topic": "descartes-route-planner"
  },
  {
    "id": 6,
    "question": "A route is under minimum before publish. What is the best action?",
    "options": [
      "Ignore it",
      "Review it for consolidation or operational need before publishing",
      "Move it to Archive immediately",
      "Publish it no matter what"
    ],
    "correctIndex": 1,
    "explanation": "Under-minimum routes should be reviewed before publish to determine whether they should be consolidated or adjusted.",
    "difficulty": "intermediate",
    "points": 150,
    "topic": "descartes-route-planner"
  },
  {
    "id": 7,
    "question": "A published route has a green diamond next to it but not a yellow diamond. What could cause this?",
    "options": [
      "There must be an error",
      "Did not publish twice",
      "It is a logistical route with no customer stops",
      "The equipment assignment"
    ],
    "correctIndex": 3,
    "explanation": "Logistical routes with only depot or layover stops and without customer stops do not send to Tandem.",
    "difficulty": "intermediate",
    "points": 150,
    "topic": "descartes-route-planner"
  },
  {
    "id": 8,
    "question": "What should you do before allowing BGO to rebuild a completely new solution?",
    "options": [
      "Unassign all stops from routes",
      "Delete territories",
      "Archive schedules",
      "Export WinRoute files"
    ],
    "correctIndex": 0,
    "explanation": "Stops must be unassigned before dynamic optimization testing.",
    "difficulty": "intermediate",
    "points": 150,
    "topic": "descartes-route-planner"
  },
  {
    "id": 9,
    "question": "Which routing parameter is best aligned to dense city routing?",
    "options": [
      "Metro-Default",
      "Rural-Default",
      "Standard-Default",
      "Legacy-Default"
    ],
    "correctIndex": 0,
    "explanation": "Metro-Default is intended for more urban or dense routing behavior.",
    "difficulty": "intermediate",
    "points": 150,
    "topic": "descartes-route-planner"
  },
  {
    "id": 10,
    "question": "What is the purpose of the Edit Resource option?",
    "options": [
      "Adjust route-level settings like start time and territory",
      "Delete drivers",
      "Export manifests",
      "Change SOUS passwords"
    ],
    "correctIndex": 0,
    "explanation": "Edit Resource allows route-level adjustments such as start time, depot, equipment, requirements, and territory.",
    "difficulty": "new-hire",
    "points": 100,
    "topic": "descartes-route-planner"
  },
  {
    "id": 11,
    "question": "What does the Active column show when a territory is disabled?",
    "options": [
      "False",
      "Null",
      "Archived",
      "Hidden"
    ],
    "correctIndex": 0,
    "explanation": "Deactivated territories display False in the Active column.",
    "difficulty": "expert",
    "points": 100,
    "topic": "descartes-route-planner"
  },
  {
    "id": 12,
    "question": "What should be verified in Manhattan for new XDI customers?",
    "options": [
      "Location ID exists",
      "Driver payroll",
      "Trailer length",
      "Fuel tax code"
    ],
    "correctIndex": 0,
    "explanation": "If the location ID does not exist for XDI setup, a Helpdesk ticket may be required.",
    "difficulty": "expert",
    "points": 200,
    "topic": "descartes-route-planner"
  },
  {
    "id": 13,
    "question": "Why should routing settings changes be made gradually during project testing?",
    "options": [
      "Easier troubleshooting and validation",
      "Faster exports",
      "Better graphics",
      "Fewer schedules"
    ],
    "correctIndex": 0,
    "explanation": "Small, controlled changes help isolate what improved or hurt the routing solution.",
    "difficulty": "intermediate",
    "points": 150,
    "topic": "descartes-route-planner"
  }
];
