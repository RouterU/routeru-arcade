export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  points: number;
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "What is the default administrative distance for OSPF routes?",
    options: ["90", "100", "110", "120"],
    correctIndex: 2,
    explanation: "OSPF has an administrative distance of 110 on Cisco routers.",
    difficulty: "easy",
    points: 100,
  },
  {
    id: 2,
    question: "Which routing protocol uses the Dijkstra algorithm?",
    options: ["RIP", "EIGRP", "OSPF", "BGP"],
    correctIndex: 2,
    explanation: "OSPF uses Dijkstra's Shortest Path First (SPF) algorithm to calculate routes.",
    difficulty: "easy",
    points: 100,
  },
  {
    id: 3,
    question: "What is the maximum hop count for RIPv2?",
    options: ["15", "16", "255", "unlimited"],
    correctIndex: 0,
    explanation: "RIPv2 has a maximum hop count of 15. Hop count of 16 is considered unreachable.",
    difficulty: "easy",
    points: 100,
  },
  {
    id: 4,
    question: "Which BGP attribute is used to influence outbound traffic?",
    options: ["MED", "Local Preference", "AS-Path", "Weight"],
    correctIndex: 1,
    explanation: "Local Preference is used to influence outbound traffic within an AS. Higher value is preferred.",
    difficulty: "medium",
    points: 150,
  },
  {
    id: 5,
    question: "What does ECMP stand for in networking?",
    options: [
      "Extended Circuit Management Protocol",
      "Equal-Cost Multi-Path",
      "External Circuit Management Protocol",
      "Enhanced Circuit Multi-Path",
    ],
    correctIndex: 1,
    explanation: "ECMP (Equal-Cost Multi-Path) allows traffic load balancing across multiple paths of equal cost.",
    difficulty: "medium",
    points: 150,
  },
  {
    id: 6,
    question: "Which OSPF network type does NOT elect a DR/BDR?",
    options: ["Broadcast", "Non-Broadcast", "Point-to-Point", "Point-to-Multipoint"],
    correctIndex: 2,
    explanation: "Point-to-Point networks in OSPF do not elect a DR or BDR since there are only two routers.",
    difficulty: "medium",
    points: 150,
  },
  {
    id: 7,
    question: "What is the BGP attribute that prevents routing loops between ASes?",
    options: ["Local Preference", "AS-Path", "MED", "Origin"],
    correctIndex: 1,
    explanation: "AS-Path prevents routing loops. If a router sees its own AS number in the path, it rejects the route.",
    difficulty: "medium",
    points: 150,
  },
  {
    id: 8,
    question: "In EIGRP, what is the 'Feasible Distance'?",
    options: [
      "The metric of the best path to the destination",
      "The distance from a neighbor to the destination",
      "A backup route metric",
      "The hop count to destination",
    ],
    correctIndex: 0,
    explanation: "Feasible Distance (FD) is the best metric to reach a destination from the local router.",
    difficulty: "hard",
    points: 200,
  },
  {
    id: 9,
    question: "Which command shows the BGP table on a Cisco router?",
    options: [
      "show ip bgp summary",
      "show bgp ipv4 unicast",
      "show ip bgp",
      "display bgp routing-table",
    ],
    correctIndex: 2,
    explanation: "'show ip bgp' displays the full BGP routing table on Cisco IOS.",
    difficulty: "hard",
    points: 200,
  },
  {
    id: 10,
    question: "What does 'route reflector' solve in iBGP?",
    options: [
      "Speed of convergence",
      "Full-mesh iBGP requirement",
      "Route filtering",
      "AS path manipulation",
    ],
    correctIndex: 1,
    explanation: "Route reflectors eliminate the need for full-mesh iBGP by reflecting routes to other iBGP peers.",
    difficulty: "hard",
    points: 200,
  },
  {
    id: 11,
    question: "What is the purpose of the OSPF 'stub area'?",
    options: [
      "Allow external routes in",
      "Reduce LSA flooding by blocking external routes",
      "Connect to the backbone area",
      "Enable redistribution",
    ],
    correctIndex: 1,
    explanation: "Stub areas block external LSAs (Type 5), reducing the routing table size in remote areas.",
    difficulty: "hard",
    points: 200,
  },
  {
    id: 12,
    question: "Which layer of the OSI model do routers primarily operate at?",
    options: ["Layer 1", "Layer 2", "Layer 3", "Layer 4"],
    correctIndex: 2,
    explanation: "Routers operate at Layer 3 (Network layer) of the OSI model, making forwarding decisions based on IP addresses.",
    difficulty: "easy",
    points: 100,
  },
];
