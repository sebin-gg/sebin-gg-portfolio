import { links, profile } from "@/lib/site";
import { GithubIcon, LinkedinIcon, MailIcon, XIcon } from "@/components/icons";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-line border-t">
      <div className="text-ink-soft mx-auto flex w-full max-w-5xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm sm:flex-row sm:px-6">
        <p>
          © {year} {profile.name}. Built with the T3 stack core — Next.js, TypeScript, Tailwind.
        </p>
        <div className="flex items-center gap-3">
          <a
            href={links.github.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            className="text-ink-soft hover:text-accent rounded-md p-2 transition-colors"
          >
            <GithubIcon className="h-5 w-5" />
          </a>
          <a
            href={links.linkedin.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile"
            className="text-ink-soft hover:text-accent rounded-md p-2 transition-colors"
          >
            <LinkedinIcon className="h-5 w-5" />
          </a>
          <a
            href={links.x.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X profile"
            className="text-ink-soft hover:text-accent rounded-md p-2 transition-colors"
          >
            <XIcon className="h-4 w-4" />
          </a>
          <a
            href={links.email.href}
            aria-label="Send an email"
            className="text-ink-soft hover:text-accent rounded-md p-2 transition-colors"
          >
            <MailIcon className="h-5 w-5" />
          </a>
        </div>
        <p className="text-ink-faint text-xs">Open to work · no telemetry, as it should be</p>
      </div>
    </footer>
  );
}
