/**
 * All site content lives here so copy and links are easy to update
 * without touching components. Pulled from Sebin's resume, LinkedIn
 * and GitHub (verified repo list, Sep 2026).
 */

export const profile = {
  name: "Sebin Mathew",
  firstName: "Sebin",
  role: "Full-stack developer and software engineer",
  location: "Kottayam, Kerala, India",
  email: "Sebinmathew543@gmail.com",
  /** Phone number is deliberately not published on the web page; it stays in the résumé PDF. */
  degree: "B.Tech in Computer Science & Engineering",
  college: "College of Engineering Chengannur",
  collegeShort: "CEC Chengannur",
  cgpa: 8.6,
  classOf: 2028,
  /** Short line shown under the name in the hero. */
  tagline: "Building full-stack web applications, browser extensions, and local security tooling.",
  /** Scannable keyword chips under the tagline. */
  focus: [
    "cybersecurity",
    "backend systems",
    "automation",
    "privacy-first",
    "frontend",
    "full-stack",
  ],
  /** One paragraph for the About section. */
  bio: [
    "I’m a Computer Science student. My recent work spans browser-side prompt compression, an edge incident response dashboard powered by local Ollama models.",
    "I coordinate technical projects for FOCES CEC.",
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
    name: "TortoiseLang (slowlang)",
    tagline: "A language that punishes fast typing",
    description:
      "Satirical programming language and IDE that throttles execution when you type too fast — then triggers ASCII turtle rage and poetic haiku feedback.",
    stack: ["Python", "Tkinter", "pytest"],
    href: "https://github.com/sebin-gg/slowlang",
    demo: "https://sebin-gg.github.io/slowlang/",
    highlight: "Useless Projects 2.0 by TinkerHub",
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
      "Platform where volunteers log impact across six tracks, earn titles and appear in a private dashboard. Rate-limited REST API with bcrypt auth.",
    stack: ["Express 5", "React 19", "MongoDB", "JWT"],
    href: "https://github.com/sebin-gg/kindred",
    demo: "https://kindred-seven-pi.vercel.app/",
  },
  {
    name: "Aegis",
    tagline: "Cyber threat dashboard with local AI",
    description:
      "Streaming terminal logs, automated attack simulation, iptables mitigation commands and optional local-AI analysis via Ollama.",
    stack: ["Next.js 15", "React 19", "TypeScript", "Ollama"],
    href: "https://github.com/sebin-gg/Aegis",
    highlight: "security",
  },
  {
    name: "brevity-prompt",
    tagline: "Chrome extension that trims prompts",
    description:
      "Compresses prompts in-browser before they hit ChatGPT, Claude or Gemini — 40–65% fewer tokens. Pure client-side regex, zero external dependencies.",
    stack: ["JavaScript", "Chrome MV3", "regex"],
    href: "https://github.com/sebin-gg/brevity-prompt",
    highlight: "privacy",
  },
  {
    name: "ShyUI",
    tagline: "Tray app that hides title bars of maximized windows",
    description:
      "Lightweight Windows tray app that auto-hides the title bar of maximized windows for a cleaner fullscreen-style view. Single C# file on the Win32 API with per-app control and global hotkeys.",
    stack: ["C#", "Windows Forms", "Win32 API"],
    href: "https://github.com/sebin-gg/shyui",
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
  {
    group: "Performance",
    items: ["Lighthouse", "Core Web Vitals", "Performance budgets"],
  },
  {
    group: "Soft skills",
    items: [
      "Project coordination",
      "Event organization",
      "Team collaboration",
      "Community building",
    ],
  },
  {
    group: "Spoken languages",
    items: ["English", "Hindi", "Malayalam"],
  },
] as const;

export const navItems = [
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Blog", href: "/blog" },
] as const;

const SITE_URL_FALLBACK = "https://sebin-gg.vercel.app";

function parseHttpUrl(raw: string): URL {
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" && url.protocol !== "http:") throw new Error("not http(s)");
    return url;
  } catch {
    throw new Error(`NEXT_PUBLIC_SITE_URL must be an absolute http(s) URL, got: "${raw}"`);
  }
}

/**
 * Canonical site origin. Validated at the configuration boundary so a bad
 * NEXT_PUBLIC_SITE_URL (empty or relative) can never leak into metadata,
 * hreflang alternates, or the sitemap as a relative URL.
 */
export function resolveSiteUrl(env: string | undefined): string {
  const url = parseHttpUrl(env?.trim() || SITE_URL_FALLBACK);
  return url.pathname === "/" ? url.origin : `${url.origin}${url.pathname.replace(/\/+$/, "")}`;
}

export const siteUrl = resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);

export const siteMeta = {
  title: "Sebin Mathew — full-stack developer & security tools",
  description:
    "Computer Science student at College of Engineering Chengannur. Building full-stack web applications, Chrome extensions, and local security tooling.",
} as const;
