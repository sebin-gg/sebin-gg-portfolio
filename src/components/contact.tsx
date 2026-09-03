import { links, profile } from "@/lib/site";
import { GithubIcon, LinkedinIcon, MailIcon, TerminalIcon, XIcon } from "@/components/icons";

export function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="border-line bg-panel/60 border-t"
    >
      <div className="mx-auto w-full max-w-5xl px-4 py-20 text-center sm:px-6">
        <p className="text-accent mb-2 font-mono text-sm"># contact</p>
        <h2 id="contact-title" className="text-ink text-2xl font-bold tracking-tight sm:text-3xl">
          Let&rsquo;s build something
        </h2>
        <p className="text-ink-soft mx-auto mt-3 max-w-xl">
          Internships, freelance backend work, security collabs, or a question about a repo — my
          inbox is open. I reply fastest by email.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href={links.email.href}
            className="bg-accent text-accent-ink hover:bg-accent-strong inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm font-semibold transition-colors"
          >
            <MailIcon className="h-4 w-4" />
            {profile.email}
          </a>
          <a
            href={links.github.href}
            target="_blank"
            rel="noopener noreferrer"
            className="border-line bg-panel text-ink hover:border-accent hover:text-accent inline-flex items-center gap-2 rounded-md border px-5 py-3 text-sm font-semibold transition-colors"
          >
            <GithubIcon className="h-4 w-4" />
            GitHub
          </a>
          <a
            href={links.linkedin.href}
            target="_blank"
            rel="noopener noreferrer"
            className="border-line bg-panel text-ink hover:border-accent hover:text-accent inline-flex items-center gap-2 rounded-md border px-5 py-3 text-sm font-semibold transition-colors"
          >
            <LinkedinIcon className="h-4 w-4" />
            LinkedIn
          </a>
          <a
            href={links.x.href}
            target="_blank"
            rel="noopener noreferrer"
            className="border-line bg-panel text-ink hover:border-accent hover:text-accent inline-flex items-center gap-2 rounded-md border px-5 py-3 text-sm font-semibold transition-colors"
          >
            <XIcon className="h-3.5 w-3.5" />X
          </a>
        </div>

        <p className="text-ink-faint mt-8 flex items-center justify-center gap-2 font-mono text-xs">
          <TerminalIcon className="h-3.5 w-3.5" />
          {profile.location} · IST (UTC+5:30)
        </p>
      </div>
    </section>
  );
}
