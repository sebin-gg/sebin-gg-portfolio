import { links, projects } from "@/lib/site";
import { SectionHeading } from "@/components/section-heading";
import { ArrowUpRightIcon, ExternalLinkIcon } from "@/components/icons";

export function Projects() {
  return (
    <section
      id="projects"
      aria-labelledby="projects-title"
      className="mx-auto w-full max-w-5xl px-4 py-20 sm:px-6"
    >
      <SectionHeading
        id="projects-title"
        kicker="projects"
        title="Things I've built"
        lede="Selected work from GitHub — repos are public, so the code speaks for itself."
      />

      <ul className="grid gap-5 sm:grid-cols-2">
        {projects.map((project) => (
          <li key={project.name}>
            <article className="group border-line bg-panel focus-within:border-accent hover:border-accent/60 flex h-full flex-col rounded-lg border p-6 shadow-sm transition-colors">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-ink text-lg font-semibold">{project.name}</h3>
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
              <p className="text-accent mt-0.5 text-sm font-medium">{project.tagline}</p>
              {project.highlight ? (
                <p className="bg-accent-soft text-accent mt-2 inline-flex w-fit rounded-full px-2.5 py-0.5 text-xs font-semibold">
                  {project.highlight}
                </p>
              ) : null}
              <p className="text-ink-soft mt-3 flex-1 text-sm leading-relaxed">
                {project.description}
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <ul className="flex flex-wrap gap-1.5">
                  {project.stack.map((tech) => (
                    <li
                      key={tech}
                      className="border-line bg-panel-2 text-ink-soft rounded border px-2 py-0.5 font-mono text-[11px]"
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
