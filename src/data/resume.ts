export const profile = {
  name: "Thirumaran Deepak",
  firstName: "Thirumaran",
  lastName: "Deepak",
  initials: "TD",
  role: "Software Developer",
  currentProject: "Microsoft Copilot",
  location: "Bellevue, WA",
  phone: "(425) 591-1475",
  email: "thirumaran.dk@gmail.com",
  linkedin: "https://www.linkedin.com/in/thirumaran-deepak/",
  linkedinLabel: "linkedin.com/in/thirumaran-deepak",
  github: "https://github.com/hirumaran",
  githubLabel: "github.com/hirumaran",
  resume: "/thirumaran-deepak-resume.pdf",
  resumeDownloadName: "Thirumaran-Deepak-Resume.pdf",
  availability: "Open to opportunities",
  metaDescription:
    "University of Washington computer science student and software developer focused on robotics, reliable AI systems, and real-time infrastructure.",
  tagline:
    "Undergrad Student @ University of Washington",
  summary:
    "I’m an incoming University of Washington computer science student and software developer focused on robotics, reliable AI systems, and real-time infrastructure. I’ve built production tools across Android security, LLM-controlled media pipelines, and hardware–software integration, owning projects from prototype through deployment.",
};

export type Experience = {
  company: string;
  role: string;
  period: string;
  headline: string;
  featured: boolean;
  logo: string;
  logoFormat: "symbol" | "wordmark";
  points: string[];
  tech: string[];
};

export const experience: Experience[] = [
  {
    company: "University of Washington, Department of Electrical & Computer Engineering",
    role: "Undergraduate Researcher",
    period: "Aug 2026 — Present",
    headline:
      "Training reinforcement-learning policies for Franka robotic manipulators and building the MuJoCo experimentation pipeline behind them.",
    featured: true,
    logo: "/images/experience/uw-ece.png",
    logoFormat: "symbol",
    points: [
      "Conduct reinforcement-learning research for robotic manipulation with PhD researcher Jake Gonzales, advised by Professors Lillian Ratliff and Behçet Açıkmeşe.",
      "Train and evaluate PPO-based policies for Franka manipulators in MuJoCo Playground, beginning with pick-and-place and block-stacking benchmarks.",
      "Build the simulation and experimentation pipeline end to end, including environment setup, reward design, training runs, evaluation, and performance analysis.",
    ],
    tech: ["Reinforcement Learning", "PPO", "MuJoCo", "Robotic Manipulation"],
  },
  {
    company: "Microsoft AI",
    role: "Copilot Student Ambassador",
    period: "Aug 2026 — Present",
    headline:
      "Representing Microsoft Copilot at the University of Washington through hands-on workshops, events, and product demos.",
    featured: true,
    logo: "/images/experience/microsoft.svg",
    logoFormat: "symbol",
    points: [
      "Lead workshops, events, and demos that help students across the University of Washington campus understand and use Microsoft Copilot.",
      "Turn real student usage into direct product feedback for the Copilot team, surfacing what works, what confuses people, and what should improve.",
    ],
    tech: ["Microsoft Copilot", "AI Workshops", "Product Feedback"],
  },
  {
    company: "Canary Technologies",
    role: "Applied AI Intern",
    period: "Oct 2025 — Jun 2026",
    headline:
      "Architected an LLM-controlled video pipeline that turns natural-language edits into memory-stable, production-ready renders.",
    featured: true,
    logo: "/images/experience/canary.svg",
    logoFormat: "wordmark",
    points: [
      "Architected an LLM agent layer that exposes trim, concatenate, subtitle, effect, and audio-mix operations as callable tools, enabling natural-language render control with real-time WebSocket progress.",
      "Built an FFmpeg-first render pipeline with MoviePy for frame-level effects; 500 MB+ uploads stream to disk to keep memory stable across multiple aspect ratios.",
      "Designed a human-in-the-loop interface with editable transcripts and explicit overrides so users stay in control of every AI-suggested edit.",
    ],
    tech: ["LLM Agents", "FFmpeg", "MoviePy", "WebSockets", "Human-in-the-Loop"],
  },
  {
    company: "Ramen Robotics — FRC Team 9036",
    role: "Software Engineer & Tester",
    period: "May 2025 — Jun 2026",
    headline:
      "Built and tested autonomous robot routines, control software, and an early vision system for FRC competition.",
    featured: true,
    logo: "/images/experience/ramen-robotics.png",
    logoFormat: "symbol",
    points: [
      "Built PathPlanner autonomous routines, paths, and commands, then re-tuned routes from measured practice and competition performance.",
      "Tested robot control software throughout practices and competitions and prototyped a computer-vision system for future on-field use.",
      "Worked across mechanical, electrical, and drive teams to turn match strategy into dependable robot behavior.",
    ],
    tech: ["PathPlanner", "Robot Control", "Computer Vision", "FRC"],
  },
  {
    company: "Google",
    role: "Android Security Intern",
    period: "Oct 2024 — Jun 2025",
    headline:
      "Built fuzzing and classification tooling for Android Security — fuzzing newer Android builds, surfacing crashes, and using Gemini to triage and explain them.",
    featured: true,
    logo: "/images/experience/google-color.svg",
    logoFormat: "symbol",
    points: [
      "Completed a year-long Android Security internship in Kirkland under Greg Wroblewski, owning two security-tooling projects from design through delivery.",
      "Built an Android fuzzer for new OS builds that captures crash IDs and stack traces, then uses Gemini to explain likely root causes in plain language.",
      "Built a security bulletin scraper that creates a labeled reference set, classifies newly discovered bugs with Gemini, and publishes concise summaries.",
    ],
    tech: ["Python", "Gemini API", "Android", "Fuzzing", "Security Tooling"],
  },
  {
    company: "Lakehills Orthodontics",
    role: "Healthcare Systems Intern",
    period: "Sep 2023 — Jun 2024",
    headline:
      "Replaced paper records and spreadsheets with a real progress-tracking system.",
    featured: false,
    logo: "/images/experience/lakehills.png",
    logoFormat: "symbol",
    points: [
      "Built patient progress tracking in Microsoft Dynamics 365 and standardized how staff entered data. Workflow delays dropped about 25%.",
      "Shipped two weeks ahead of schedule, and audited 50+ patient records during the move — data reliability went up 40%.",
    ],
    tech: ["Microsoft Dynamics 365"],
  },
  {
    company: "Quadrant Technologies",
    role: "App Development Intern",
    period: "Nov 2022 — Jun 2023",
    headline:
      "Built a patient data app that cut staff retrieval time by 30%.",
    featured: false,
    logo: "/images/experience/quadrant-horizontal.svg",
    logoFormat: "wordmark",
    points: [
      "A Python/JavaScript app for patient data. The data layer had to swallow inconsistent input formats coming from different corners of the facility.",
      "Kept the build inside healthcare compliance rules the whole way, tracked budget against milestones, and landed 15% under the original estimate.",
    ],
    tech: ["Python", "JavaScript"],
  },
];

