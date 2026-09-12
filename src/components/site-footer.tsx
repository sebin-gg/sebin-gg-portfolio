import Link from "next/link";
import { links, profile } from "@/lib/site";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { DEFAULT_LOCALE, localePath, type Locale } from "@/lib/locale";
import { GithubIcon, LinkedinIcon, MailIcon, XIcon } from "@/components/icons";

export function SiteFooter({ locale = DEFAULT_LOCALE }: { readonly locale?: Locale }) {
  const dict = getDictionary(locale);
  const year = new Date().getFullYear();
  return (
    <footer lang={locale === DEFAULT_LOCALE ? undefined : locale} className="border-line border-t">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 2xl:max-w-[90rem]">
        <div className="text-ink-soft flex w-full flex-col items-center justify-between gap-4 text-sm sm:flex-row">
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>
              © {year} {profile.name}
            </span>
            <span aria-hidden="true">·</span>
            <Link
              href={localePath(locale, "/accessibility")}
              className="hover:text-accent transition-colors"
            >
              {dict.footer.accessibility}
            </Link>
          </p>

          <div className="flex items-center gap-3">
            <a
              href={links.github.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={dict.footer.githubProfile}
              className="text-ink-soft hover:text-accent rounded-md p-2 transition-colors"
            >
              <GithubIcon className="h-5 w-5" />
            </a>
            <a
              href={links.linkedin.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={dict.footer.linkedinProfile}
              className="text-ink-soft hover:text-accent rounded-md p-2 transition-colors"
            >
              <LinkedinIcon className="h-5 w-5" />
            </a>
            <a
              href={links.x.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={dict.footer.xProfile}
              className="text-ink-soft hover:text-accent rounded-md p-2 transition-colors"
            >
              <XIcon className="h-4 w-4" />
            </a>
            <a
              href={links.email.href}
              aria-label={dict.footer.sendEmail}
              className="text-ink-soft hover:text-accent rounded-md p-2 transition-colors"
            >
              <MailIcon className="h-5 w-5" />
            </a>
          </div>
        </div>
        <p className="text-ink-faint mt-6 text-center text-xs">
          {dict.footer.degree} · {dict.footer.college} · {dict.footer.location}
        </p>
      </div>
    </footer>
  );
}
