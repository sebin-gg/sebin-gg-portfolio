import { getDictionary } from "@/lib/i18n/dictionaries";
import { DEFAULT_LOCALE, localePath, type Locale } from "@/lib/locale";
import { SectionHeading } from "@/components/section-heading";
import { ArrowUpRightIcon } from "@/components/icons";

export function BlogCta({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const dict = getDictionary(locale);

  return (
    <section
      id="blog"
      aria-labelledby="blog-title"
      className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 2xl:max-w-[90rem]"
    >
      <SectionHeading id="blog-title" title={dict.blogCta.title} />

      <a
        href={localePath(locale, "/blog")}
        className="group border-line-strong/80 bg-panel/80 hover:border-accent hover:shadow-accent/5 flex flex-col items-start justify-between gap-4 rounded-2xl border border-dashed p-6 backdrop-blur-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl sm:flex-row sm:items-center sm:p-8"
      >
        <div>
          <p className="border-accent/20 bg-accent-soft text-accent inline-flex rounded-full border px-3 py-1 text-xs font-semibold">
            {dict.blogCta.comingSoon}
          </p>
          <p className="text-ink-soft mt-3 max-w-xl text-sm leading-relaxed">{dict.blogCta.body}</p>
        </div>
        <span className="border-line/80 bg-panel/90 text-ink group-hover:border-accent group-hover:text-accent inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold shadow-xs backdrop-blur-xs transition-all">
          {dict.blogCta.link}
          <ArrowUpRightIcon className="h-4 w-4" />
        </span>
      </a>
    </section>
  );
}
