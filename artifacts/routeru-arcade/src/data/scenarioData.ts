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
    "id": 1,
    "title": "Special Instructions Update",
    "situation": "You need to update special instructions for an account, but you do not want to open each daily attribute one by one. What should you do?",
    "choices": [
      {
        "text": "Submit a router update",
        "outcome": "good",
        "explanation": "The SOUS source indicates the right path is a router update.",
        "points": 300
      },
      {
        "text": "Edit every daily attribute manually",
        "outcome": "ok",
        "explanation": "This could work, but it is not the recommended answer from the source.",
        "points": 100
      },
      {
        "text": "Delete and recreate the routing attributes",
        "outcome": "bad",
        "explanation": "Recreating attributes is unnecessary and risky for this type of request.",
        "points": 0
      }
    ],
    "difficulty": "new-hire",
    "topic": "sous"
  },
  {
    "id": 2,
    "title": "Bill-To-Ship-To Policy Check",
    "situation": "A seller wants to Bill-To-Ship-To to a pronto customer for a non-pronto customer. What is the best response?",
    "choices": [
      {
        "text": "Assume it is always allowed",
        "outcome": "bad",
        "explanation": "The source does not say this is always allowed.",
        "points": 0
      },
      {
        "text": "Check with local sales leadership to confirm policy",
        "outcome": "good",
        "explanation": "The SOUS source says to check with local sales leadership to see what their policy is.",
        "points": 300
      },
      {
        "text": "Let the driver decide at dispatch",
        "outcome": "bad",
        "explanation": "This should be resolved through policy, not left to dispatch improvisation.",
        "points": 0
      }
    ],
    "difficulty": "new-hire",
    "topic": "sous"
  },
  {
    "id": 3,
    "title": "Tandem Date Looks Wrong",
    "situation": "An order for today in Tandem is showing tomorrow in Route Planner. What should you check first?",
    "choices": [
      {
        "text": "Republish the route and ignore SOUS",
        "outcome": "bad",
        "explanation": "Republishing does not address the attribute driving the date.",
        "points": 0
      },
      {
        "text": "Check the customer's Days to Delivery in SOUS",
        "outcome": "good",
        "explanation": "The SOUS source says to double check Days to Delivery. 0 = today, 1 = next day, and so on.",
        "points": 300
      },
      {
        "text": "Change the order date in Tandem only",
        "outcome": "ok",
        "explanation": "Tandem may not be the source of truth for routing attributes during order flow.",
        "points": 100
      }
    ],
    "difficulty": "intermediate",
    "topic": "sous"
  },
  {
    "id": 4,
    "title": "Adding Delivery Photos",
    "situation": "A customer wants pictures added to delivery instructions in SOUS. What should you do?",
    "choices": [
      {
        "text": "Add them in the Delivery Photos section under the related tab and drag-and-drop the files",
        "outcome": "good",
        "explanation": "The SOUS source directs users to the Delivery Photos section underneath the routing attributes.",
        "points": 300
      },
      {
        "text": "Paste the image into order comments",
        "outcome": "bad",
        "explanation": "The source points to Delivery Photos, not comments.",
        "points": 0
      },
      {
        "text": "Upload the images to the driver manifest screen",
        "outcome": "bad",
        "explanation": "That location is not the source-recommended place for delivery photos in SOUS.",
        "points": 0
      }
    ],
    "difficulty": "intermediate",
    "topic": "sous"
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
    ],
    "difficulty": "new-hire",
    "topic": "descartes-route-planner"
  },
  {
    "id": 6,
    "title": "Logistical Route Templates",
    "situation": "A shuttle route is unsuccessful in publishing. Where will you most likely be able to resolve errors related to shuttle stops?",
    "choices": [
      {
        "text": "Check the shuttle stops on the route for errors",
        "outcome": "ok",
        "explanation": "You may be able to identify an error within the shuttle stops on a route, but this is not likely the place you will be able to resolve the error.",
        "points": 100
      },
      {
        "text": "Look at the icons next to the shuttle stops",
        "outcome": "bad",
        "explanation": "The icons next to shuttle stops will not signify what is wrong",
        "points": 0
      },
      {
        "text": "The Scheduled Stops section within the Route Template",
        "outcome": "good",
        "explanation": "Check the Scheduled Stops section within the Route Template to ensure the correct location key is added and the Stop Template Key is correct for the stop type. Once resolved, you can recreate the resource with the correct data for publish.",
        "points": 300
      }
    ],
    "difficulty": "intermediate",
    "topic": "descartes-route-planner"
  },
  {
    "id": 7,
    "title": "Missing Favorite Schedules",
    "situation": "A new router cannot see the Planning schedule in Route Planner. What should you do first?",
    "choices": [
      {
        "text": "Add Planning, Dispatch, Review, and Archive schedules to Favorites",
        "outcome": "good",
        "explanation": "Routers must favorite schedules before routing work can begin.",
        "points": 300
      },
      {
        "text": "Ask IT to reinstall Route Planner",
        "outcome": "bad",
        "explanation": "The issue is normally missing Favorites setup, not installation.",
        "points": 0
      },
      {
        "text": "Restart Chrome repeatedly",
        "outcome": "bad",
        "explanation": "Browser restarts will not add schedules.",
        "points": 0
      }
    ],
    "difficulty": "new-hire",
    "topic": "descartes-route-planner"
  },
  {
    "id": 8,
    "title": "Territory Gap Issue",
    "situation": "BGO is behaving strangely after new territories were created. What is the best thing to verify first?",
    "choices": [
      {
        "text": "Ensure all territory points fully connect with no gaps",
        "outcome": "good",
        "explanation": "Territory gaps can cause routing problems and inconsistent territory logic.",
        "points": 300
      },
      {
        "text": "Increase route costs",
        "outcome": "bad",
        "explanation": "Costs do not fix territory map gaps.",
        "points": 0
      },
      {
        "text": "Delete all schedules",
        "outcome": "bad",
        "explanation": "Schedules are unrelated to territory boundary gaps.",
        "points": 0
      }
    ],
    "difficulty": "expert",
    "topic": "descartes-route-planner"
  },
  {
    "id": 9,
    "title": "Route Numbers",
    "situation": "You are starting to see a noticable difference between Delivery Data and Recovery Data when you check reports. It seems that the delivery data is missing routes, at the same time Recovery routes have increased. When checking route numbers what should you look for?",
    "choices": [
      {
        "text": "Delivery Routes should be numbered 1000 - 7989",
        "outcome": "ok",
        "explanation": "True, you should double check that all of your delivery route numbers fall within this range in  Route Planner.",
        "points": 100
      },
      {
        "text": "Verify that you don't see any delivery routes in the Recovery Report, by making sure every route has '99' inside of the route number.",
        "outcome": "good",
        "explanation": "Yes! Proper setup of a Recovery route number is, 1st digit = day number, next digits = 99. Delivery route setup (1000-7989) should be, 1st digit = day number, do not use '99' for delivery.",
        "points": 300
      },
      {
        "text": "Ignore the reports",
        "outcome": "bad",
        "explanation": "Never ignore reports, if you have double checked all the data and you are certain a report is not correct, submit a service ticket or escalate it to your ROM.",
        "points": 0
      }
    ],
    "difficulty": "new-hire",
    "topic": "descartes-route-planner"
  },
  {
    "id": 10,
    "title": "Service Time Complaint",
    "situation": "Routes are consistently too tight at customer locations. What should you review?",
    "choices": [
      {
        "text": "Variable and Fixed Service Times in SOUS",
        "outcome": "good",
        "explanation": "Incorrect service times can heavily impact route duration and planning accuracy.",
        "points": 300
      },
      {
        "text": "Delivery Group colors",
        "outcome": "bad",
        "explanation": "Colors do not affect route timing.",
        "points": 0
      },
      {
        "text": "WinRoute export files",
        "outcome": "bad",
        "explanation": "Export files are unrelated to daily service time setup.",
        "points": 0
      }
    ],
    "difficulty": "expert",
    "topic": "sous"
  },
  {
    "id": 11,
    "title": "Crossdock Validation",
    "situation": "A crossdock order failed during publish validation. What should be checked in Route Planner?",
    "choices": [
      {
        "text": "OrderUDFString4 contains DV",
        "outcome": "good",
        "explanation": "The guide notes XDA/XDB validation in Route Planner by checking OrderUDFString4 for DV.",
        "points": 300
      },
      {
        "text": "Territory color code",
        "outcome": "bad",
        "explanation": "Territory color does not validate crossdock logic.",
        "points": 0
      },
      {
        "text": "Archive schedule assignment",
        "outcome": "bad",
        "explanation": "Archive schedule assignment is not the validation field for crossdock setup.",
        "points": 0
      }
    ],
    "difficulty": "intermediate",
    "topic": "descartes-route-planner"
  },
  {
    "id": 12,
    "title": "Route Optimization Testing",
    "situation": "You want to test a completely new routing solution overnight. What should happen first?",
    "choices": [
      {
        "text": "Unassign all stops from selected routes",
        "outcome": "good",
        "explanation": "Stops must be unassigned before BGO can fully rebuild a dynamic solution.",
        "points": 300
      },
      {
        "text": "Delete all resources",
        "outcome": "bad",
        "explanation": "Resources should remain available for the test solution.",
        "points": 0
      },
      {
        "text": "Archive all orders",
        "outcome": "bad",
        "explanation": "Archived orders cannot be optimized in the project solution.",
        "points": 0
      }
    ],
    "difficulty": "expert",
    "topic": "descartes-route-planner"
  },
  {
    "id": 13,
    "title": "Start Time Update",
    "situation": "A customer placed a large order that will require a route to begin right at 5:00AM to meet the time window. Which field(s) should be checked and updated within the resource settings?",
    "choices": [
      {
        "text": "Earliest Start",
        "outcome": "bad",
        "explanation": "Updating Earliest Start Time will only set the route to begin at a specific time but will remain a range of time if Latest Start is also not updated",
        "points": 0
      },
      {
        "text": "Earliest Start, Latest Start and Latest End",
        "outcome": "good",
        "explanation": "Both the Earliest and Latest start should both be updated to 5:00AM and Latest End should be adjusted as needed to ensure the route does not exceed its allowable hours",
        "points": 300
      },
      {
        "text": "Earliest Start and Latest Start",
        "outcome": "ok",
        "explanation": "Updating Earliest and Latest start to 5:00AM will ensure the route begins at that time, but without checking the Latest End the route could run over its allowable hours",
        "points": 100
      }
    ],
    "difficulty": "intermediate",
    "topic": "descartes-route-planner"
  }
];
