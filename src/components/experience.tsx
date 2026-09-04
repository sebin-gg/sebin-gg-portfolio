import { timeline } from "@/lib/site";
import { SectionHeading } from "@/components/section-heading";

export function Experience() {
  return (
    <section
      id="experience"
      aria-labelledby="experience-title"
      className="border-line bg-panel/60 border-y"
    >
      <div className="mx-auto w-full max-w-5xl px-4 py-14 sm:px-6 sm:py-16">
        <SectionHeading
          id="experience-title"
          kicker="experience"
          title="Where I've worked & trained"
          lede="Day jobs, student leadership, and the security programs that taught me how attackers think."
        />

        <ol className="border-line relative space-y-10 border-l pl-6 sm:pl-8">
          {timeline.map((item) => (
            <li key={`${item.org}-${item.period}`} className="relative">
              <span
                aria-hidden="true"
                className="border-accent bg-canvas absolute top-1.5 -left-[31px] h-3 w-3 rounded-full border-2 sm:-left-[39px]"
              />
              <p className="text-accent font-mono text-xs tracking-wide uppercase">{item.period}</p>
              <h3 className="text-ink mt-1 text-lg font-semibold">
                {item.title}
                <span className="text-ink-soft font-normal"> · {item.org}</span>
              </h3>
              <ul className="text-ink-soft marker:text-accent mt-2 list-disc space-y-1.5 pl-5 text-[15px] leading-relaxed">
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
