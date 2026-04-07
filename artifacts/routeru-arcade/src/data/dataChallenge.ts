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

export const dataChallenges: DataChallenge[] = [
  {
    id: 1,
    title: "Routing Table Audit",
    description:
      "Examine this routing table excerpt. Identify all entries with problems — suboptimal paths, unreachable next-hops, or missing routes that should exist.",
    hint: "Look for next-hops that are not directly connected, unusually high metrics, and missing default routes.",
    routingTable: [
      {
        id: 1,
        prefix: "10.0.0.0/8",
        nextHop: "192.168.1.1",
        metric: "110",
        protocol: "OSPF",
        age: "00:02:15",
        flags: "O",
        hasIssue: false,
      },
      {
        id: 2,
        prefix: "172.16.0.0/12",
        nextHop: "192.168.1.254",
        metric: "4294967295",
        protocol: "OSPF",
        age: "00:15:40",
        flags: "O",
        issue: "Metric is at maximum (infinity) — route is unreachable",
        hasIssue: true,
      },
      {
        id: 3,
        prefix: "192.168.50.0/24",
        nextHop: "10.255.255.1",
        metric: "20",
        protocol: "EIGRP",
        age: "00:01:05",
        flags: "D",
        hasIssue: false,
      },
      {
        id: 4,
        prefix: "0.0.0.0/0",
        nextHop: "203.0.113.1",
        metric: "1",
        protocol: "Static",
        age: "5d12h",
        flags: "S*",
        hasIssue: false,
      },
      {
        id: 5,
        prefix: "10.10.10.0/24",
        nextHop: "192.168.1.1",
        metric: "65535",
        protocol: "RIP",
        age: "00:30:00",
        flags: "R",
        issue: "RIP metric of 16+ means unreachable (hop count exceeded)",
        hasIssue: true,
      },
      {
        id: 6,
        prefix: "172.31.0.0/16",
        nextHop: "0.0.0.0",
        metric: "0",
        protocol: "Connected",
        age: "3d01h",
        flags: "C",
        hasIssue: false,
      },
      {
        id: 7,
        prefix: "10.20.30.0/24",
        nextHop: "192.168.99.99",
        metric: "110",
        protocol: "OSPF",
        age: "4d08h",
        flags: "O",
        issue: "Next-hop 192.168.99.99 is not reachable — stale route",
        hasIssue: true,
      },
    ],
    correctIssueIds: [2, 5, 7],
    explanation:
      "Route 2 has infinite metric indicating an OSPF unreachable route. Route 5 has a RIP metric of 65535 (effectively 16+ hops = unreachable). Route 7 points to a next-hop that is not in the routing table.",
  },
  {
    id: 2,
    title: "BGP Prefix Analysis",
    description:
      "This BGP table shows received prefixes from a peering session. Find entries with suspicious or invalid configurations.",
    hint: "Check for bogon prefixes, incorrect AS paths, and prefixes that shouldn't appear in a routing table.",
    routingTable: [
      {
        id: 1,
        prefix: "8.8.8.0/24",
        nextHop: "203.0.113.5",
        metric: "0",
        protocol: "BGP",
        age: "1d02h",
        flags: "* >",
        hasIssue: false,
      },
      {
        id: 2,
        prefix: "10.0.0.0/8",
        nextHop: "203.0.113.5",
        metric: "0",
        protocol: "BGP",
        age: "00:45:30",
        flags: "* >",
        issue: "RFC1918 private address in BGP — bogon prefix leaking to internet",
        hasIssue: true,
      },
      {
        id: 3,
        prefix: "1.1.1.0/24",
        nextHop: "203.0.113.5",
        metric: "0",
        protocol: "BGP",
        age: "2d14h",
        flags: "* >",
        hasIssue: false,
      },
      {
        id: 4,
        prefix: "192.168.0.0/16",
        nextHop: "198.51.100.1",
        metric: "100",
        protocol: "BGP",
        age: "00:12:00",
        flags: "*",
        issue: "RFC1918 private address — should never appear in public BGP table",
        hasIssue: true,
      },
      {
        id: 5,
        prefix: "169.254.0.0/16",
        nextHop: "203.0.113.10",
        metric: "0",
        protocol: "BGP",
        age: "00:05:15",
        flags: "* >",
        issue: "Link-local prefix (169.254.0.0/16) — bogon, should not be in BGP",
        hasIssue: true,
      },
      {
        id: 6,
        prefix: "204.13.164.0/23",
        nextHop: "203.0.113.5",
        metric: "0",
        protocol: "BGP",
        age: "3d05h",
        flags: "* >",
        hasIssue: false,
      },
      {
        id: 7,
        prefix: "151.101.0.0/16",
        nextHop: "203.0.113.5",
        metric: "0",
        protocol: "BGP",
        age: "1d08h",
        flags: "* >",
        hasIssue: false,
      },
    ],
    correctIssueIds: [2, 4, 5],
    explanation:
      "Entries 2 (10.0.0.0/8) and 4 (192.168.0.0/16) are RFC1918 private addresses that should never appear in a public BGP table — this indicates a route leak. Entry 5 (169.254.0.0/16) is a link-local bogon prefix.",
  },
  {
    id: 3,
    title: "OSPF Neighbor Issues",
    description:
      "Review this OSPF neighbor table. Some entries indicate problems that will cause routing instability. Identify the problematic neighbors.",
    hint: "Look at neighbor states, stuck states, and timer values that don't match.",
    routingTable: [
      {
        id: 1,
        prefix: "10.0.1.1",
        nextHop: "Gi0/0",
        metric: "1",
        protocol: "FULL/DR",
        age: "00:08:40",
        flags: "Full",
        hasIssue: false,
      },
      {
        id: 2,
        prefix: "10.0.1.2",
        nextHop: "Gi0/0",
        metric: "1",
        protocol: "EXSTART/-",
        age: "00:15:20",
        flags: "Stuck",
        issue: "EXSTART state for 15+ min — likely MTU mismatch preventing database exchange",
        hasIssue: true,
      },
      {
        id: 3,
        prefix: "10.0.2.1",
        nextHop: "Gi0/1",
        metric: "1",
        protocol: "FULL/BDR",
        age: "2d03h",
        flags: "Full",
        hasIssue: false,
      },
      {
        id: 4,
        prefix: "10.0.3.1",
        nextHop: "Gi0/2",
        metric: "1",
        protocol: "2WAY/-",
        age: "00:01:15",
        flags: "Stable",
        hasIssue: false,
      },
      {
        id: 5,
        prefix: "10.0.4.1",
        nextHop: "Gi0/3",
        metric: "1",
        protocol: "INIT/-",
        age: "00:20:05",
        flags: "Stuck",
        issue: "INIT state for 20+ min — neighbor receiving hellos but not responding, possible ACL or hello timer mismatch",
        hasIssue: true,
      },
      {
        id: 6,
        prefix: "10.0.5.1",
        nextHop: "Gi0/4",
        metric: "1",
        protocol: "FULL/-",
        age: "00:04:10",
        flags: "Full",
        hasIssue: false,
      },
      {
        id: 7,
        prefix: "10.0.6.1",
        nextHop: "Gi0/5",
        metric: "1",
        protocol: "LOADING/-",
        age: "00:25:30",
        flags: "Stuck",
        issue: "LOADING state for 25+ min — LSA database sync stuck, possible corrupted LSA or buggy IOS version",
        hasIssue: true,
      },
    ],
    correctIssueIds: [2, 5, 7],
    explanation:
      "Neighbor 10.0.1.2 stuck in EXSTART (likely MTU mismatch). Neighbor 10.0.4.1 stuck in INIT (hello timer mismatch or ACL blocking). Neighbor 10.0.6.1 stuck in LOADING (database synchronization issue).",
  },
];
