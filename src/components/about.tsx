import { profile } from "@/lib/site";

export function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="mx-auto w-full max-w-5xl px-4 py-20 sm:px-6"
    >
      <p className="text-accent mb-2 font-mono text-sm"># about</p>
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

        <aside className="border-line bg-panel h-fit rounded-lg border p-5 font-mono text-sm">
          <p className="text-ink-soft">
            <span className="text-accent">$</span> whoami --details
          </p>
          <dl className="text-ink mt-3 space-y-2">
            <div>
              <dt className="text-ink-faint inline">name&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: </dt>
              <dd className="inline">{profile.name}</dd>
            </div>
            <div>
              <dt className="text-ink-faint inline">based&nbsp;&nbsp;&nbsp;&nbsp;: </dt>
              <dd className="inline">{profile.location}</dd>
            </div>
            <div>
              <dt className="text-ink-faint inline">degree&nbsp;&nbsp;&nbsp;: </dt>
              <dd className="inline">{profile.degree}</dd>
            </div>
            <div>
              <dt className="text-ink-faint inline">cgpa&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: </dt>
              <dd className="inline">{profile.cgpa}</dd>
            </div>
            <div>
              <dt className="text-ink-faint inline">status&nbsp;&nbsp;&nbsp;: </dt>
              <dd className="text-accent inline">open to work</dd>
            </div>
          </dl>
        </aside>
      </div>
    </section>
  );
}
