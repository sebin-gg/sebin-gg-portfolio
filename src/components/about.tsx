import { profile } from "@/lib/site";
import { Eyebrow } from "@/components/section-heading";

const facts = [
  { label: "Status", value: "Open to work", accent: true },
  { label: "Degree", value: profile.degree },
  { label: "College", value: profile.college },
  { label: "CGPA", value: String(profile.cgpa) },
  { label: "Location", value: profile.location },
];

export function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="mx-auto w-full max-w-5xl px-4 py-20 sm:px-6"
    >
      <Eyebrow>About</Eyebrow>
      <h2 id="about-title" className="text-ink text-2xl font-bold tracking-tight sm:text-3xl">
        Who I am
      </h2>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div className="text-ink-soft space-y-5 leading-relaxed">
          {profile.bio.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
          <p>
            Currently: {profile.degree} at {profile.college} ({profile.classOf}). Open to
            internships, freelance backend work and security-related collabs — email is the fastest
            way to reach me.
          </p>
        </div>

        <aside
          aria-label="Quick facts"
          className="border-line bg-panel h-fit rounded-lg border p-5"
        >
          <h3 className="text-ink-soft mb-4 text-sm font-semibold tracking-wide">Quick facts</h3>
          <dl className="space-y-3">
            {facts.map((fact) => (
              <div key={fact.label} className="flex items-baseline justify-between gap-4">
                <dt className="text-ink-faint text-sm">{fact.label}</dt>
                <dd
                  className={
                    fact.accent
                      ? "text-accent text-sm font-semibold"
                      : "text-ink text-sm font-medium"
                  }
                >
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>
    </section>
  );
}
