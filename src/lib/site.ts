/**
 * All site content lives here so copy and links are easy to update
 * without touching components. Pulled from Sebin's resume, LinkedIn
 * and GitHub (verified repo list, Sep 2026).
 */

export const profile = {
  name: "Sebin Mathew",
  firstName: "Sebin",
  role: "B.Tech Computer Science student · full-stack & security tooling",
  location: "Kottayam, Kerala, India",
  email: "Sebinmathew543@gmail.com",
  /** Phone number is deliberately not published on the web page; it stays in the résumé PDF. */
  degree: "B.Tech in Computer Science & Engineering",
  college: "College of Engineering Chengannur",
  collegeShort: "CEC Chengannur",
  cgpa: 8.6,
  classOf: 2028,
  /** Short line shown under the name in the hero. */
  tagline:
    "I build full-stack apps, Chrome extensions and security tooling. Backend-leaning, privacy-first by default.",
  /** One paragraph for the About section. */
  bio: [
    "I'm a B.Tech Computer Science student at College of Engineering Chengannur (CGPA 8.6). Most of what I build leans backend and security: APIs, automation, a Chrome extension that compresses prompts before they reach an LLM, and a cyber incident dashboard that runs local models instead of phoning home.",
    "My defaults are privacy and verification: no telemetry, modular design, cryptographic checks where they matter. Outside the editor I coordinate projects for FOCES CEC and run security drills — phishing simulations, Nmap sweeps, TryHackMe rooms.",
  ],
  terminal: {
    prompt: "sebin@portfolio",
    lines: [
      { cmd: "whoami", out: "Sebin Mathew — builder, security-curious" },
      { cmd: "cat focus.txt", out: "cybersecurity · backend · automation" },
      { cmd: "cat projects/", out: "6+ shipped · Chrome ext, dashboards, APIs" },
      { cmd: "./status --now", out: "open to internships & collabs · class of 2028" },
    ],
  },
} as const;

export const links = {
  github: { label: "GitHub", href: "https://github.com/sebin-gg", handle: "@sebin-gg" },
  linkedin: {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/sebin-gg",
    handle: "/in/sebin-gg",
  },
  x: { label: "X", href: "https://x.com/M13568Sebin", handle: "@M13568Sebin" },
  email: {
    label: "Email",
    href: "mailto:Sebinmathew543@gmail.com",
    handle: "Sebinmathew543@gmail.com",
  },
} as const;

export const resumeUrl = "/resume.pdf";

export type TimelineItem = {
  title: string;
  org: string;
  /** Human-readable date range, e.g. "Apr 2026 – present". */
  period: string;
  summary: string[];
  kind: "work" | "program";
};

export const timeline: TimelineItem[] = [
  {
    title: "Project Coordinator",
    org: "FOCES CEC",
    period: "Apr 2026 – present",
    kind: "work",
    summary: [
      "Coordinate technical projects and community initiatives for the 2026–27 executive committee.",
      "Plan and run club activities alongside the committee; keep student engagement high and operations smooth.",
    ],
  },
  {
    title: "Student Ambassador",
    org: "CampusCrew",
    period: "Dec 2025 – present",
    kind: "work",
    summary: [
      "Represent the campus community and help students discover programs, events and learning tracks.",
    ],
  },
  {
    title: "Backend & AI Engineer",
    org: "Project Aegis — 10-hour hackathon",
    period: "2025",
    kind: "program",
    summary: [
      "Built a hybrid-edge AI cyber incident responder with a small team in a 10-hour sprint.",
      "Wired local AI models to analyse simulated threats and propose responses — no cloud dependency.",
    ],
  },
  {
    title: "Participant",
    org: "OWASP Kerala Bootcamp 2025",
    period: "2025",
    kind: "program",
    summary: [
      "Completed vulnerability assessments, OSINT with Google Dorking and TryHackMe challenges.",
      "Ran a Gophish simulated phishing campaign and full Nmap scans end to end.",
    ],
  },
] as const;

