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

export const scenarios: Scenario[] = [
  {
    id: 1,
    title: "Network Outage - 3 AM Call",
    situation:
      "You receive an emergency call at 3 AM. Users on a remote branch cannot reach the main office. The branch router shows 'OSPF neighbor down' for the link to HQ. What do you do first?",
    choices: [
      {
        text: "Immediately reboot the branch router",
        outcome: "bad",
        explanation: "Rebooting without diagnosis can cause additional downtime and data loss. Always diagnose first.",
        points: 0,
      },
      {
        text: "Check physical connectivity and interface status, then verify OSPF hello/dead timers match",
        outcome: "good",
        explanation:
          "Systematic approach: verify physical layer first, then check OSPF timer mismatch — the most common cause of neighbor drops.",
        points: 300,
      },
      {
        text: "Ask someone to check the firewall rules",
        outcome: "ok",
        explanation:
          "Firewalls can block OSPF multicast, but checking interface status first is more systematic and likely faster.",
        points: 100,
      },
    ],
  },
  {
    id: 2,
    title: "BGP Route Leak",
    situation:
      "A customer calls saying they are receiving your full BGP table instead of just a default route. You confirm the ISP is leaking your internal prefixes. What is your immediate action?",
    choices: [
      {
        text: "Shut down the BGP session to the ISP immediately",
        outcome: "ok",
        explanation:
          "This stops the leak but also breaks connectivity. Use only if the situation is critical and you have a backup path.",
        points: 100,
      },
      {
        text: "Apply an outbound prefix-list filter to suppress the leaked prefixes, then notify the ISP",
        outcome: "good",
        explanation:
          "Applying route filters is the safest fix — it stops the leak while maintaining connectivity and gives the ISP time to correct their configuration.",
        points: 300,
      },
      {
        text: "Wait for the ISP to fix it on their end",
        outcome: "bad",
        explanation:
          "Passive waiting in a route leak scenario can cause routing loops and reputational damage. You must take immediate action.",
        points: 0,
      },
    ],
  },
  {
    id: 3,
    title: "Routing Loop Detected",
    situation:
      "Traceroute shows a routing loop between two routers. Packets are cycling between 10.1.1.1 and 10.1.1.2. Users are experiencing packet loss. How do you resolve this?",
    choices: [
      {
        text: "Add a static route pointing to Null0 on each router to break the loop, then investigate the root cause",
        outcome: "good",
        explanation:
          "A null route is a clean way to immediately break a loop. Combined with root cause analysis, this is the correct approach.",
        points: 300,
      },
      {
        text: "Increase the TTL of packets traversing the loop",
        outcome: "bad",
        explanation: "Increasing TTL doesn't fix a routing loop — it just delays the loop detection. The loop must be broken at the routing level.",
        points: 0,
      },
      {
        text: "Flush the routing tables on both routers and wait for reconvergence",
        outcome: "ok",
        explanation:
          "Clearing routes can help reconverge, but if the underlying misconfiguration remains, the loop will return. A null route is more surgical.",
        points: 100,
      },
    ],
  },
  {
    id: 4,
    title: "High CPU on Core Router",
    situation:
      "Your core router is showing 98% CPU. The router handles BGP for 800,000+ prefixes. Users are reporting intermittent connectivity. What do you do?",
    choices: [
      {
        text: "Immediately shut down BGP to reduce load",
        outcome: "bad",
        explanation:
          "Shutting BGP down will disconnect all BGP-dependent traffic, making the outage worse. You need to understand the cause first.",
        points: 0,
      },
      {
        text: "Use 'show processes cpu sorted' to identify the top process, check for BGP scanner or TCP issues",
        outcome: "good",
        explanation:
          "Identifying the culprit process is the right first step. BGP scanner issues and TCP floods are common causes of high CPU on BGP routers.",
        points: 300,
      },
      {
        text: "Apply QoS policies to prioritize routing protocol traffic",
        outcome: "ok",
        explanation:
          "QoS helps protect routing traffic but doesn't address the root cause. Diagnosis must come first.",
        points: 100,
      },
    ],
  },
  {
    id: 5,
    title: "Asymmetric Routing Problem",
    situation:
      "Users report that connections to a web server are slow but the server shows normal response times. You notice traffic goes out on Link A but returns via Link B. What is your diagnosis?",
    choices: [
      {
        text: "Replace Link B with a faster link",
        outcome: "bad",
        explanation: "Asymmetric routing isn't necessarily about link speed — it can cause stateful firewall issues and inconsistent performance.",
        points: 0,
      },
      {
        text: "Investigate whether a stateful firewall is in the path and consider making routing symmetric using route maps",
        outcome: "good",
        explanation:
          "Asymmetric routing breaks stateful firewall session tracking. Making routing symmetric or using stateless inspection resolves this correctly.",
        points: 300,
      },
      {
        text: "Enable ECMP to spread load evenly",
        outcome: "ok",
        explanation:
          "ECMP can help with load distribution but may actually worsen asymmetric routing issues if not carefully implemented with stateful devices in the path.",
        points: 100,
      },
    ],
  },
];
