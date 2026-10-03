import { recommendations } from "@/lib/site";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { DEFAULT_LOCALE, type Locale } from "@/lib/locale";
import { SectionHeading } from "@/components/section-heading";

/**
 * Kind words section. Returns nothing while `recommendations` is empty,
 * so no invented praise ever ships.
 */
export function Recommendations({ locale = DEFAULT_LOCALE }: { readonly locale?: Locale }) {
  if (recommendations.length === 0) return null;
  const dict = getDictionary(locale);
  return (
    <section
      id="kind-words"
      aria-labelledby="kind-words-title"
      className="border-line bg-panel/60 scroll-mt-20 border-y"
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 2xl:max-w-[90rem]">
        <SectionHeading id="kind-words-title" title={dict.recommendations.title} />
        <ul className="grid gap-4 sm:grid-cols-2">
          {recommendations.map((item) => (
            <li key={item.name}>
              <figure className="border-line/80 bg-panel/90 h-full rounded-xl border p-6 shadow-sm backdrop-blur-xs">
                <blockquote className="text-ink-soft text-sm leading-relaxed">
                  “{item.quote}”
                </blockquote>
                <figcaption className="text-ink-faint mt-4 text-xs font-semibold tracking-wide uppercase">
                  {item.name} · {item.context}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