export type Project = {
  name: string;
  tagline: string;
  description: string;
  stack: string[];
  href: string;
  demo?: string;
  highlight?: string;
};

export const projects: Project[] = [
  {
    name: "Aegis",
    tagline: "Cyber threat dashboard with local AI",
    description:
      "Real-time threat monitoring dashboard. Streaming terminal logs, automated attack simulation, iptables mitigation commands and optional local-AI analysis via Ollama.",
    stack: ["Next.js 15", "React 19", "TypeScript", "Ollama"],
    href: "https://github.com/sebin-gg/Aegis",
    highlight: "security",
  },
  {
    name: "brevity-prompt",
    tagline: "Chrome extension that trims prompts",
    description:
      "Compresses prompts in-browser before they hit ChatGPT, Claude or Gemini — 40–65% fewer tokens. Pure client-side regex, zero external dependencies, keeps code blocks intact. 25/25 tests passing.",
    stack: ["JavaScript", "Chrome MV3", "regex"],
    href: "https://github.com/sebin-gg/brevity-prompt",
    highlight: "privacy",
  },
  {
    name: "Event Tracker",
    tagline: "FOCES event platform",
    description:
      "Full-stack event management for the FOCES Volunteer Project. Pydantic-validated API, search indexing, SQLite persistence, responsive dark/light UI. Live on GitHub Pages.",
    stack: ["FastAPI", "React", "Tailwind CSS", "SQLite"],
    href: "https://github.com/sebin-gg/Event-Tracker",
    demo: "https://sebin-gg.github.io/Event-Tracker/",
  },
  {
    name: "Kindred",
    tagline: "Community impact tracker",
    description:
      "Platform where volunteers log impact across six tracks, earn titles and appear in a privacy-controlled directory. Rate-limited REST API with bcrypt auth.",
    stack: ["Express 5", "React 19", "MongoDB", "JWT"],
    href: "https://github.com/sebin-gg/kindred",
  },
  {
    name: "TortoiseLang (slowlang)",
    tagline: "A language that punishes fast typing",
    description:
      "Satirical programming language and IDE that throttles execution when you type too fast — then triggers ASCII turtle rage and poetic haiku feedback. Won the TinkerHub Useless Projects competition.",
    stack: ["Python", "Tkinter", "pytest"],
    href: "https://github.com/sebin-gg/slowlang",
    highlight: "won TinkerHub 2025",
  },
  {
    name: "career-bridge",
    tagline: "Local AI résumé matcher",
    description:
      "Matches a résumé against a job description entirely on-device with local AI. Built as a coaching tool that keeps candidate data off remote servers.",
    stack: ["TypeScript", "Local AI"],
    href: "https://github.com/sebin-gg/career-bridge",
    highlight: "privacy",
  },
] as const;

export const skills: { group: string; items: string[] }[] = [
  {
    group: "Languages",
    items: ["TypeScript", "JavaScript", "Python", "SQL", "Bash", "HTML5", "CSS3", "C#"],
  },
  {
    group: "Backend & APIs",
    items: ["Node.js", "Express", "FastAPI", "REST APIs", "Pydantic"],
  },
  {
    group: "Frontend",
    items: ["React", "Next.js", "Tailwind CSS", "Tkinter", "Windows Forms"],
  },
  {
    group: "Security & systems",
    items: ["OWASP", "Nmap", "OSINT", "Linux admin", "Network engineering", "OpenCV"],
  },
  {
    group: "Data & tooling",
    items: ["MongoDB", "SQLite", "Git & GitHub", "Chrome MV3", "pytest"],
  },
] as const;

export const navItems = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "#contact" },
] as const;

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sebin-gg.vercel.app";

export const siteMeta = {
  title: "Sebin Mathew — full-stack & security-minded builder",
  description:
    "B.Tech Computer Science student at College of Engineering Chengannur. Builds full-stack apps, Chrome extensions and security tooling. Privacy-first, backend-leaning.",
} as const;
