import { links, profile, projects, resumeUrl, siteUrl, skills, timeline } from "@/lib/site";

export type AgentSnapshot = {
  name: string;
  role: string;
  location: string;
  site: string;
  tagline: string;
  focus: readonly string[];
  bio: readonly string[];
  links: Record<string, string>;
  resume: string;
  projects: {
    name: string;
    tagline: string;
    description: string;
    stack: string[];
    href: string;
    demo?: string;
  }[];
  experience: {
    title: string;
    org: string;
    period: string;
    summary: string[];
    href?: string;
  }[];
  skills: { group: string; items: string[] }[];
  updatedAt: string;
};

// skipcq: JS-0067 — module-scoped export, not a global declaration
export function buildAgentSnapshot(): AgentSnapshot {
  return {
    name: profile.name,
    role: profile.role,
    location: profile.location,
    site: siteUrl,
    tagline: profile.tagline,
    focus: profile.focus,
    bio: profile.bio,
    links: {
      github: links.github.href,
      linkedin: links.linkedin.href,
      x: links.x.href,
    },
    resume: `${siteUrl}${resumeUrl}`,
    projects: projects.map((p) => ({
      name: p.name,
      tagline: p.tagline,
      description: p.description,
      stack: [...p.stack],
      href: p.href,
      ...(p.demo ? { demo: p.demo } : {}),
    })),
    experience: timeline.map((t) => ({
      title: t.title,
      org: t.org,
      period: t.period,
      summary: [...t.summary],
      ...(t.href ? { href: t.href } : {}),
    })),
    skills: skills.map((s) => ({ group: s.group, items: [...s.items] })),
    updatedAt: new Date().toISOString(),
  };
}

// skipcq: JS-0067 — module-scoped export, not a global declaration
export function buildLlmsText(): string {
  const snap = buildAgentSnapshot();
  const lines = [
    `# ${snap.name} — Portfolio`,
    ``,
    `> ${snap.tagline}`,
    ``,
    `- Location: ${snap.location}`,
    `- GitHub: ${snap.links.github}`,
    `- LinkedIn: ${snap.links.linkedin}`,
    `- Resume: ${snap.resume}`,
    ``,
    `## Projects`,
    ...snap.projects.map((p) => `- ${p.name}: ${p.description} (${p.href})`),
    ``,
    `## Experience`,
    ...snap.experience.map(
      (e) => `- ${e.title}, ${e.org} (${e.period})${e.href ? ` (${e.href})` : ""}`,
    ),
    ``,
    `## Skills`,
    ...snap.skills.map((s) => `- ${s.group}: ${s.items.join(", ")}`),
    ``,
    `Full JSON: ${snap.site}/agent.json`,
  ];
  return lines.join("\n");
}
