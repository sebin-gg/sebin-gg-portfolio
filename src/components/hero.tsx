import { links, profile, resumeUrl } from "@/lib/site";
import { Eyebrow } from "@/components/section-heading";
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

const facts = [
  { label: "Status", value: "Open to internships & collabs" },
  { label: "Education", value: `${profile.degree}` },
  { label: "Location", value: profile.location },
  { label: "Email", value: profile.email, mailto: true },
];

function monogram(name: string): string {
  const [first, second] = name.trim().split(/\s+/);
  return (first ? first[0] : "") + (second ? second[0] : "");
}

export function Hero() {
  return (
    <section id="top" aria-label="Introduction" className="relative overflow-hidden">
      {/* Soft radial brand glow, pure CSS so no image download. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_70%_0%,var(--glow),transparent_70%)]"
      />
      <div className="relative mx-auto w-full max-w-5xl px-4 pt-14 pb-16 sm:px-6 sm:pt-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
          <div>
            <Eyebrow>Hello, I&rsquo;m a developer</Eyebrow>
            <h1 className="text-ink text-4xl font-extrabold tracking-tight sm:text-5xl">
              {profile.name}
            </h1>
            <p className="text-ink-soft mt-4 text-xl font-medium sm:text-2xl">{profile.role}</p>
            <p className="text-ink-soft mt-4 max-w-xl text-lg leading-relaxed">{profile.tagline}</p>
            <ul aria-label="Focus areas" className="mt-6 flex flex-wrap gap-2">
              {profile.focus.map((area) => (
                <li
                  key={area}
                  className="border-line bg-panel text-ink-soft rounded-full border px-3 py-1 text-sm"
                >
                  {area}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#projects"
                className="bg-accent text-accent-ink hover:bg-accent-strong inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold transition-colors"
              >
                View projects
                <ArrowUpRightIcon className="h-4 w-4" />
              </a>
              <a
                href={resumeUrl}
                className="border-line bg-panel text-ink hover:border-accent hover:text-accent inline-flex items-center gap-2 rounded-md border px-5 py-2.5 text-sm font-semibold transition-colors"
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

          <aside
            aria-label="Profile highlights"
            className="border-line bg-panel relative overflow-hidden rounded-2xl border p-6 shadow-sm sm:p-8"
          >
            <div
              aria-hidden="true"
              className="from-accent/25 to-accent-soft/40 absolute -top-20 -right-20 h-56 w-56 rounded-full bg-gradient-to-br blur-2xl"
            />
            <div className="relative">
              <div className="flex items-center gap-4">
                <span className="bg-accent text-accent-ink flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg font-bold">
                  {monogram(profile.name)}
                </span>
                <div>
                  <p className="text-ink text-sm font-medium">{profile.name}</p>
                  <p className="text-ink-faint text-sm">
                    {profile.collegeShort} · class of {profile.classOf}
                  </p>
                </div>
              </div>

              <dl className="mt-6 space-y-3 text-sm">
                {facts.map((fact) => (
                  <div key={fact.label} className="flex items-baseline justify-between gap-4">
                    <dt className="text-ink-faint">{fact.label}</dt>
                    <dd className="text-ink text-right font-medium">
                      {fact.mailto ? (
                        <a href={links.email.href} className="hover:text-accent">
                          {fact.value}
                        </a>
                      ) : (
                        fact.value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>

              <a
                href={resumeUrl}
                className="border-line text-ink hover:border-accent hover:text-accent mt-7 inline-flex w-full items-center justify-center gap-2 rounded-md border px-4 py-2.5 text-sm font-semibold transition-colors"
              >
                <DownloadIcon className="h-4 w-4" />
                Résumé (PDF)
              </a>
            </div>
          </aside>
        </div>

        <dl className="border-line bg-line mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-lg border sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-panel flex flex-col-reverse px-5 py-4">
              <dt className="text-ink-faint text-xs">{stat.label}</dt>
              <dd className="text-accent text-2xl font-bold">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
