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
    "Building full-stack web applications, browser extensions, and local security tooling. Backend-leaning, privacy by default.",
  /** Scannable keyword chips under the tagline. */
  focus: ["cybersecurity", "backend systems", "automation", "privacy-first"],
  /** One paragraph for the About section. */
  bio: [
    "I’m a Computer Science student at College of Engineering Chengannur (CGPA 8.6). I build backends, Chrome extensions, and security tooling—from browser-side prompt compression to an edge incident response dashboard powered by local Ollama models.",
    "I design for privacy by default: zero telemetry, modular architectures, and verified inputs. Outside of coding, I coordinate technical projects for FOCES CEC and run defensive drills—phishing simulations, network mapping with Nmap, and TryHackMe labs.",
  ],
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
      "Coordinate engineering projects and technical workshops for the student computer science association.",
      "Organize hackathons and community build sessions across campus.",
    ],
  },
  {
    title: "Student Ambassador",
    org: "CampusCrew",
    period: "Dec 2025 – present",
    kind: "work",
    summary: [
      "Connect engineering peers with open-source roadmaps, hackathons, and technical bootcamps.",
    ],
  },
  {
    title: "Backend & AI Engineer",
    org: "Project Aegis — 10-hour hackathon",
    period: "2025",
    kind: "program",
    summary: [
      "Engineered an on-device incident response dashboard with a three-person team during a 10-hour hackathon.",
      "Integrated local Ollama LLMs to classify simulated attacks and output actionable firewall rules without cloud APIs.",
    ],
  },
  {
    title: "Participant",
    org: "OWASP Kerala Bootcamp 2025",
    period: "2025",
    kind: "program",
    summary: [
      "Conducted web vulnerability assessments, OSINT recon, and active network penetration labs.",
      "Deployed controlled phishing simulations with Gophish and mapped network perimeters with Nmap.",
    ],
  },
  {
    title: "Hackathon Winner",
    org: "TinkerHub Useless Projects 2.0",
    period: "Aug 2025",
    kind: "program",
    summary: [
      "Built TortoiseLang (slowlang) — a satirical programming language and IDE enforcing typing cadence with real-time velocity monitoring and ASCII feedback.",
      "Won first place at TinkerHub Useless Projects 2.0 for creative software engineering and humorous event-driven architecture.",
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
      "Satirical programming language and IDE that throttles execution when you type too fast — then triggers ASCII turtle rage and poetic haiku feedback. Built for and won TinkerHub Useless Projects 2.0.",
    stack: ["Python", "Tkinter", "pytest"],
    href: "https://github.com/sebin-gg/slowlang",
    highlight: "Winner · TinkerHub 2.0",
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
    items: [
      "OWASP",
      "Nmap",
      "Gophish",
      "TryHackMe",
      "OSINT",
      "Linux admin",
      "Network engineering",
      "OpenCV",
    ],
  },
  {
    group: "Data & tooling",
    items: [
      "PostgreSQL",
      "MongoDB",
      "SQLite",
      "Git & GitHub",
      "GitHub Actions",
      "Podman",
      "pytest",
      "Chrome MV3",
    ],
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
  title: "Sebin Mathew — full-stack developer & security tools",
  description:
    "Computer Science student at College of Engineering Chengannur. Building full-stack web applications, Chrome extensions, and local security tooling.",
} as const;
