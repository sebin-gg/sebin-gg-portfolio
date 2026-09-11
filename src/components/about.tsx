import { profile } from "@/lib/site";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { DEFAULT_LOCALE, type Locale } from "@/lib/locale";

export function About({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const dict = getDictionary(locale);
  const facts = [
    { label: dict.about.degreeLabel, value: dict.about.degreeValue },
    { label: dict.about.collegeLabel, value: dict.about.collegeValue },
    { label: dict.about.cgpaLabel, value: String(profile.cgpa) },
  ];

  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 2xl:max-w-[90rem]"
    >
      <h2
        id="about-title"
        className="text-ink mt-1 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl"
      >
        {dict.about.title}
      </h2>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.4fr_1fr] xl:grid-cols-[1.6fr_1fr]">
        <div className="text-ink-soft space-y-4 text-base leading-relaxed sm:text-lg">
          {dict.about.bio.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
        </div>

        <aside
          aria-label={dict.about.quickFacts}
          className="border-line/80 bg-panel/80 h-fit rounded-xl border p-5 shadow-lg shadow-black/5 backdrop-blur-xs sm:p-6"
        >
          <h3 className="text-ink mb-4 text-sm font-semibold tracking-wide">
            {dict.about.quickFacts}
          </h3>
          <dl className="space-y-3">
            {facts.map((fact) => (
              <div key={fact.label} className="flex items-baseline justify-between gap-4">
                <dt className="text-ink-faint text-sm">{fact.label}</dt>
                <dd className="text-ink text-sm font-medium">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>
    </section>
  );
}
