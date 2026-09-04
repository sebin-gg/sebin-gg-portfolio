import { links, profile } from "@/lib/site";
import { Eyebrow } from "@/components/section-heading";
import { GithubIcon, LinkedinIcon, MailIcon, XIcon } from "@/components/icons";

export function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="border-line/80 bg-panel/40 border-t backdrop-blur-xs"
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-6 text-center sm:px-6 sm:py-8 lg:px-8 2xl:max-w-[90rem]">
        <div className="flex flex-col items-center">
          <Eyebrow>Contact</Eyebrow>
        </div>
        <h2
          id="contact-title"
          className="text-ink mt-1 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl"
        >
          Let&rsquo;s build something
        </h2>
        <p className="text-ink-soft mx-auto mt-3 max-w-xl text-base leading-relaxed sm:text-lg">
          Internships, freelance backend work, security collabs, or a question about a repo — my
          inbox is open. I reply fastest by email.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href={links.email.href}
            className="bg-accent text-accent-ink hover:bg-accent-strong shadow-accent/25 inline-flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            <MailIcon className="h-4 w-4" />
            {profile.email}
          </a>
          <a
            href={links.github.href}
            target="_blank"
            rel="noopener noreferrer"
            className="border-line/80 bg-panel/90 text-ink hover:border-accent hover:text-accent inline-flex items-center gap-2 rounded-lg border px-5 py-3 text-sm font-semibold shadow-xs backdrop-blur-xs transition-all hover:-translate-y-0.5"
          >
            <GithubIcon className="h-4 w-4" />
            GitHub
          </a>
          <a
            href={links.linkedin.href}
            target="_blank"
            rel="noopener noreferrer"
            className="border-line/80 bg-panel/90 text-ink hover:border-accent hover:text-accent inline-flex items-center gap-2 rounded-lg border px-5 py-3 text-sm font-semibold shadow-xs backdrop-blur-xs transition-all hover:-translate-y-0.5"
          >
            <LinkedinIcon className="h-4 w-4" />
            LinkedIn
          </a>
          <a
            href={links.x.href}
            target="_blank"
            rel="noopener noreferrer"
            className="border-line/80 bg-panel/90 text-ink hover:border-accent hover:text-accent inline-flex items-center gap-2 rounded-lg border px-5 py-3 text-sm font-semibold shadow-xs backdrop-blur-xs transition-all hover:-translate-y-0.5"
          >
            <XIcon className="h-3.5 w-3.5" />X
          </a>
        </div>

        <p className="text-ink-faint mt-8 flex items-center justify-center gap-2 text-sm">
          <span aria-hidden="true" className="bg-accent h-1.5 w-1.5 rounded-full" />
          {profile.location} · IST (UTC+5:30)
        </p>
      </div>
    </section>
  );
}
