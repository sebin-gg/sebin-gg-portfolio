import { blogPosts } from "@/lib/blog";
import { DEFAULT_LOCALE, type Locale } from "@/lib/locale";

// skipcq: JS-0067 — module-scoped function, not a global declaration
function formatDate(publishedAt: string, locale: Locale): string {
  return new Date(`${publishedAt}T00:00:00`).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// skipcq: JS-0067 — module-scoped component export, not a global declaration
export function BlogPostList({ locale = DEFAULT_LOCALE }: { readonly locale?: Locale }) {
  return (
    <ul className="mx-auto grid max-w-2xl gap-4">
      {blogPosts.map((post) => (
        <li key={post.slug}>
          <a
            href={`/blog/${post.slug}`}
            className="border-line-strong/80 bg-panel/80 hover:border-accent/40 group block rounded-2xl border p-6 shadow-lg shadow-black/5 backdrop-blur-xs transition-all hover:-translate-y-0.5"
          >
            <h2 className="text-ink group-hover:text-accent text-lg font-bold tracking-tight transition-colors">
              {post.title}
            </h2>
            <p className="text-ink-soft mt-2 text-sm leading-relaxed">{post.description}</p>
            <time
              dateTime={post.publishedAt}
              className="text-ink-faint mt-4 block text-xs font-medium tracking-wider uppercase"
            >
              {formatDate(post.publishedAt, locale)}
            </time>
          </a>
        </li>
      ))}
    </ul>
  );
}
