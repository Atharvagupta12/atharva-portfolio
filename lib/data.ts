// ─────────────────────────────────────────────────────────────
//  Single source of truth for every word on the site.
//  Edit links here — empty strings are hidden automatically.
// ─────────────────────────────────────────────────────────────

export const profile = {
  name: "Atharva Gupta",
  firstName: "Atharva",
  lastName: "Gupta",
  role: "Software Engineer",
  focus: ["Backend Systems", "Distributed Architecture", "AI Infrastructure"],
  location: "Indore, India",
  timezone: "Asia/Kolkata",
  email: "atharvguptaofficial@gmail.com",
  phone: "+91 6262866192",
  phoneHref: "tel:+916262866192",
  // Set to false (or edit the text) if you are not currently looking.
  available: true,
  availability: "Open to SDE & backend roles",
  rotating: ["scalable backends.", "AI infrastructure.", "distributed systems.", "products people use."],
  intro:
    "Most recently I architected CortexStak at Ronkot Design — an AI platform that unifies multiple model providers behind a single API, with failover, caching and rate limiting that cut average latency by 55%.",
  links: {
    github: "https://github.com/Atharvagupta12",
    linkedin: "https://www.linkedin.com/in/atharvagupta-dev/",
    leetcode: "https://leetcode.com/u/atharvagupta3001/",
    resume: "/Atharva_Gupta_Resume.pdf", // file lives in /public
  },
};

export const about = {
  lead: "I'm a software engineer focused on backend systems, distributed architecture and production AI infrastructure.",
  body: [
    "I work across the stack — from designing REST APIs and PostgreSQL data models to building multi-provider AI routing, authentication and containerized microservices. I care about the details that make software dependable: performance, resilience, clean interfaces and thoughtful systems design.",
    "My foundation is in Electronics and Communication Engineering, sharpened by hands-on product work and a consistent problem-solving practice — 500+ DSA problems and a 1650+ LeetCode contest rating.",
  ],
  facts: [
    { k: "Based in", v: "Indore, India" },
    { k: "Degree", v: "B.Tech ECE · 2026" },
    { k: "GPA", v: "8.4 / 10" },
    { k: "Certified", v: "AWS Cloud Practitioner" },
  ],
};

export const metrics = [
  { value: 55, suffix: "%", label: "Lower average latency", note: "CortexStak routing" },
  { value: 40, suffix: "%", label: "Fewer redundant AI calls", note: "Response caching" },
  { value: 35, suffix: "%", label: "Faster API responses", note: "Query optimization" },
  { value: 40, suffix: "%", label: "Faster deployments", note: "Jenkins CI/CD" },
  { value: 1650, suffix: "+", label: "LeetCode contest rating", note: "Competitive programming" },
  { value: 500, suffix: "+", label: "DSA problems solved", note: "Consistent practice" },
];

export const experience = [
  {
    role: "Full-Stack Developer",
    company: "Ronkot Design LLC",
    period: "May 2026 — Oct 2026",
    location: "Indore, India",
    summary:
      "Built CortexStak, an AI SaaS platform unifying multiple AI providers behind a single API, with an architecture designed for 1M+ users.",
    bullets: [
      "Designed REST APIs, PostgreSQL data models and JWT authentication.",
      "Implemented distributed multi-provider routing with automatic failover, per-user rate limiting and response caching — reducing redundant provider calls by 40% and average latency by 55%.",
      "Containerized microservices with Docker and deployed on AWS with automated CI/CD, structured logging and health checks for zero-downtime releases.",
    ],
    impact: [
      { v: "−55%", k: "avg latency" },
      { v: "−40%", k: "redundant calls" },
      { v: "1M+", k: "user-ready arch" },
      { v: "0", k: "downtime releases" },
    ],
    tags: ["Distributed Systems", "AI Infrastructure", "AWS", "Docker", "PostgreSQL", "JWT"],
  },
  {
    role: "Software Developer Intern",
    company: "Brakt Pvt Ltd",
    period: "Jun 2025 — Sep 2025",
    location: "Bhopal, MP",
    summary:
      "Shipped full-stack product features and improved the speed and maintainability of the development workflow.",
    bullets: [
      "Built features using React.js and Node.js; reduced average API response time by 35% through query optimization and payload trimming.",
      "Refactored a legacy frontend into a reusable component library, reducing duplicate code by ~25%.",
      "Automated Jenkins CI/CD pipelines, reducing deployment time by 40%.",
    ],
    impact: [
      { v: "−35%", k: "API response" },
      { v: "−25%", k: "duplicate code" },
      { v: "−40%", k: "deploy time" },
    ],
    tags: ["React.js", "Node.js", "Jenkins", "API Optimization"],
  },
];

