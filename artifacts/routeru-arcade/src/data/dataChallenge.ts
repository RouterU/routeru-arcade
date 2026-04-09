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
}

export const dataChallenges = [
  {
    "id": 1,
    "title": "Pre-Publish Route Audit",
    "description": "Review this route list before publish. Identify all issues that would prevent a clean publish.",
    "hint": "Look for unassigned stops, missing drivers, and routes not ready for publish.",
    "routingTable": [
      {
        "id": 1,
        "prefix": "Route 3055_1",
        "nextHop": "Driver: Smith",
        "metric": "Stops: 18",
        "protocol": "Assigned",
        "age": "Ready",
        "flags": "OK",
        "hasIssue": false
      },
      {
        "id": 2,
        "prefix": "Route 3055_2",
        "nextHop": "Driver: NONE",
        "metric": "Stops: 12",
        "protocol": "Unassigned Driver",
        "age": "Review",
        "flags": "⚠",
        "issue": "Route missing driver assignment",
        "hasIssue": true
      },
      {
        "id": 3,
        "prefix": "Stop U-12",
        "nextHop": "Unassigned",
        "metric": "Cases: 45",
        "protocol": "Unassigned Stop",
        "age": "Planning",
        "flags": "⚠",
        "issue": "Stop is not assigned to any route",
        "hasIssue": true
      },
      {
        "id": 4,
        "prefix": "Route 3055_3",
        "nextHop": "Driver: Lopez",
        "metric": "Stops: 20",
        "protocol": "Assigned",
        "age": "Ready",
        "flags": "OK",
        "hasIssue": false
      },
      {
        "id": 5,
        "prefix": "Route 3055_4",
        "nextHop": "Driver: Kim",
        "metric": "Stops: 3",
        "protocol": "Under Minimum",
        "age": "Review",
        "flags": "⚠",
        "issue": "Route below minimum stop threshold",
        "hasIssue": true
      }
    ],
    "correctIssueIds": [
      2,
      3,
      5
    ],
    "explanation": "Routes must have drivers assigned, all stops must be routed or placed on a 999 route, and under-minimum routes should be reviewed before publish."
  },
  {
    "id": 2,
    "title": "Publish Status Audit",
    "description": "Review these routes after publishing. Identify which ones failed or are incomplete.",
    "hint": "Look at publish indicators and missing confirmations (yellow vs green diamond logic).",
    "routingTable": [
      {
        "id": 1,
        "prefix": "Route 3055_1",
        "nextHop": "Published",
        "metric": "Tandem + Omni",
        "protocol": "Green",
        "age": "Complete",
        "flags": "OK",
        "hasIssue": false
      },
      {
        "id": 2,
        "prefix": "Route 3055_2",
        "nextHop": "Published",
        "metric": "Tandem Only",
        "protocol": "Yellow",
        "age": "Incomplete",
        "flags": "⚠",
        "issue": "Not fully published to Omni",
        "hasIssue": true
      },
      {
        "id": 3,
        "prefix": "Route 3055_3",
        "nextHop": "Failed",
        "metric": "Error",
        "protocol": "None",
        "age": "Blocked",
        "flags": "❌",
        "issue": "Route failed to publish",
        "hasIssue": true
      },
      {
        "id": 4,
        "prefix": "Route 3055_4",
        "nextHop": "Published",
        "metric": "Tandem + Omni",
        "protocol": "Green",
        "age": "Complete",
        "flags": "OK",
        "hasIssue": false
      }
    ],
    "correctIssueIds": [
      2,
      3
    ],
    "explanation": "A yellow indicator means only Tandem was successful. Routes must fully publish (green) to be complete. Failed routes must be corrected."
  },
  {
    "id": 3,
    "title": "Review Schedule Validation",
    "description": "You are reviewing routes before final publish. Identify issues that should be corrected before moving forward.",
    "hint": "Focus on sequencing, route balance, and stops that don’t belong.",
    "routingTable": [
      {
        "id": 1,
        "prefix": "Route 3055_1",
        "nextHop": "18 stops",
        "metric": "Balanced",
        "protocol": "Valid",
        "age": "Ready",
        "flags": "OK",
        "hasIssue": false
      },
      {
        "id": 2,
        "prefix": "Route 3055_2",
        "nextHop": "35 stops",
        "metric": "Overloaded",
        "protocol": "Imbalanced",
        "age": "Review",
        "flags": "⚠",
        "issue": "Route significantly overloaded vs others",
        "hasIssue": true
      },
      {
        "id": 3,
        "prefix": "Stop 22",
        "nextHop": "Wrong Route",
        "metric": "Out of area",
        "protocol": "Misplaced",
        "age": "Review",
        "flags": "⚠",
        "issue": "Stop assigned to incorrect route",
        "hasIssue": true
      },
      {
        "id": 4,
        "prefix": "Route 3055_3",
        "nextHop": "20 stops",
        "metric": "Balanced",
        "protocol": "Valid",
        "age": "Ready",
        "flags": "OK",
        "hasIssue": false
      }
    ],
    "correctIssueIds": [
      2,
      3
    ],
    "explanation": "Routes should be balanced, and stops must be assigned to the correct route for efficiency and service."
  }
];
