import { skills } from "@/lib/site";
import { getDictionary } from "@/lib/dictionaries";
import { DEFAULT_LOCALE, type Locale } from "@/lib/locale";
import { SectionHeading } from "@/components/section-heading";

export function Skills({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const dict = getDictionary(locale);

  return (
    <section
      id="skills"
      aria-labelledby="skills-title"
      className="border-line/80 bg-panel/40 border-y backdrop-blur-xs"
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 2xl:max-w-[90rem]">
        <SectionHeading id="skills-title" title={dict.skillsTitle} />

        <dl className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {skills.map((group, index) => (
            <div key={group.group}>
              <dt className="text-ink text-sm font-semibold tracking-wide">
                {dict.skillGroups[index]}
              </dt>
              <dd className="mt-3.5">
                <ul className="flex flex-wrap gap-2">
                  {dict.skillItems[index].map((skill) => (
                    <li
                      key={skill}
                      className="border-line/80 bg-panel/90 text-ink hover:border-accent/60 hover:bg-accent-soft hover:text-accent rounded-lg border px-3.5 py-1.5 text-sm font-medium shadow-xs backdrop-blur-xs transition-all duration-150 hover:-translate-y-0.5 hover:shadow-sm"
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
