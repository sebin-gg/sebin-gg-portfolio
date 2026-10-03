import { communities } from "@/lib/site";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { DEFAULT_LOCALE, type Locale } from "@/lib/locale";
import { SectionHeading } from "@/components/section-heading";

export function Communities({ locale = DEFAULT_LOCALE }: { readonly locale?: Locale }) {
  const dict = getDictionary(locale);
  return (
    <section
      id="communities"
      aria-labelledby="communities-title"
      className="mx-auto w-full max-w-7xl scroll-mt-20 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 2xl:max-w-[90rem]"
    >
      <SectionHeading
        id="communities-title"
        title={dict.communities.title}
        lede={dict.communities.lede}
      />
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {communities.map((community, index) => (
          <li
            key={community.name}
            className="border-line/80 bg-panel/90 hover:border-accent/60 rounded-xl border p-5 shadow-sm backdrop-blur-xs transition-colors"
          >
            <p className="text-ink font-semibold">{community.name}</p>
            <p className="text-ink-soft mt-1 text-sm">{dict.communities.roles[index]}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
