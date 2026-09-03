import { links, profile, resumeUrl } from "@/lib/site";
import { TerminalCard } from "@/components/terminal-card";
import {
  ArrowUpRightIcon,
  DownloadIcon,
  GithubIcon,
  LinkedinIcon,
  XIcon,
} from "@/components/icons";

const stats = [
  { value: `${profile.cgpa}`, label: "B.Tech CGPA" },
  { value: "6+", label: "projects shipped" },
  { value: "3", label: "hackathons & security programs" },
  { value: "'28", label: "graduating class" },
];

export function Hero() {
  return (
    <section id="top" aria-label="Introduction" className="relative overflow-hidden">
      {/* Faint grid backdrop, pure CSS so no image download. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--line)_1px,transparent_1px),linear-gradient(to_bottom,var(--line)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)] bg-[size:44px_44px] opacity-40"
      />
      <div className="relative mx-auto w-full max-w-5xl px-4 pt-16 pb-16 sm:px-6 sm:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <p className="text-accent mb-4 font-mono text-sm">
              <span className="text-ink-faint">#</span> hello, world
            </p>
            <h1 className="text-ink text-4xl font-extrabold tracking-tight sm:text-5xl">
              {profile.name}
              <span className="text-ink-soft block font-mono text-lg font-medium sm:text-xl">
                {profile.role}
              </span>
            </h1>
            <p className="text-ink-soft mt-5 max-w-xl text-lg leading-relaxed">{profile.tagline}</p>
            <ul aria-label="Focus areas" className="mt-5 flex flex-wrap gap-2">
              {profile.focus.map((area) => (
                <li
                  key={area}
                  className="border-line bg-panel text-accent rounded-full border px-3 py-1 font-mono text-xs"
                >
                  {area}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#projects"
                className="bg-accent text-accent-ink hover:bg-accent-strong inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold transition-colors"
              >
                View projects
                <ArrowUpRightIcon className="h-4 w-4" />
              </a>
              <a
                href={resumeUrl}
                className="border-line bg-panel text-ink hover:border-accent hover:text-accent inline-flex items-center gap-2 rounded-md border px-4 py-2.5 text-sm font-semibold transition-colors"
              >
                <DownloadIcon className="h-4 w-4" />
                Download résumé
              </a>
              <span className="bg-line mx-1 hidden h-5 w-px sm:block" aria-hidden="true" />
              <a
                href={links.github.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub profile"
                className="border-line bg-panel text-ink-soft hover:border-accent hover:text-accent rounded-md border p-2.5 transition-colors"
              >
                <GithubIcon className="h-5 w-5" />
              </a>
              <a
                href={links.linkedin.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn profile"
                className="border-line bg-panel text-ink-soft hover:border-accent hover:text-accent rounded-md border p-2.5 transition-colors"
              >
                <LinkedinIcon className="h-5 w-5" />
              </a>
              <a
                href={links.x.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X profile"
                className="border-line bg-panel text-ink-soft hover:border-accent hover:text-accent rounded-md border p-2.5 transition-colors"
              >
                <XIcon className="h-4 w-4" />
              </a>
            </div>
          </div>
          <TerminalCard />
        </div>

        <dl className="border-line bg-line mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-lg border sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-panel flex flex-col-reverse px-5 py-4">
              <dt className="text-ink-faint text-xs">{stat.label}</dt>
              <dd className="text-accent font-mono text-2xl font-bold">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
