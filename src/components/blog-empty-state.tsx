import { getDictionary } from "@/lib/dictionaries";
import { DEFAULT_LOCALE, type Locale } from "@/lib/locale";
import { RssIcon } from "@/components/icons";

export function BlogEmptyState({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const dict = getDictionary(locale);

  return (
    <div className="border-line-strong/80 bg-panel/80 mx-auto max-w-2xl rounded-2xl border border-dashed p-8 text-center shadow-lg shadow-black/5 backdrop-blur-xs sm:p-12">
      <div className="from-accent to-accent-strong text-accent-ink shadow-accent/20 mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br shadow-md">
        <RssIcon className="h-6 w-6" />
      </div>
      <h2 className="text-ink mt-5 text-xl font-bold">{dict.emptyTitle}</h2>
      <p className="text-ink-soft mx-auto mt-2 max-w-md text-sm leading-relaxed">
        {dict.emptyBody}
      </p>

      <div className="mt-8 text-left">
        <p className="border-accent/20 bg-accent-soft text-accent inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wider uppercase">
          {dict.pipeline}
        </p>
        <ul className="mt-3 space-y-2.5">
          {dict.planned.map((post) => (
            <li key={post} className="text-ink-soft flex items-start gap-2.5 text-sm">
              <span
                aria-hidden="true"
                className="bg-accent mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
              />
              {post}
            </li>
          ))}
        </ul>
      </div>

      <a
        href="https://github.com/sebin-gg"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-accent text-accent-ink hover:bg-accent-strong shadow-accent/20 mt-8 inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-semibold shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
      >
        {dict.followGithub}
      </a>
    </div>
  );
}
