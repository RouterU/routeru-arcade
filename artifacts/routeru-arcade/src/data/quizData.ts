export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  points: number;
}

export const quizQuestions = [
  {
    "id": 1,
    "question": "What does the gray circle icon mean?",
    "options": [
      "DG_1 customer with no liftgate requirement",
      "DG_1 customer with a liftgate requirement",
      "Published route sent to Tandem with no errors",
      "Shuttle stop or route"
    ],
    "correctIndex": 0,
    "explanation": "The gray circle icon in Route Planner signifies a DG_1 customer with no liftgate requirement.",
    "difficulty": "easy",
    "points": 100
  },
  {
    "id": 2,
    "question": "What does the blue triangle icon mean?",
    "options": [
      "DG_2 customer with no liftgate requirement",
      "DG_2 customer with a liftgate requirement",
      "Cross dock (XDA)",
      "Status 20 order"
    ],
    "correctIndex": 1,
    "explanation": "The blue triangle icon in Route Planner signifies a DG_2 customer with a liftgate requirement.",
    "difficulty": "easy",
    "points": 100
  },
  {
    "id": 3,
    "question": "What does the black square icon mean?",
    "options": [
      "Key drop or dark delivery",
      "Shuttle stop or route",
      "Off day order",
      "Child account"
    ],
    "correctIndex": 0,
    "explanation": "The black square icon in Route Planner signifies a key drop or dark delivery.",
    "difficulty": "easy",
    "points": 100
  },
  {
    "id": 4,
    "question": "What does the green square icon mean?",
    "options": [
      "Published route sent to Omnitracs with no errors",
      "Child account",
      "Layover order",
      "Backhaul or pickup"
    ],
    "correctIndex": 1,
    "explanation": "The green square icon in Route Planner signifies a child account.",
    "difficulty": "easy",
    "points": 100
  },
  {
    "id": 5,
    "question": "What does the blue star icon mean?",
    "options": [
      "Recovery Express",
      "Backhaul or pickup",
      "Missing SOUS setup (DV)",
      "Cross dock (XDB)"
    ],
    "correctIndex": 0,
    "explanation": "The blue star icon in Route Planner signifies a Recovery Express.",
    "difficulty": "easy",
    "points": 100
  },
  {
    "id": 6,
    "question": "What does the dark red or maroon star icon mean?",
    "options": [
      "Layover order",
      "Status 30 or 40 order",
      "Backhaul or pickup",
      "Bill-to-ship-to customer"
    ],
    "correctIndex": 2,
    "explanation": "The dark red or maroon star icon in Route Planner signifies a backhaul/pickup.",
    "difficulty": "medium",
    "points": 150
  },
  {
    "id": 7,
    "question": "What does the red star icon mean?",
    "options": [
      "Stop is missing SOUS setup (DV)",
      "Stop is on an off day order",
      "Customer has a liftgate requirement",
      "Route is already archived"
    ],
    "correctIndex": 0,
    "explanation": "The red star icon in Route Planner signifies a stop is missing SOUS setup (DV).",
    "difficulty": "medium",
    "points": 150
  },
  {
    "id": 8,
    "question": "What does the yellow diamond icon mean?",
    "options": [
      "Published route sent to Omnitracs with no errors",
      "Status 20 order",
      "Published route sent to Tandem with no errors",
      "HazMat stop or route over 999 lbs"
    ],
    "correctIndex": 2,
    "explanation": "The yellow diamond icon in Route Planner signifies a published route that was sent to Tandem with no errors.",
    "difficulty": "medium",
    "points": 150
  },
  {
    "id": 9,
    "question": "What does the green diamond icon mean?",
    "options": [
      "Published route sent to Omnitracs with no errors",
      "Published route sent to Tandem with no errors",
      "Key drop or dark delivery",
      "Status 30 or 40 order"
    ],
    "correctIndex": 0,
    "explanation": "The green diamond icon in Route Planner signifies a published route that was sent to Omnitracs with no errors.",
    "difficulty": "medium",
    "points": 150
  },
  {
    "id": 10,
    "question": "What does a red hexagon icon mean?",
    "options": [
      "Status 30 or 40 order",
      "HazMat stop or route over 999 lbs",
      "Status 20 order",
      "Backhaul or pickup"
    ],
    "correctIndex": 2,
    "explanation": "A red hexagon icon in Route Planner signifies a status 20 order.",
    "difficulty": "medium",
    "points": 150
  },
  {
    "id": 11,
    "question": "How can you add options when you right-click on a route, such as printing driver manifests?",
    "options": [
      "Use Data > Templates > Routes",
      "Go to App Setup > UI Setting > Context Menu and edit the Routes quadrant",
      "Republish the route after cut is taken",
      "Enable the option from the driver profile"
    ],
    "correctIndex": 1,
    "explanation": "On the side menu, go to App Setup > UI Setting > Context Menu and select the quadrant you want to edit. The Routes quadrant is where you can add the option to print a driver manifest.",
    "difficulty": "hard",
    "points": 200
  },
  {
    "id": 12,
    "question": "Routes are not being optimized by BGO. What should you check first?",
    "options": [
      "Whether the route is already published to Omnitracs",
      "Whether there is an 'X' in UDFString 4 and whether 'Exclude From Optimization' is checked in the resource",
      "Whether the route is marked as a key drop",
      "Whether the driver has a delivery photo attached"
    ],
    "correctIndex": 1,
    "explanation": "Before assuming it is a BGO issue, make sure there is not an 'X' in UDFString 4 and check whether 'Exclude From Optimization' is checked inside the resource.",
    "difficulty": "hard",
    "points": 200
  }
];
