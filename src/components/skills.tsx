import { skills } from "@/lib/site";
import { SectionHeading } from "@/components/section-heading";

export function Skills() {
  return (
    <section
      id="skills"
      aria-labelledby="skills-title"
      className="border-line bg-panel/60 border-y"
    >
      <div className="mx-auto w-full max-w-5xl px-4 py-20 sm:px-6">
        <SectionHeading
          id="skills-title"
          kicker="skills"
          title="Toolbox"
          lede="Languages and tools I reach for, grouped the way I think about them."
        />

        <dl className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((group) => (
            <div key={group.group}>
              <dt className="text-ink text-sm font-semibold tracking-wide">{group.group}</dt>
              <dd className="mt-3">
                <ul className="flex flex-wrap gap-2">
                  {group.items.map((skill) => (
                    <li
                      key={skill}
                      className="border-line bg-panel text-ink hover:border-accent/60 hover:text-accent rounded-md border px-3 py-1.5 text-sm transition-colors"
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
