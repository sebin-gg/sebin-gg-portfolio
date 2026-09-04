import { timeline } from "@/lib/site";
import { SectionHeading } from "@/components/section-heading";

export function Experience() {
  return (
    <section
      id="experience"
      aria-labelledby="experience-title"
      className="border-line bg-panel/60 border-y"
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 2xl:max-w-[90rem]">
        <SectionHeading
          id="experience-title"
          kicker="experience"
          title="Where I’ve worked & trained"
          lede="Campus engineering leadership, hackathons, and security programs."
        />

        <ol className="border-line/80 relative space-y-7 border-l pl-6 sm:pl-8">
          {timeline.map((item) => (
            <li key={`${item.org}-${item.period}`} className="relative">
              <span
                aria-hidden="true"
                className="border-accent bg-canvas ring-canvas absolute top-1.5 -left-[31px] h-3.5 w-3.5 rounded-full border-2 ring-4 sm:-left-[39px]"
              />
              <div>
                <span className="border-accent/20 bg-accent-soft text-accent inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wider uppercase">
                  {item.period}
                </span>
              </div>
              <h3 className="text-ink mt-2 text-lg font-semibold">
                {item.title}
                <span className="text-ink-soft font-normal"> · {item.org}</span>
              </h3>
              <ul className="text-ink-soft marker:text-accent mt-2.5 list-disc space-y-2 pl-5 text-sm leading-relaxed sm:text-[15px]">
                {item.summary.map((point) => (
                  <li key={point.slice(0, 20)}>{point}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