export type Project = {
  slug: "attendify" | "groei" | "dispatch";
  name: string;
  kind: string;
  description: string;
  highlights: string[];
  result: { value: string; label: string };
  stack: string[];
  live: string;
  repo: string;
};

export const projects: Project[] = [
  {
    slug: "attendify",
    name: "Attendify",
    kind: "WiFi Attendance System",
    description:
      "Automated classroom attendance by parsing WiFi router logs to detect connected student devices in real time — no roll calls, no proxies.",
    highlights: [
      "Device-fingerprint deduplication to stop one student counting twice",
      "Role-based dashboards for Admin, Faculty and Student",
    ],
    result: { value: "98%", label: "accuracy vs. manual records" },
    stack: ["Next.js", "TypeScript", "Node.js", "PostgreSQL"],
    live: "https://attendify-wifi-system.vercel.app/",
    repo: "",
  },
  {
    slug: "groei",
    name: "GROEI",
    kind: "AI SaaS · Podcast Platform",
    description:
      "A full-stack podcast streaming platform where listeners explore episodes across creators — or generate their own podcast from a text prompt using six distinct AI voices.",
    highlights: [
      "Prompt-to-podcast generation with six AI voices",
      "Usage-based rate limiting and API cost controls",
      "Edge caching on Vercel for near-instant page loads",
    ],
    result: { value: "<200ms", label: "TTFB with edge caching" },
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "OpenAI API", "Vercel"],
    live: "https://groei.vercel.app/",
    repo: "",
  },
  {
    slug: "dispatch",
    name: "Dispatch",
    kind: "RAG Chatbot · Cloud Native",
    description:
      "A retrieval-augmented chatbot built on vector embeddings and semantic chunking, running as Kubernetes microservices on AWS with pod autoscaling and rolling updates.",
    highlights: [
      "Semantic chunking + vector search for grounded answers",
      "K8s autoscaling and zero-downtime rolling updates",
    ],
    result: { value: "85%", label: "answer relevance · self-built 200-question eval" },
    stack: ["React.js", "Node.js", "Vector DB", "Docker", "Kubernetes", "AWS"],
    live: "https://voosh-rag-frontend-hazel.vercel.app/",
    repo: "",
  },
];

export const skillGroups = [
  { key: "languages", label: "Languages", skills: ["C++", "JavaScript (ES6+)", "TypeScript", "Python", "SQL"] },
  { key: "backend", label: "Backend", skills: ["Node.js", "Express.js", "RESTful APIs", "REST API Design", "Microservices", "Authentication", "Authorization"] },
  { key: "devops", label: "DevOps & Cloud", skills: ["Docker", "Kubernetes", "Jenkins", "CI/CD", "AWS", "Git", "GitHub", "Linux"] },
  { key: "frontend", label: "Frontend", skills: ["React.js", "Next.js", "HTML5", "CSS3", "Tailwind CSS", "Responsive Design"] },
  { key: "data", label: "Data", skills: ["PostgreSQL", "MongoDB", "Query Optimization"] },
  { key: "core", label: "Core Concepts", skills: ["DSA", "OOP", "DBMS", "Operating Systems", "System Design", "Distributed Systems", "Scalability"] },
] as const;

export const marquee = [
  "TypeScript", "Node.js", "PostgreSQL", "Kubernetes", "Docker", "AWS", "Next.js", "React",
  "Express", "MongoDB", "Jenkins", "CI/CD", "C++", "Python", "Microservices", "Vector DBs", "System Design",
];

export const achievements = [
  {
    key: "leetcode",
    title: "1650+ Contest Rating",
    org: "LeetCode",
    detail: "500+ DSA problems solved across arrays, graphs, DP and more.",
    year: "Ongoing",
  },
  {
    key: "codecult",
    title: "Founder & Lead Engineer",
    org: "CodeCult · Ed-Tech Platform",
    detail: "Founded and led engineering for an ed-tech platform.",
    year: "2024 — 25",
  },
  {
    key: "aws",
    title: "AWS Certified Cloud Practitioner",
    org: "Amazon Web Services",
    detail: "Certified on core AWS services, architecture and security.",
    year: "2025",
  },
  {
    key: "oss",
    title: "Open Source Contributor",
    org: "GirlScript Summer of Code · SIH",
    detail: "Contributed to GSSoC 2024 and competed in Smart India Hackathon 2024.",
    year: "2024",
  },
] as const;

export const education = {
  school: "University Institute of Technology, RGPV",
  degree: "Bachelor of Technology — Electronics & Communication Engineering",
  period: "Aug 2022 — May 2026",
  location: "Bhopal, MP",
  gpa: 8.4,
};

export const sections = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "work", label: "Work" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
] as const;
