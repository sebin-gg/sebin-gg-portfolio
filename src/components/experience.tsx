import Image from "next/image";
import { timeline } from "@/lib/site";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { DEFAULT_LOCALE, type Locale } from "@/lib/locale";
import { SectionHeading } from "@/components/section-heading";

type ExperienceEntryProps = {
  item: (typeof timeline)[number];
  period: string;
  role: string;
  summary: readonly string[];
};

const ExperienceEntry = ({ item, period, role, summary }: ExperienceEntryProps) => (
  <li className="relative flex items-start gap-4">
    <span
      aria-hidden="true"
      className="border-accent bg-canvas ring-canvas absolute top-1.5 -left-[31px] h-3.5 w-3.5 rounded-full border-2 ring-4 sm:-left-[39px]"
    />
    {item.portrait ? (
      <Image
        src={item.portrait.src}
        alt={item.portrait.alt}
        width={item.portrait.width}
        height={item.portrait.height}
        sizes="(min-width: 640px) 5rem, 4rem"
        className="mt-2 h-16 w-16 shrink-0 rounded-full object-cover grayscale sm:h-20 sm:w-20"
      />
    ) : null}
    <div className="min-w-0 flex-1">
      <span className="border-accent/20 bg-accent-soft text-accent inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wider uppercase">
        {period}
      </span>
      <h3 className="text-ink mt-2 text-lg font-semibold">
        {role}
        <span className="text-ink-soft font-normal"> · </span>
        {item.href ? (
          <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="decoration-ink-soft/40 hover:text-accent focus-visible:outline-accent rounded-sm underline underline-offset-4 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            {item.org}
          </a>
        ) : (
          <span className="text-ink-soft font-normal">{item.org}</span>
        )}
      </h3>
      <ul className="text-ink-soft marker:text-accent mt-2.5 list-disc space-y-2 pl-5 text-sm leading-relaxed sm:text-[15px]">
        {summary.map((point) => (
          <li key={point.slice(0, 20)}>{point}</li>
        ))}
      </ul>
    </div>
  </li>
);

export const Experience = ({ locale = DEFAULT_LOCALE }: { readonly locale?: Locale }) => {
  const dict = getDictionary(locale);

  return (
    <section
      id="experience"
      aria-labelledby="experience-title"
      className="border-line bg-panel/60 border-y"
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 2xl:max-w-[90rem]">
        <SectionHeading id="experience-title" title={dict.experience.title} />

        <ol className="border-line/80 relative space-y-7 border-l pl-6 sm:pl-8">
          {timeline.map((item, index) => (
            <ExperienceEntry
              key={`${item.org}-${item.period}`}
              item={item}
              period={dict.experience.periods[index]}
              role={dict.experience.roles[index]}
              summary={dict.experience.summaries[index]}
            />
          ))}
        </ol>
      </div>
    </section>
  );
};
