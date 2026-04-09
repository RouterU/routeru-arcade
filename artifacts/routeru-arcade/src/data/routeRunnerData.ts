export interface RouteRunnerQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  points: number;
}

export const routeRunnerQuestions = [
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
    "difficulty": "easy",
    "points": 100
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
    "difficulty": "medium",
    "points": 150
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
    "difficulty": "hard",
    "points": 200
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
    "difficulty": "medium",
    "points": 150
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
    "difficulty": "easy",
    "points": 100
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
    "difficulty": "medium",
    "points": 150
  }
];
