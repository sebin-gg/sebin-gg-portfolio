import { links, projects } from "@/lib/site";
import { SectionHeading } from "@/components/section-heading";
import { ArrowUpRightIcon, ExternalLinkIcon } from "@/components/icons";

export function Projects() {
  return (
    <section
      id="projects"
      aria-labelledby="projects-title"
      className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8"
    >
      <SectionHeading
        id="projects-title"
        kicker="projects"
        title="Things I’ve built"
        lede="Open-source repositories with full architecture, tests, and live demos."
      />

      <ul className="grid gap-6 sm:grid-cols-2">
        {projects.map((project, index) => (
          <li key={project.name}>
            <article className="group border-line/80 bg-panel/90 focus-within:border-accent hover:border-accent/60 hover:shadow-accent/5 flex h-full flex-col rounded-xl border p-6 shadow-sm backdrop-blur-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="text-ink-faint text-xs font-semibold tabular-nums"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-ink text-lg font-semibold">{project.name}</h3>
                  {project.highlight ? (
                    <span className="border-accent/20 bg-accent-soft text-accent rounded-full border px-2 py-0.5 text-[11px] font-semibold">
                      {project.highlight}
                    </span>
                  ) : null}
                </div>
                <a
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${project.name} on GitHub`}
                  className="text-ink-faint group-hover:text-accent rounded-md p-1 transition-colors"
                >
                  <ExternalLinkIcon className="h-4 w-4" />
                </a>
              </div>
              <p className="text-accent mt-1 text-sm font-medium">{project.tagline}</p>
              <p className="text-ink-soft mt-2.5 flex-1 text-sm leading-relaxed">
                {project.description}
              </p>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <ul className="flex flex-wrap gap-1.5">
                  {project.stack.map((tech) => (
                    <li
                      key={tech}
                      className="border-line/80 bg-panel-2/90 text-ink-soft hover:border-accent/40 hover:text-ink rounded-md border px-2.5 py-1 text-xs font-medium transition-colors"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
                {project.demo ? (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:text-accent-strong inline-flex items-center gap-1 text-xs font-semibold"
                  >
                    Live demo
                    <ArrowUpRightIcon className="h-3.5 w-3.5" />
                  </a>
                ) : null}
              </div>
            </article>
          </li>
        ))}
      </ul>

      <p className="text-ink-soft mt-8 text-center text-sm">
        More experiments on{" "}
        <a
          href={links.github.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:text-accent-strong font-semibold"
        >
          GitHub {links.github.handle}
        </a>
      </p>
    </section>
  );
}
