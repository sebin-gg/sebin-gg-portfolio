import { getDictionary } from "@/lib/i18n/dictionaries";
import { DEFAULT_LOCALE, type Locale } from "@/lib/locale";
import { BlogFollowActions } from "@/components/blog-follow-actions";

export function BlogHeader({ locale = DEFAULT_LOCALE }: { readonly locale?: Locale }) {
  const dict = getDictionary(locale);

  return (
    <header className="mb-10 flex flex-col items-center text-center">
      <h1 className="text-ink text-3xl font-bold tracking-tight sm:text-4xl">{dict.blog.title}</h1>
      <p className="text-ink-soft mx-auto mt-3 max-w-xl">{dict.blog.lede}</p>
      <BlogFollowActions locale={locale} />
    </header>
  );
}
