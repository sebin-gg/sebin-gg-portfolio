import Image from "next/image";
import { links, profile, projects, resumeUrl } from "@/lib/site";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { DEFAULT_LOCALE, formatString, type Locale } from "@/lib/locale";
import {
  ArrowUpRightIcon,
  DownloadIcon,
  GithubIcon,
  LinkedinIcon,
  MailIcon,
  XIcon,
} from "@/components/icons";

// skipcq: JS-0067 — module-scoped component export, not a global declaration
type Fact = { label: string; value: string; href?: string; mailto?: boolean };

function FactRow({ fact }: { fact: Fact }) {
  return (
    <div className="border-line/70 grid grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] items-baseline gap-3 border-b py-2.5 last:border-0">
      <dt className="text-ink-faint min-w-0">{fact.label}</dt>
      <dd className="text-ink min-w-0 text-right font-medium break-words">
        {fact.href ? (
          <a
            href={fact.href}
            {...(fact.mailto ? {} : { target: "_blank", rel: "noopener noreferrer" })}
            className={`hover:text-accent transition-colors ${fact.mailto ? "text-xs" : ""}`}
          >
            {fact.value}
          </a>
        ) : (
          fact.value
        )}
      </dd>
    </div>
  );
}

function HighlightsCard({
  label,
  name,
  collegeLine,
  facts,
}: {
  label: string;
  name: string;
  collegeLine: string;
  facts: readonly Fact[];
}) {
  return (
    <aside
      aria-label={label}
      className="border-line/80 bg-panel shadow-ink/5 relative grid overflow-hidden rounded-2xl border shadow-xl sm:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden sm:aspect-auto sm:min-h-72">
        <Image
          src="/images/sebin-hero-cover.webp"
          alt={profile.name}
          fill
          sizes="(min-width: 1024px) 18rem, (min-width: 640px) 44vw, calc(100vw - 3rem)"
          className="object-cover object-[center_40%]"
          preload
        />
      </div>
      <div className="relative p-5 sm:p-6">
        <div className="border-accent border-l-2 pl-3">
          <p className="text-ink text-sm font-semibold">{name}</p>
          <p className="text-ink-soft mt-0.5 text-sm">{collegeLine}</p>
        </div>

        <dl className="border-line/70 mt-5 border-t text-sm">
          {facts.map((fact) => (
            <FactRow key={fact.label} fact={fact} />
          ))}
        </dl>
      </div>
    </aside>
  );
}

