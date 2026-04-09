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
    "question": "Which five schedules should users add to Favorites to begin routing?",
    "options": [
      "Planning, Dispatch, Review, and Archive",
      "Planning, Publish, Route, and Archive",
      "Planning, Dashboard, Review, and Trash",
      "Review, Dispatch, Audit, and Archive"
    ],
    "correctIndex": 0,
    "explanation": "The QRG says users should add their market’s Planning, Dispatch, Review, and Archive schedules to Favorites before routing.",
    "difficulty": "easy",
    "points": 100
  },
  {
    "id": 2,
    "question": "What is the Planning schedule primarily used for?",
    "options": [
      "Viewing completed routes only",
      "Monitoring live published routes only",
      "Visibility to future-dated orders and routes before final review",
      "Deleting routes from the system"
    ],
    "correctIndex": 2,
    "explanation": "The QRG describes Planning as the schedule that provides visibility to future orders and routes that have not yet been fully managed by a router.",
    "difficulty": "easy",
    "points": 100
  },
  {
    "id": 3,
    "question": "What should a router do before removing a route from a schedule?",
    "options": [
      "Publish it first",
      "Freeze it and move it to Dispatch",
      "Unassign all stops from the route",
      "Clone the driver assigned to it"
    ],
    "correctIndex": 2,
    "explanation": "The QRG says to use caution when removing routes and to unassign all stops before reassigning the route to Trash.",
    "difficulty": "easy",
    "points": 100
  },
  {
    "id": 4,
    "question": "How are unassigned stops shown on the map?",
    "options": [
      "A red diamond",
      "A yellow route line",
      "A U marker",
      "A stop number 0"
    ],
    "correctIndex": 2,
    "explanation": "The QRG states that unassigned stops can be shown on the map and are marked with a 'U'.",
    "difficulty": "easy",
    "points": 100
  },
  {
    "id": 5,
    "question": "After cut is taken and before finalizing routes in Review, how long should routers wait for BGO to complete?",
    "options": [
      "5 minutes",
      "10 minutes",
      "15 minutes",
      "30 minutes"
    ],
    "correctIndex": 2,
    "explanation": "The QRG instructs routers to wait 15 minutes after cut is taken for BGO to complete before manually moving routes and stops to Review.",
    "difficulty": "medium",
    "points": 150
  },
  {
    "id": 6,
    "question": "If a stop cannot ship on the current delivery day, what should happen to it?",
    "options": [
      "Leave it in Review until the next day",
      "Move it to Archive",
      "Add it to a 999 route and publish it",
      "Delete the order and recreate it later"
    ],
    "correctIndex": 2,
    "explanation": "The QRG says all unassigned stops must either be assigned to a route and published, or—if they are not shipping on the current delivery day—added to a 999 route and published.",
    "difficulty": "medium",
    "points": 150
  },
  {
    "id": 7,
    "question": "What is the recommended action if a route will not publish and some orders remain in status 20?",
    "options": [
      "Ignore it and publish again later",
      "Check the Route Detail quadrant because orders stuck in status 20 can prevent publishing",
      "Move the route back to Archive",
      "Deactivate the driver and retry"
    ],
    "correctIndex": 1,
    "explanation": "The QRG notes that if a route will not publish, you should check Route Detail 1 to see whether any orders are still in status 20, which can block publishing.",
    "difficulty": "medium",
    "points": 150
  },
  {
    "id": 8,
    "question": "What indicates that the first publish to Tandem was successful?",
    "options": [
      "A green diamond appears immediately",
      "A red diamond appears on the route",
      "A yellow diamond appears and Tandem Route Status confirms success",
      "The route moves automatically to Archive"
    ],
    "correctIndex": 2,
    "explanation": "The QRG explains that the first publish sends routes to Tandem and a yellow diamond appears when the send to Tandem is successful.",
    "difficulty": "medium",
    "points": 150
  },
  {
    "id": 9,
    "question": "What should appear after a successful publish to Omni?",
    "options": [
      "A blue square",
      "A green diamond",
      "A yellow triangle",
      "A gray circle"
    ],
    "correctIndex": 1,
    "explanation": "The QRG says a green diamond signifies the publish to Omni was successful.",
    "difficulty": "medium",
    "points": 150
  },
  {
    "id": 10,
    "question": "Where should routers maintain customer route and sequence locks?",
    "options": [
      "Only in Route Planner route details",
      "In Omni equipment settings",
      "In SOUS Routing Attributes",
      "In the public filter menu"
    ],
    "correctIndex": 2,
    "explanation": "The QRG states that locking a customer to a route or sequence is maintained in SOUS via Routing Attributes, not directly in Route Planner.",
    "difficulty": "hard",
    "points": 200
  },
  {
    "id": 11,
    "question": "What does a Preferred Route Position of 50 generally indicate?",
    "options": [
      "The customer must be the first stop",
      "The customer is dynamic within the route sequence",
      "The order is published to Dispatch",
      "The stop is a backhaul pickup only"
    ],
    "correctIndex": 1,
    "explanation": "The QRG explains that a '50' Preferred Route Position means the customer is dynamic and can move within a route sequence, while still respecting lower sequence locks.",
    "difficulty": "hard",
    "points": 200
  },
  {
    "id": 12,
    "question": "Where can you track detailed user and system updates to orders and routes in Route Planner?",
    "options": [
      "Summary Reports",
      "Data > API Tracking > API Tracking",
      "App Setup > UI Settings",
      "Data > Templates > Route"
    ],
    "correctIndex": 1,
    "explanation": "The QRG says API Tracking is found under Data > API Tracking > API Tracking and is used to review detailed history of system and user updates.",
    "difficulty": "hard",
    "points": 200
  }
];
