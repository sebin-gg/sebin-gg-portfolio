import { getDictionary } from "@/lib/i18n/dictionaries";
import { DEFAULT_LOCALE, type Locale } from "@/lib/locale";
import { RssIcon } from "@/components/icons";

export function BlogFollowActions({ locale = DEFAULT_LOCALE }: { readonly locale?: Locale }) {
  const dict = getDictionary(locale);

  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
      <a
        href="https://github.com/sebin-gg"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-accent text-accent-ink hover:bg-accent-strong shadow-accent/20 inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-semibold shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
      >
        {dict.blog.followGithub}
      </a>
      <a
        href="/rss.xml"
        className="border-line text-ink hover:border-accent hover:text-accent inline-flex items-center justify-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-semibold transition-all hover:-translate-y-0.5"
      >
        <RssIcon className="h-4 w-4" />
        {dict.blog.subscribeRss}
      </a>
    </div>
  );
}