export function Hero({ locale = DEFAULT_LOCALE }: { readonly locale?: Locale }) {
  const dict = getDictionary(locale);
  const stats = [
    { value: `${projects.length}`, label: dict.hero.statsProjects },
    { value: "'28", label: dict.hero.statsClass },
  ];
  const facts: { label: string; value: string; href?: string; mailto?: boolean }[] = [
    { label: dict.hero.githubLabel, value: links.github.handle, href: links.github.href },
    {
      label: dict.hero.emailLabel,
      value: links.email.handle,
      href: links.email.href,
      mailto: true,
    },
    { label: dict.hero.collegeLabel, value: dict.about.collegeValue },
    { label: dict.about.degreeLabel, value: dict.about.degreeValue },
    { label: dict.about.cgpaLabel, value: String(profile.cgpa) },
  ];

  const collegeLine = formatString(dict.hero.collegeLine, {
    short: profile.collegeShort,
    year: profile.classOf,
  });

  return (
    <section id="top" aria-label={dict.hero.intro} className="relative overflow-hidden">
      {/* Soft radial brand glow, pure CSS so no image download. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_70%_0%,var(--glow),transparent_70%)]"
      />
      <div className="relative mx-auto w-full max-w-7xl px-4 pt-6 pb-6 sm:px-6 sm:pt-8 sm:pb-8 lg:px-8 lg:pt-10 lg:pb-10 2xl:max-w-[90rem]">
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_1.15fr] lg:gap-12 xl:gap-16">
          <div>
            <h1 className="text-ink text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
              {profile.name}
            </h1>
            <p className="text-ink-soft mt-2.5 text-lg font-medium sm:mt-3 sm:text-xl lg:text-2xl">
              {dict.hero.role}
            </p>
            <p className="text-ink-faint mt-1.5 text-sm font-medium sm:text-base">
              {dict.hero.tagline}
            </p>
            <p className="text-ink-soft mt-3 max-w-xl text-base leading-relaxed sm:mt-4 sm:text-lg">
              {dict.about.bio[0]}
            </p>
            <ul
              aria-label={dict.hero.focusAreas}
              className="mt-4 flex flex-wrap gap-1.5 sm:mt-5 sm:gap-2"
            >
              {dict.hero.focus.map((area) => (
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
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                <a
                  href="#projects"
                  className="bg-accent text-accent-ink hover:bg-accent-strong shadow-accent/20 inline-flex items-center justify-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold whitespace-nowrap shadow-md transition-all hover:shadow-lg sm:gap-2 sm:px-5 sm:py-2.5 sm:text-sm"
                >
                  {dict.hero.viewProjects}
                  <ArrowUpRightIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </a>
                <a
                  href={resumeUrl}
                  download="Sebin-Mathew-Resume.pdf"
                  title={dict.hero.downloadResume}
                  className="border-line/80 bg-panel/90 text-ink hover:border-accent hover:text-accent inline-flex items-center justify-center gap-1.5 rounded-lg border px-3.5 py-2 text-xs font-semibold whitespace-nowrap shadow-xs backdrop-blur-xs transition-all sm:gap-2 sm:px-5 sm:py-2.5 sm:text-sm"
                >
                  <DownloadIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  {dict.hero.downloadResume}
                </a>
                <a
                  href={links.email.href}
                  title={links.email.handle}
                  className="border-line/80 bg-panel/90 text-ink hover:border-accent hover:text-accent inline-flex items-center justify-center gap-1.5 rounded-lg border px-3.5 py-2 text-xs font-semibold whitespace-nowrap shadow-xs backdrop-blur-xs transition-all sm:gap-2 sm:px-5 sm:py-2.5 sm:text-sm"
                >
                  <MailIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  {dict.hero.emailMe}
                </a>
              </div>

              {/* Social media links: neatly lined up in a single row directly below */}
              <div className="flex items-center gap-2 pt-0.5">
                <a
                  href={links.github.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={dict.hero.githubProfile}
                  title={`${links.github.label} — ${links.github.handle}`}
                  className="border-line/80 bg-panel/90 text-ink-soft hover:border-accent hover:text-accent flex h-9 w-9 items-center justify-center rounded-lg border shadow-xs backdrop-blur-xs transition-all sm:h-10 sm:w-10"
                >
                  <GithubIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                </a>
                <a
                  href={links.linkedin.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={dict.hero.linkedinProfile}
                  title={`${links.linkedin.label} — ${links.linkedin.handle}`}
                  className="border-line/80 bg-panel/90 text-ink-soft hover:border-accent hover:text-accent flex h-9 w-9 items-center justify-center rounded-lg border shadow-xs backdrop-blur-xs transition-all sm:h-10 sm:w-10"
                >
                  <LinkedinIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                </a>
                <a
                  href={links.x.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={dict.hero.xProfile}
                  title={`${links.x.label} — ${links.x.handle}`}
                  className="border-line/80 bg-panel/90 text-ink-soft hover:border-accent hover:text-accent flex h-9 w-9 items-center justify-center rounded-lg border shadow-xs backdrop-blur-xs transition-all sm:h-10 sm:w-10"
                >
                  <XIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </a>
              </div>
            </div>
          </div>

          <HighlightsCard
            label={dict.hero.highlights}
            name={profile.name}
            collegeLine={collegeLine}
            facts={facts}
          />
        </div>

        <dl className="border-line/80 bg-line/80 mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-xl border shadow-sm backdrop-blur-xs sm:mt-10 lg:mt-12">
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
