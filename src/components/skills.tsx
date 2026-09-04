import { skills } from "@/lib/site";
import { SectionHeading } from "@/components/section-heading";

export function Skills() {
  return (
    <section
      id="skills"
      aria-labelledby="skills-title"
      className="border-line/80 bg-panel/40 border-y backdrop-blur-xs"
    >
      <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        <SectionHeading
          id="skills-title"
          kicker="skills"
          title="Toolbox"
          lede="Languages, frameworks, and security tooling in my regular development stack."
        />

        <dl className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((group) => (
            <div key={group.group}>
              <dt className="text-ink text-sm font-semibold tracking-wide">{group.group}</dt>
              <dd className="mt-3.5">
                <ul className="flex flex-wrap gap-2">
                  {group.items.map((skill) => (
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
