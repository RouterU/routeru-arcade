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

export type TrainingDifficulty = "new-hire" | "intermediate" | "expert";

export type TrainingTopic =
  | "descartes-route-planner"
  | "sous"
  | "tandem"
  | "omnitrax";

export interface DataChallenge {
  id: number;
  title: string;
  description: string;
  hint: string;
  routingTable: RouteEntry[];
  correctIssueIds: number[];
  explanation: string;
  difficulty: TrainingDifficulty;
  topic: TrainingTopic;
}

export const dataChallenges: DataChallenge[] = [
  {
    id: 1,
    title: "Map Icon Recognition Audit",
    description:
      "Review these Route Planner icon interpretations and identify every row where the meaning is incorrect.",
    hint: "Focus on circles vs triangles, squares vs stars, and publish/status indicators.",
    routingTable: [
      {
        id: 1,
        prefix: "Stop 1101",
        nextHop: "Gray circle",
        metric: "DG_1",
        protocol: "No liftgate",
        age: "Ready",
        flags: "OK",
        hasIssue: false,
      },
      {
        id: 2,
        prefix: "Stop 1102",
        nextHop: "Gray triangle",
        metric: "DG_1",
        protocol: "No liftgate",
        age: "Review",
        flags: "⚠",
        issue:
          "Gray triangle means DG_1 with a liftgate requirement, not no liftgate",
        hasIssue: true,
      },
      {
        id: 3,
        prefix: "Route 2201",
        nextHop: "Yellow diamond",
        metric: "Published",
        protocol: "Omnitracs",
        age: "Sent",
        flags: "⚠",
        issue:
          "Yellow diamond means sent to Tandem with no errors, not Omnitracs",
        hasIssue: true,
      },
      {
        id: 4,
        prefix: "Stop 1104",
        nextHop: "Black square",
        metric: "Special stop",
        protocol: "Key drop",
        age: "Ready",
        flags: "OK",
        hasIssue: false,
      },
      {
        id: 5,
        prefix: "Order 1105",
        nextHop: "Red hexagon",
        metric: "Status",
        protocol: "30/40",
        age: "Blocked",
        flags: "⚠",
        issue: "Red hexagon means a status 20 order",
        hasIssue: true,
      },
    ],
    correctIssueIds: [2, 3, 5],
    explanation:
      "Rows 2, 3, and 5 are incorrect based on the Route Planner icon definitions in the source tab.",
    difficulty: "intermediate",
    topic: "descartes-route-planner",
  },
  {
    id: 2,
    title: "Publish & Routing Setup Audit",
    description:
      "Review the route setup notes and identify each row that could block expected Route Planner behavior.",
    hint: "Look for optimization exclusions, missing context-menu setup, and backhaul publish steps.",
    routingTable: [
      {
        id: 1,
        prefix: "Route 3301",
        nextHop: "Resource config",
        metric: "UDFString4 blank",
        protocol: "Exclude From Optimization = ON",
        age: "Planning",
        flags: "⚠",
        issue:
          "Exclude From Optimization being checked can prevent BGO from optimizing the route",
        hasIssue: true,
      },
      {
        id: 2,
        prefix: "Route 3302",
        nextHop: "Resource config",
        metric: "UDFString4 blank",
        protocol: "Exclude From Optimization = OFF",
        age: "Planning",
        flags: "OK",
        hasIssue: false,
      },
      {
        id: 3,
        prefix: "Route 3303",
        nextHop: "Context menu",
        metric: "Routes quadrant",
        protocol: "Print manifest missing",
        age: "Setup",
        flags: "⚠",
        issue:
          "Add route right-click options from App Setup > UI Setting > Context Menu in the Routes quadrant",
        hasIssue: true,
      },
      {
        id: 4,
        prefix: "Route 3304",
        nextHop: "Backhaul publish",
        metric: "Empty truck symbol still showing",
        protocol: "Republished immediately",
        age: "Review",
        flags: "⚠",
        issue:
          "For backhaul routes not sending to Omnitracs, refresh until the empty truck symbol goes away before republishing",
        hasIssue: true,
      },
      {
        id: 5,
        prefix: "Route 3305",
        nextHop: "Resource config",
        metric: "No X in UDFString4",
        protocol: "Optimization allowed",
        age: "Ready",
        flags: "OK",
        hasIssue: false,
      },
    ],
    correctIssueIds: [1, 3, 4],
    explanation:
      "Rows 1, 3, and 4 describe setup problems that can stop optimization or successful publish behavior.",
    difficulty: "intermediate",
    topic: "descartes-route-planner",
  },
  {
    id: 3,
    title: "Assignment Audit",
    description:
      "Review the order assignment setup and identify which rows are likely to stop Batch Processor assignment or hide key visibility.",
    hint: "Check PreferredResource, Requirements, Dates, and RP field selection.",
    routingTable: [
      {
        id: 1,
        prefix: "Order 4401",
        nextHop: "Assignment check",
        metric: "PreferredResource matches",
        protocol: "Requirements and dates align",
        age: "Ready",
        flags: "OK",
        hasIssue: false,
      },
      {
        id: 2,
        prefix: "Order 4402",
        nextHop: "Assignment check",
        metric: "PreferredResource mismatch",
        protocol: "Resource does not match requirements",
        age: "Blocked",
        flags: "⚠",
        issue:
          "If PreferredResource, Requirements, or Dates do not match a resource, Batch Processor may not attach the order",
        hasIssue: true,
      },
      {
        id: 3,
        prefix: "RP Grid",
        nextHop: "Visibility",
        metric: "OrderUDFString7 added",
        protocol: "Customer tier visible",
        age: "Ready",
        flags: "OK",
        hasIssue: false,
      },
      {
        id: 4,
        prefix: "Order 4404",
        nextHop: "Assignment check",
        metric: "Dates mismatch",
        protocol: "No matching resource on those dates",
        age: "Blocked",
        flags: "⚠",
        issue:
          "Date mismatches can keep Batch Processor from assigning the order",
        hasIssue: true,
      },
      {
        id: 5,
        prefix: "Order 4405",
        nextHop: "Assignment check",
        metric: "PreferredResource matches",
        protocol: "Requirements and dates align",
        age: "Ready",
        flags: "OK",
        hasIssue: false,
      },
    ],
    correctIssueIds: [2, 4],
    explanation:
      "Rows 2 and 4 have assignment mismatches that can keep Batch Processor from attaching the order.",
    difficulty: "new-hire",
    topic: "descartes-route-planner",
  },
];