export type Stat = {
  value: number;
  prefix?: string;
  suffix: string;
  label: string;
};

export const stats: Stat[] = [
  { value: 500, suffix: " MB+", label: "video uploads streamed to disk with stable memory" },
  { value: 25, suffix: "%", label: "reduction in healthcare workflow delays" },
  { value: 40, suffix: "%", label: "rise in data reliability across 50+ records" },
  { value: 30, suffix: "%", label: "reduction in patient data retrieval time" },
];

export const skills = {
  languages: ["Python", "JavaScript", "Java", "C++", "C#", "SQL", "HTML/CSS"],
  frameworks: ["React", "Node.js", "FastAPI", "Vite", "Tailwind"],
  aiMedia: ["WhisperX", "Gemini API", "FFmpeg", "MoviePy", "WebSockets", "PathPlanner"],
  cloud: ["Git", "Azure Cloud", "Microsoft Dynamics 365"],
  soft: ["Team Leadership", "Cross-Functional Collaboration", "Technical Communication"],
};

/**
 * The three themes that connect the resume into one memorable story. These
 * are intentionally more selective than the full toolbox: they tell a hiring
 * manager what Thirumaran is unusually good at, then point to the work that
 * proves it.
 */
export const strengths = [
  {
    title: "Applied AI Systems",
    description:
      "AI that stays explainable, controllable, and useful after the demo.",
    proof: "Google · Canary · Microsoft AI",
    tools: ["Gemini API", "LLM Agents", "Human-in-the-Loop"],
  },
  {
    title: "Robotics & Autonomy",
    description:
      "Learning and control systems that turn simulation, sensor input, and strategy into dependable physical behavior.",
    proof: "UW ECE Research · FRC 9036",
    tools: ["PPO", "MuJoCo", "PathPlanner"],
  },
  {
    title: "Real-Time Infrastructure",
    description:
      "Memory-stable media pipelines with live progress and production constraints built in.",
    proof: "Canary Technologies",
    tools: ["FFmpeg", "WebSockets", "WhisperX"],
  },
] as const;

/* Content for the hero terminal's boot sequence. */
export const terminal = {
  whoami: [
    "Software Developer",
    "Microsoft Copilot Student Ambassador",
    "Incoming University of Washington",
  ],
  currently: ["Representing Microsoft Copilot", "Building reliable AI systems"],
  interests: ["Robotics", "Reliable AI Systems", "Real-Time Infrastructure"],
};

export const education = [
  {
    school: "University of Washington",
    credential: "B.S., Computer Science",
    detail: "Expected June 2030 · Tacoma, WA",
    coursework: "",
  },
  {
    school: "Bellevue College (Running Start)",
    credential: "Computer Science",
    detail: "Graduated June 2026 · Bellevue, WA",
    coursework: "",
  },
  {
    school: "Bellevue Big Picture High School",
    credential: "High School Diploma",
    detail: "June 2026 · Bellevue, WA",
    coursework: "",
  },
];

export const activities = [
  { name: "Coding Club", role: "Co-Leader" },
  { name: "Newspaper Club", role: "Co-Leader, Article Editor" },
  { name: "Medicine Club", role: "Co-Leader" },
  { name: "Salvation Army", role: "Volunteer" },
];
