export type OutcomeLevel = "good" | "ok" | "bad";

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
}

export const scenarios = [
  {
    "id": 1,
    "title": "Unassigned Stops Before Publish",
    "situation": "You are preparing to publish routes, but you notice several stops still showing as unassigned (marked with 'U'). What should you do?",
    "choices": [
      {
        "text": "Ignore them and publish the routes anyway",
        "outcome": "bad",
        "explanation": "All stops must be accounted for before publishing. Leaving unassigned stops will create service failures.",
        "points": 0
      },
      {
        "text": "Assign all stops to routes, or if they are not shipping today, move them to a 999 route and publish",
        "outcome": "good",
        "explanation": "The QRG requires all stops to be either routed or placed on a 999 route if not shipping for the day.",
        "points": 300
      },
      {
        "text": "Move them to Archive",
        "outcome": "bad",
        "explanation": "Archive is for completed routes, not unassigned stops.",
        "points": 0
      }
    ]
  },
  {
    "id": 2,
    "title": "Route Will Not Publish",
    "situation": "A route is failing to publish. You retry multiple times but it still fails. What is your next step?",
    "choices": [
      {
        "text": "Keep retrying until it works",
        "outcome": "bad",
        "explanation": "Retrying without diagnosing wastes time and does not fix the root issue.",
        "points": 0
      },
      {
        "text": "Check Route Detail to see if any orders are stuck in status 20",
        "outcome": "good",
        "explanation": "Orders stuck in status 20 can block publishing and must be resolved before the route will publish.",
        "points": 300
      },
      {
        "text": "Move the route back to Planning",
        "outcome": "ok",
        "explanation": "This may help reset the route, but does not directly address the root cause.",
        "points": 100
      }
    ]
  },
  {
    "id": 3,
    "title": "Cut Complete - What Next?",
    "situation": "Cut has just been taken and routes are starting to populate. What should you do before moving routes into Review?",
    "choices": [
      {
        "text": "Immediately move everything to Review",
        "outcome": "bad",
        "explanation": "Moving too early can result in incomplete or inaccurate routing.",
        "points": 0
      },
      {
        "text": "Wait approximately 15 minutes for BGO to complete before moving routes and stops",
        "outcome": "good",
        "explanation": "The QRG states you should wait 15 minutes after cut for BGO processing before finalizing routes.",
        "points": 300
      },
      {
        "text": "Only move routes with drivers assigned",
        "outcome": "ok",
        "explanation": "While partially correct, this does not address the need to wait for BGO completion.",
        "points": 100
      }
    ]
  },
  {
    "id": 4,
    "title": "Publishing Status Check",
    "situation": "You publish a route and see a yellow diamond appear. What does this mean?",
    "choices": [
      {
        "text": "The route failed to publish",
        "outcome": "bad",
        "explanation": "Yellow does not indicate failure.",
        "points": 0
      },
      {
        "text": "The route was successfully sent to Tandem",
        "outcome": "good",
        "explanation": "A yellow diamond indicates a successful send to Tandem.",
        "points": 300
      },
      {
        "text": "The route is locked",
        "outcome": "bad",
        "explanation": "Locks are unrelated to publish indicators.",
        "points": 0
      }
    ]
  },
  {
    "id": 5,
    "title": "Route Locking Confusion",
    "situation": "A user attempts to lock a customer’s route directly in Route Planner, but it does not persist. Why?",
    "choices": [
      {
        "text": "Route Planner does not allow locking",
        "outcome": "bad",
        "explanation": "Route Planner supports routing, but lock persistence is handled elsewhere.",
        "points": 0
      },
      {
        "text": "Locks must be maintained in SOUS Routing Attributes",
        "outcome": "good",
        "explanation": "The QRG specifies that route and sequence locks are managed in SOUS, not directly in Route Planner.",
        "points": 300
      },
      {
        "text": "The route must be published first",
        "outcome": "ok",
        "explanation": "Publishing does not control lock persistence.",
        "points": 100
      }
    ]
  }
];
