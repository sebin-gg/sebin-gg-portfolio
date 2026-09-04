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
      className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8"
    >
      <div>
        <Eyebrow>About</Eyebrow>
      </div>
      <h2
        id="about-title"
        className="text-ink mt-1 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl"
      >
        Who I am
      </h2>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div className="text-ink-soft space-y-5 text-base leading-relaxed sm:text-lg">
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
          className="border-line/80 bg-panel/80 h-fit rounded-xl border p-5 shadow-lg shadow-black/5 backdrop-blur-xs sm:p-6"
        >
          <h3 className="text-ink mb-4 text-sm font-semibold tracking-wide">Quick facts</h3>
          <dl className="space-y-3">
            {facts.map((fact) => (
              <div key={fact.label} className="flex items-baseline justify-between gap-4">
                <dt className="text-ink-faint text-sm">{fact.label}</dt>
                <dd
                  className={
                    fact.accent
                      ? "border-accent/20 bg-accent-soft text-accent inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold"
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
