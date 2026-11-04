import { links } from "@/lib/site";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { DEFAULT_LOCALE, type Locale } from "@/lib/locale";
import { SectionHeading } from "@/components/section-heading";
import { ArrowUpRightIcon, MailIcon } from "@/components/icons";

export function Contact({ locale = DEFAULT_LOCALE }: { readonly locale?: Locale }) {
  const dict = getDictionary(locale);

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 2xl:max-w-[90rem]"
    >
      <SectionHeading id="contact-title" title={dict.contact.title} />

      <div className="border-line-strong/80 bg-panel/80 flex flex-col items-start justify-between gap-4 rounded-2xl border p-6 backdrop-blur-xs sm:flex-row sm:items-center sm:p-8">
        <div>
          <p className="border-accent/20 bg-accent-soft text-accent inline-flex rounded-full border px-3 py-1 text-xs font-semibold">
            {dict.contact.availability}
          </p>
          <p className="text-ink-soft mt-3 max-w-xl text-sm leading-relaxed">{dict.contact.body}</p>
          <a
            href={links.email.href}
            className="text-ink hover:text-accent mt-3 inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
          >
            <MailIcon className="h-4 w-4" />
            {links.email.handle}
          </a>
        </div>
        <a
          href={links.email.href}
          className="bg-accent text-accent-ink hover:bg-accent-strong shadow-accent/20 inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold whitespace-nowrap shadow-md transition-all hover:shadow-lg"
        >
          {dict.contact.cta}
          <ArrowUpRightIcon className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
}
