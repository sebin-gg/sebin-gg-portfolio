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
  { value: "'28", label: "graduating class" },
];

const facts = [
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
      <div className="relative mx-auto w-full max-w-7xl px-4 pt-6 pb-6 sm:px-6 sm:pt-8 sm:pb-8 lg:px-8 lg:pt-10 lg:pb-10 2xl:max-w-[90rem]">
        <div className="grid items-center gap-8 lg:grid-cols-[1.25fr_1fr] lg:gap-12 xl:gap-16">
          <div>
            <Eyebrow>Hello, I&rsquo;m a developer</Eyebrow>
            <h1 className="text-ink text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
              {profile.name}
            </h1>
            <p className="text-ink-soft mt-2.5 text-lg font-medium sm:mt-3 sm:text-xl lg:text-2xl">
              {profile.role}
            </p>
            <p className="text-ink-soft mt-3 max-w-xl text-base leading-relaxed sm:mt-4 sm:text-lg">
              {profile.tagline}
            </p>
            <ul aria-label="Focus areas" className="mt-4 flex flex-wrap gap-1.5 sm:mt-5 sm:gap-2">
              {profile.focus.map((area) => (
                <li
                  key={area}
                  className="border-line/80 bg-panel/80 text-ink-soft hover:border-accent/40 hover:text-ink rounded-full border px-3 py-1 text-xs font-medium backdrop-blur-xs transition-colors sm:text-sm"
                >
                  {area}
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-col gap-3 sm:mt-7">
              {/* Primary action row: cleanly on one line */}
              <div className="flex items-center gap-2.5 sm:gap-3">
                <a
                  href="#projects"
                  className="bg-accent text-accent-ink hover:bg-accent-strong shadow-accent/20 inline-flex items-center justify-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold whitespace-nowrap shadow-md transition-all hover:shadow-lg sm:gap-2 sm:px-5 sm:py-2.5 sm:text-sm"
                >
                  View projects
                  <ArrowUpRightIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </a>
                <a
                  href={resumeUrl}
                  className="border-line/80 bg-panel/90 text-ink hover:border-accent hover:text-accent inline-flex items-center justify-center gap-1.5 rounded-lg border px-3.5 py-2 text-xs font-semibold whitespace-nowrap shadow-xs backdrop-blur-xs transition-all sm:gap-2 sm:px-5 sm:py-2.5 sm:text-sm"
                >
                  <DownloadIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  Download résumé
                </a>
              </div>

              {/* Social media links: neatly lined up in a single row directly below */}
              <div className="flex items-center gap-2 pt-0.5">
                <a
                  href={links.github.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub profile"
                  className="border-line/80 bg-panel/90 text-ink-soft hover:border-accent hover:text-accent flex h-9 w-9 items-center justify-center rounded-lg border shadow-xs backdrop-blur-xs transition-all sm:h-10 sm:w-10"
                >
                  <GithubIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                </a>
                <a
                  href={links.linkedin.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn profile"
                  className="border-line/80 bg-panel/90 text-ink-soft hover:border-accent hover:text-accent flex h-9 w-9 items-center justify-center rounded-lg border shadow-xs backdrop-blur-xs transition-all sm:h-10 sm:w-10"
                >
                  <LinkedinIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                </a>
                <a
                  href={links.x.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X profile"
                  className="border-line/80 bg-panel/90 text-ink-soft hover:border-accent hover:text-accent flex h-9 w-9 items-center justify-center rounded-lg border shadow-xs backdrop-blur-xs transition-all sm:h-10 sm:w-10"
                >
                  <XIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </a>
              </div>
            </div>
          </div>

          <aside
            aria-label="Profile highlights"
            className="border-line/80 bg-panel/80 relative overflow-hidden rounded-2xl border p-5 shadow-xl shadow-black/5 backdrop-blur-md sm:p-6"
          >
            <div
              aria-hidden="true"
              className="from-accent/25 to-accent-soft/40 pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-gradient-to-br blur-2xl sm:-top-20 sm:-right-20 sm:h-56 sm:w-56"
            />
            <div className="relative">
              <div className="flex items-center gap-3.5">
                <span className="from-accent to-accent-strong text-accent-ink shadow-accent/25 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-base font-bold shadow-md sm:h-12 sm:w-12 sm:text-lg">
                  {monogram(profile.name)}
                </span>
                <div>
                  <p className="text-ink text-sm font-semibold">{profile.name}</p>
                  <p className="text-ink-faint text-sm">
                    {profile.collegeShort} · class of {profile.classOf}
                  </p>
                </div>
              </div>

              <dl className="mt-5 space-y-2.5 text-sm sm:mt-6 sm:space-y-3">
                {facts.map((fact) => (
                  <div key={fact.label} className="flex items-baseline justify-between gap-4">
                    <dt className="text-ink-faint">{fact.label}</dt>
                    <dd className="text-ink text-right font-medium">
                      {fact.mailto ? (
                        <a href={links.email.href} className="hover:text-accent transition-colors">
                          {fact.value}
                        </a>
                      ) : (
                        fact.value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </aside>
        </div>

        <dl className="border-line/80 bg-line/80 mt-8 grid grid-cols-3 gap-px overflow-hidden rounded-xl border shadow-sm backdrop-blur-xs sm:mt-10 lg:mt-12">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-panel/90 flex flex-col-reverse px-4 py-3.5 transition-colors sm:px-5 sm:py-4"
            >
              <dt className="text-ink-faint text-xs">{stat.label}</dt>
              <dd className="text-accent text-xl font-bold tracking-tight sm:text-2xl">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
