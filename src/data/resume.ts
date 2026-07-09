export const profile = {
  name: "Thirumaran Deepak",
  firstName: "Thirumaran",
  lastName: "Deepak",
  initials: "TD",
  role: "Software Engineer",
  currentProject: "Talos",
  location: "Bellevue, WA",
  phone: "(425) 591-1475",
  email: "thirumaran.dk@gmail.com",
  linkedin: "https://www.linkedin.com/in/thirumaran-deepak-0772722b2/",
  linkedinLabel: "linkedin.com/in/thirumaran-deepak-0772722b2",
  availability: "Open to internships",
  metaDescription:
    "I build systems that make complex things predictable. AI video editing at Canary, CVE triage tooling at Google. Bellevue, WA.",
  tagline:
    "I build things end to end, and I want to know why they work — not just that they do.",
  summary:
    "I tend to notice things that are broken before anyone says anything. And then I just… fix them, or at least can’t stop thinking about fixing them. I’d rather actually understand why something works than just get it to pass. That’s kind of the whole thing with me.",
};

export type Experience = {
  company: string;
  role: string;
  period: string;
  headline: string;
  featured: boolean;
  points: string[];
  tech: string[];
};

export const experience: Experience[] = [
  {
    company: "Canary Technologies",
    role: "Software Engineering Intern",
    period: "Sep 2025 — Jun 2026",
    headline:
      "Building Talos — an AI video editor in the browser that takes raw footage to a finished, social-ready clip.",
    featured: true,
    points: [
      "Talos listens to the audio with WhisperX, works out where the cuts should go, then handles captions, music, and formatting for whatever platform the clip is headed to.",
      "Wrote a 0–100 “virality” score that mixes content quality, engagement, and trend signals. When data is missing it reweights instead of guessing — and it tells you what to fix, not just what you scored.",
      "The render pipeline is FFmpeg first, with MoviePy only for frame-level effects: trims, resizes to 9:16, 1:1, or 16:9, burned-in captions, music that ducks under speech. 500 MB uploads stream straight to disk, so renders stay fast and memory stays flat.",
      "Nothing ships without a person saying yes. There’s an editable transcript, a checklist of suggested cuts you can approve or throw out, caption presets, a music picker, and a drag-and-drop overlay studio.",
      "There’s an agent layer too — trim, concatenate, subtitle, effects, and music-mix exposed as tools an LLM can call, with render progress streaming back over WebSockets.",
    ],
    tech: ["FastAPI", "Vite", "Tailwind", "WhisperX", "FFmpeg", "MoviePy", "WebSockets"],
  },
  {
    company: "Google",
    role: "Software Developer Intern",
    period: "Oct 2024 — Jun 2025",
    headline:
      "Built the internal bulletin board engineers use to keep track of CVEs.",
    featured: true,
    points: [
      "It pulls vulnerability data from osv.dev and runs each entry through Gemini for a plain-English summary. Triage that used to be done by hand now takes 40% less time.",
      "Before this, sorting through 1,000+ CVEs meant digging through raw JSON. I wrote the search and filters so people could actually slice by severity, product area, or status.",
      "Owned the whole pipeline — pulling feeds, cleaning up formats that never quite agree with each other, scoring severity, and flagging the entries that couldn’t wait. Built it modular so other internal security tools could plug in later.",
    ],
    tech: ["Python", "Gemini AI", "osv.dev", "Data Pipelines"],
  },
  {
    company: "Lakehills Orthodontics",
    role: "Student Intern",
    period: "Sep 2023 — Jun 2024",
    headline:
      "Replaced paper records and spreadsheets with a real progress-tracking system.",
    featured: false,
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
  { value: 40, suffix: "%", label: "less time spent on manual CVE triage at Google" },
  { value: 1000, suffix: "+", label: "CVEs made searchable for engineers" },
  { value: 500, suffix: " MB", label: "uploads streamed to disk without touching RAM" },
  { value: 40, suffix: "%", label: "rise in data reliability across 50+ records" },
];

export const skills = {
  languages: ["Python", "JavaScript", "Java", "HTML", "C++", "C#", "SQL"],
  frameworks: ["React", "Node.js", "FastAPI"],
  aiMedia: ["FFmpeg", "MoviePy", "WhisperX", "Vite", "Tailwind", "SQLite"],
  cloud: ["Azure Cloud Services", "Microsoft Dynamics 365", "Git"],
  soft: ["Team Leadership", "Project Management", "Cross-Cultural Communication"],
};

/* Content for the hero terminal's boot sequence. */
export const terminal = {
  whoami: ["Software Engineer", "Prev. Google", "Incoming Northeastern"],
  currently: ["Building Talos"],
  interests: ["Distributed Systems", "AI", "Infrastructure"],
};

export const education = [
  {
    school: "Bellevue College (Running Start)",
    credential: "Running Start",
    detail: "Graduated June 2026 · GPA 3.89",
    coursework: "CS I–IV (Data Structures & OOP), Calculus I–IV, Physics I–II",
  },
  {
    school: "Bellevue Big Picture High School",
    credential: "High School Diploma",
    detail: "Graduated June 2026 · GPA 3.9",
    coursework: "",
  },
];

export const activities = [
  { name: "Ramen Robotics — FRC Team 9036", role: "Lead Developer" },
  { name: "Coding Club", role: "Co-Leader" },
  { name: "Newspaper Club", role: "Co-Leader & Article Editor" },
  { name: "Medicine Club", role: "Co-Leader" },
  { name: "Salvation Army", role: "Community Volunteer" },
];
