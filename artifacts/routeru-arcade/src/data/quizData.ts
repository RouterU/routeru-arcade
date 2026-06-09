export type TrainingDifficulty = "new-hire" | "intermediate" | "expert";

export type TrainingTopic =
  | "descartes-route-planner"
  | "sous"
  | "tandem"
  | "omnitrax";

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: TrainingDifficulty;
  points: number;
  topic: TrainingTopic;
}

export const quizQuestions: QuizQuestion[] = [
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
    "difficulty": "intermediate",
    "points": 100,
    "topic": "descartes-route-planner"
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
    "difficulty": "intermediate",
    "points": 100,
    "topic": "descartes-route-planner"
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
    "difficulty": "intermediate",
    "points": 100,
    "topic": "descartes-route-planner"
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
    "difficulty": "intermediate",
    "points": 100,
    "topic": "descartes-route-planner"
  },
  {
    "id": 5,
    "question": "What does the blue star icon mean?",
    "options": [
      "Will call delivery (WCD)",
      "Backhaul or pickup",
      "Missing SOUS setup (DV)",
      "Cross dock (XDB)"
    ],
    "correctIndex": 0,
    "explanation": "The blue star icon in Route Planner signifies a will call delivery (WCD).",
    "difficulty": "intermediate",
    "points": 100,
    "topic": "descartes-route-planner"
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
    "difficulty": "intermediate",
    "points": 150,
    "topic": "descartes-route-planner"
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
    "difficulty": "intermediate",
    "points": 150,
    "topic": "descartes-route-planner"
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
    "difficulty": "intermediate",
    "points": 150,
    "topic": "descartes-route-planner"
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
    "difficulty": "intermediate",
    "points": 150,
    "topic": "descartes-route-planner"
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
    "difficulty": "intermediate",
    "points": 150,
    "topic": "descartes-route-planner"
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
    "difficulty": "expert",
    "points": 200,
    "topic": "descartes-route-planner"
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
    "difficulty": "expert",
    "points": 200,
    "topic": "descartes-route-planner"
  },
  {
    "id": 13,
    "question": "A customer would like to be set up as a Will Call Delivery only account. Which of the following is the correct process?",
    "options": [
      "Delete all routing attributes",
      "Delete all attributes except for Sunday",
      "Keep one day of the week that is not Sunday selected as a delivery day",
      "Make a note in the special instructions"
    ],
    "correctIndex": 2,
    "explanation": "Keeping one day of the week as a delivery day will allow the customer to place orders for Will Call Delivery",
    "difficulty": "intermediate",
    "points": 150,
    "topic": "sous"
  },
  {
    "id": 14,
    "question": "Which four schedules should be added to Favorites when setting up Route Planner?",
    "options": [
      "Planning, Dispatch, Review, Archive",
      "Planning, Build, Ship, Close",
      "Active, Review, Audit, Export",
      "Planning only"
    ],
    "correctIndex": 0,
    "explanation": "Routers should favorite Planning, Dispatch, Review, and Archive schedules for daily routing.",
    "difficulty": "new-hire",
    "points": 100,
    "topic": "descartes-route-planner"
  },
  {
    "id": 15,
    "question": "Where do users go to add Route Planner schedules to Favorites?",
    "options": [
      "Data > Schedule Data > Schedules",
      "Setup > Resources",
      "Tools > Routing",
      "Help > Contents"
    ],
    "correctIndex": 0,
    "explanation": "Favorite schedules are added under Data > Schedule Data > Schedules.",
    "difficulty": "new-hire",
    "points": 100,
    "topic": "descartes-route-planner"
  },
  {
    "id": 16,
    "question": "What does a 'Preferred Resource' mean?",
    "options": [
      "Tier 1 stop",
      "First customer to depot",
      "Starting route",
      "The preferred route that the customer should be on"
    ],
    "correctIndex": 3,
    "explanation": "Territory boundaries must fully connect to activate correctly.",
    "difficulty": "intermediate",
    "points": 150,
    "topic": "descartes-route-planner"
  },
  {
    "id": 17,
    "question": "Which field cannot be changed after creating a territory?",
    "options": [
      "Territory Key",
      "Color Code",
      "Requirements",
      "Description"
    ],
    "correctIndex": 0,
    "explanation": "Territory Keys cannot contain spaces and cannot be edited later.",
    "difficulty": "intermediate",
    "points": 150,
    "topic": "descartes-route-planner"
  },
  {
    "id": 18,
    "question": "Which SOUS section is used to update Variable and Fixed Service Times?",
    "options": [
      "Market Specifics",
      "Routing Toolkit",
      "Delivery Groups",
      "WinRoute"
    ],
    "correctIndex": 0,
    "explanation": "Service times are maintained in SOUS Market Specifics.",
    "difficulty": "intermediate",
    "points": 150,
    "topic": "sous"
  },
  {
    "id": 19,
    "question": "What should you check first if an order did not assign to a route you feel it should have?",
    "options": [
      "BGO",
      "Matching Requirements",
      "Tandem",
      "Google"
    ],
    "correctIndex": 1,
    "explanation": "Expired license information can prevent the driver from being assigned to a route.",
    "difficulty": "intermediate",
    "points": 150,
    "topic": "descartes-route-planner"
  },
  {
    "id": 20,
    "question": "What does a 'Preferred Route Position' mean?",
    "options": [
      "Time windows and delivery day",
      "Trailer dimensions",
      "The preferred stop number on a route",
      "Delivery Group"
    ],
    "correctIndex": 2,
    "explanation": "Edit Order allows date and time window adjustments. If moving the day, requirements should also be updated.",
    "difficulty": "new-hire",
    "points": 100,
    "topic": "descartes-route-planner"
  },
  {
    "id": 21,
    "question": "What should routers avoid when adjusting project schedule settings?",
    "options": [
      "Changing too many settings at once",
      "Using BGO",
      "Saving schedules",
      "Editing territories"
    ],
    "correctIndex": 0,
    "explanation": "Too many simultaneous changes make it difficult to determine which setting is helping or hurting the solution.",
    "difficulty": "intermediate",
    "points": 150,
    "topic": "descartes-route-planner"
  },
  {
    "id": 22,
    "question": "Which routing parameters are considered the default standards?",
    "options": [
      "Standard-Default, Rural-Default, Metro-Default",
      "Urban, Rural, Hybrid",
      "Fast, Medium, Slow",
      "Default A, B, C"
    ],
    "correctIndex": 0,
    "explanation": "The guide identifies Standard-Default, Rural-Default, and Metro-Default as the default routing parameter groups.",
    "difficulty": "expert",
    "points": 200,
    "topic": "descartes-route-planner"
  },
  {
    "id": 23,
    "question": "What must be done before uploading Orders-Clients data into WinRoute?",
    "options": [
      "Upload Depots and Vehicles-Drivers first",
      "Run BGO",
      "Delete territories",
      "Export archive schedules"
    ],
    "correctIndex": 0,
    "explanation": "Depots and Vehicles-Drivers data must be filled out and uploaded before the Orders-Clients upload.",
    "difficulty": "intermediate",
    "points": 150,
    "topic": "descartes-route-planner"
  },
  {
    "id": 24,
    "question": "Which browser is recommended for accessing Route Planner?",
    "options": [
      "Firefox",
      "Edge",
      "Safari",
      "Chrome"
    ],
    "correctIndex": 3,
    "explanation": "Google Chrome is the recommended browser for Route Planner",
    "difficulty": "new-hire",
    "points": 100,
    "topic": "descartes-route-planner"
  },
  {
    "id": 25,
    "question": "What does a \"U\" on the map indicate?",
    "options": [
      "Urgent stop",
      "Unassigned stop",
      "Unpublished route",
      "Updates available"
    ],
    "correctIndex": 1,
    "explanation": "The \"U\" on the map indicates an unassigned stop that does not belong to a route.",
    "difficulty": "new-hire",
    "points": 100,
    "topic": "descartes-route-planner"
  },
  {
    "id": 26,
    "question": "What should be done prior to archiving a resource that will not be used?",
    "options": [
      "Freeze the route",
      "Publish the route",
      "Unassign all stops from the route",
      "Nothing"
    ],
    "correctIndex": 2,
    "explanation": "Unassigning all stops from a route prior to moving the resource to archive will avoid missing customer orders",
    "difficulty": "intermediate",
    "points": 150,
    "topic": "descartes-route-planner"
  },
  {
    "id": 27,
    "question": "Which route position represents a dynamic customer stop?",
    "options": [
      "1",
      "25",
      "50",
      "100"
    ],
    "correctIndex": 2,
    "explanation": "A \"50\" in preferred route position signals the customer is dynamic and can fall within any order on a route as long as the time window is met",
    "difficulty": "new-hire",
    "points": 100,
    "topic": "descartes-route-planner"
  }
];
