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
  { label: "Communities", href: "#communities" },
  { label: "Skills", href: "#skills" },
  { label: "Terminal", href: "#terminal" },
  { label: "Blog", href: "/blog" },
] as const;

/**
 * Communities and programs from Sebin’s work outside the classroom.
 */
export const communities = [
  { name: "FOCES CEC", role: "Project Coordinator" },
  { name: "CampusCrew", role: "Student Ambassador" },
  { name: "OWASP Kerala", role: "Bootcamp trainee 2025" },
  { name: "TinkerHub", role: "Hackathon winner, Useless Projects 2.0" },
] as const;

/**
 * Recommendations from people Sebin has worked with. The section stays
 * hidden until he has a real quote to share.
 */
export type Recommendation = {
  quote: string;
  name: string;
  context: string;
};

export const recommendations: Recommendation[] = [];

/**
 * English terminal reply templates. Every other locale mirrors this shape in
 * `src/lib/i18n/<locale>.json`; `fill()` substitutes the `{placeholder}` tokens.
 * Command tokens themselves stay untranslated.
 */
export const terminalResponses = {
  help: "Try: {commands}. Type a command and press Enter.",
  whoami: "{name} — {role}, {location}.",
  about: "{bio}",
  projects: "Latest: {project} — {tagline}. {count} projects below.",
  skills: "{items} — full toolbox below.",
  experience: "Now: {title} at {org}. {count} stops below.",
  resume: "Resume PDF is at {url} — header button downloads it too.",
  contact: "Mail {email} — GitHub {handle}.",
  unknown: "Unknown command: {command}. Type help.",
} as const;

export type TerminalResponseKey = keyof typeof terminalResponses;

export type TerminalResponses = Record<TerminalResponseKey, string>;

function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}

/**
 * Commands the playground terminal understands. Static lookup table, no
 * parsing cost.
 */
export const terminalCommands = [
  "help",
  "whoami",
  "about",
  "projects",
  "skills",
  "experience",
  "resume",
  "contact",
  "clear",
] as const;

export type TerminalCommand = (typeof terminalCommands)[number];

type TerminalResult = { output: string; anchor: string | null; clear?: boolean };

function terminalTable(responses: TerminalResponses): Record<TerminalCommand, TerminalResult> {
  return {
    help: {
      output: fill(responses.help, { commands: terminalCommands.join("  ") }),
      anchor: null,
    },
    whoami: {
      output: fill(responses.whoami, {
        name: profile.name,
        role: profile.role,
        location: profile.location,
      }),
      anchor: "#top",
    },
    about: {
      output: fill(responses.about, { bio: profile.bio[0] }),
      anchor: "#top",
    },
    projects: {
      output: fill(responses.projects, {
        project: projects[0].name,
        tagline: projects[0].tagline,
        count: projects.length,
      }),
      anchor: "#projects",
    },
    skills: {
      output: fill(responses.skills, { items: skills[0].items.slice(0, 4).join(", ") }),
      anchor: "#skills",
    },
    experience: {
      output: fill(responses.experience, {
        title: timeline[0].title,
        org: timeline[0].org,
        count: timeline.length,
      }),
      anchor: "#experience",
    },
    resume: {
      output: fill(responses.resume, { url: resumeUrl }),
      anchor: null,
    },
    contact: {
      output: fill(responses.contact, { email: profile.email, handle: links.github.handle }),
      anchor: null,
    },
    clear: { output: "", anchor: null, clear: true },
  };
}

function normalizeCommand(raw: string): string {
  const command = raw.trim().toLowerCase();
  return command === "" ? "help" : command;
}

function unknownResult(command: string, responses: TerminalResponses): TerminalResult {
  return { output: fill(responses.unknown, { command }), anchor: null };
}

export function runTerminalCommand(
  raw: string,
  responses: TerminalResponses = terminalResponses,
): TerminalResult {
  const command = normalizeCommand(raw);
  const table: Record<string, TerminalResult> = terminalTable(responses);
  // `Object.hasOwn` keeps prototype keys (`constructor`, `toString`,
  // `__proto__`) from resolving to inherited members, which would otherwise be
  // truthy and surface as a result with `output === undefined`.
  return Object.hasOwn(table, command) ? table[command] : unknownResult(command, responses);
}

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
