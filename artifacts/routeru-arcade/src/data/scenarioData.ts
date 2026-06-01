export type OutcomeLevel = "good" | "ok" | "bad";

export type TrainingDifficulty = "new-hire" | "intermediate" | "expert";

export type TrainingTopic =
  | "descartes-route-planner"
  | "sous"
  | "tandem"
  | "omnitrax";

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
}

export const scenarios: Scenario[] = [
  {
    id: 1,
    title: "Special Instructions Update",
    situation:
      "You need to update special instructions for an account, but you do not want to open each daily attribute one by one. What should you do?",
    choices: [
      {
        text: "Submit a router update",
        outcome: "good",
        explanation:
          "The SOUS source indicates the right path is a router update.",
        points: 300,
      },
      {
        text: "Edit every daily attribute manually",
        outcome: "ok",
        explanation:
          "This could work, but it is not the recommended answer from the source.",
        points: 100,
      },
      {
        text: "Delete and recreate the routing attributes",
        outcome: "bad",
        explanation:
          "Recreating attributes is unnecessary and risky for this type of request.",
        points: 0,
      },
    ],
    difficulty: "new-hire",
    topic: "sous",
  },

  {
    id: 2,
    title: "Bill-To-Ship-To Policy Check",
    situation:
      "A seller wants to Bill-To-Ship-To to a pronto customer for a non-pronto customer. What is the best response?",
    choices: [
      {
        text: "Assume it is always allowed",
        outcome: "bad",
        explanation: "The source does not say this is always allowed.",
        points: 0,
      },
      {
        text: "Check with local sales leadership to confirm policy",
        outcome: "good",
        explanation:
          "The SOUS source says to check with local sales leadership to see what their policy is.",
        points: 300,
      },
      {
        text: "Let the driver decide at dispatch",
        outcome: "bad",
        explanation:
          "This should be resolved through policy, not left to dispatch improvisation.",
        points: 0,
      },
    ],
    difficulty: "intermediate",
    topic: "sous",
  },

  {
    id: 3,
    title: "Tandem Date Looks Wrong",
    situation:
      "An order for today in Tandem is showing tomorrow in Route Planner. What should you check first?",
    choices: [
      {
        text: "Republish the route and ignore SOUS",
        outcome: "bad",
        explanation:
          "Republishing does not address the attribute driving the date.",
        points: 0,
      },
      {
        text: "Check the customer's Days to Delivery in SOUS",
        outcome: "good",
        explanation:
          "The SOUS source says to double check Days to Delivery. 0 = today, 1 = next day, and so on.",
        points: 300,
      },
      {
        text: "Change the order date in Tandem only",
        outcome: "ok",
        explanation:
          "Tandem may not be the source of truth for routing attributes during order flow.",
        points: 100,
      },
    ],
    difficulty: "intermediate",
    topic: "tandem",
  },

  {
    id: 4,
    title: "Adding Delivery Photos",
    situation:
      "A customer wants pictures added to delivery instructions in SOUS. What should you do?",
    choices: [
      {
        text:
          "Add them in the Delivery Photos section under the related tab and drag-and-drop the files",
        outcome: "good",
        explanation:
          "The SOUS source directs users to the Delivery Photos section underneath the routing attributes.",
        points: 300,
      },
      {
        text: "Paste the image into order comments",
        outcome: "bad",
        explanation:
          "The source points to Delivery Photos, not comments.",
        points: 0,
      },
      {
        text: "Upload the images to the driver manifest screen",
        outcome: "bad",
        explanation:
          "That location is not the source-recommended place for delivery photos in SOUS.",
        points: 0,
      },
    ],
    difficulty: "new-hire",
    topic: "sous",
  },

  {
    id: 5,
    title: "Route Locking Confusion",
    situation:
      "A user attempts to lock a customer’s route directly in Route Planner, but it does not persist. Why?",
    choices: [
      {
        text: "Route Planner does not allow locking",
        outcome: "bad",
        explanation:
          "Route Planner supports routing, but lock persistence is handled elsewhere.",
        points: 0,
      },
      {
        text: "Locks must be maintained in SOUS Routing Attributes",
        outcome: "good",
        explanation:
          "The QRG specifies that route and sequence locks are managed in SOUS, not directly in Route Planner.",
        points: 300,
      },
      {
        text: "The route must be published first",
        outcome: "ok",
        explanation:
          "Publishing does not control lock persistence.",
        points: 100,
      },
    ],
    difficulty: "expert",
    topic: "sous",
  },
];
