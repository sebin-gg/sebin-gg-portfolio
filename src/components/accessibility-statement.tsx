import Link from "next/link";
import { getDictionary } from "@/lib/dictionaries";
import { DEFAULT_LOCALE, localePath, type Locale } from "@/lib/locale";
import { ArrowUpRightIcon } from "@/components/icons";

export function AccessibilityStatement({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const dict = getDictionary(locale);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <header className="mb-8">
        <h1 className="text-ink text-3xl font-bold tracking-tight sm:text-4xl">{dict.a11yTitle}</h1>
        <p className="text-ink-soft mt-3 text-base leading-relaxed sm:text-lg">{dict.a11yLede}</p>
      </header>

      <div className="border-line/80 bg-panel/70 space-y-6 rounded-xl border p-6 backdrop-blur-xs sm:p-8">
        <section>
          <h2 className="text-ink text-lg font-semibold">{dict.a11ySemanticTitle}</h2>
          <p className="text-ink-soft mt-2 text-sm leading-relaxed">{dict.a11ySemanticBody}</p>
        </section>

        <section>
          <h2 className="text-ink text-lg font-semibold">{dict.a11yContrastTitle}</h2>
          <p className="text-ink-soft mt-2 text-sm leading-relaxed">{dict.a11yContrastBody}</p>
        </section>

        <section>
          <h2 className="text-ink text-lg font-semibold">{dict.a11yMotionTitle}</h2>
          <p className="text-ink-soft mt-2 text-sm leading-relaxed">
            {dict.a11yMotionBefore}
            <code className="text-accent text-xs">prefers-reduced-motion</code>
            {dict.a11yMotionAfter}
          </p>
        </section>
      </div>

      <div className="mt-8 flex justify-center">
        <Link
          href={localePath(locale, "/")}
          className="border-line/80 bg-panel/90 text-ink hover:border-accent hover:text-accent inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold shadow-xs transition-all"
        >
          {dict.backToPortfolio}
          <ArrowUpRightIcon className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
