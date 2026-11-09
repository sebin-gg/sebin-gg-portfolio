import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { blogPosts, findPost } from "@/lib/blog";
import { profile, siteUrl } from "@/lib/site";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { PageChrome } from "@/components/page-chrome";
import { BlogPostBody } from "@/components/blog-post-body";

const dict = getDictionary("en");

type PostPageProps = {
  readonly params: Promise<{ slug: string }>;
};

// skipcq: JS-0067 — module-scoped export, not a global declaration
export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export const dynamicParams = false;

// skipcq: JS-0067 — module-scoped export, not a global declaration
export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = findPost(slug);
  if (!post) {
    return {};
  }
  const url = `${siteUrl}/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description: post.description,
      publishedTime: post.publishedAt,
      authors: [profile.name],
      images: [{ url: "/og-image", width: 1200, height: 630, alt: post.title }],
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.description },
  };
}

// skipcq: JS-0067 — module-scoped component export, not a global declaration
export default async function BlogPostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = findPost(slug);
  if (!post) {
    notFound();
  }
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    image: `${siteUrl}/og-image`,
    mainEntityOfPage: `${siteUrl}/blog/${post.slug}`,
    author: { "@type": "Person", name: profile.name, url: siteUrl },
    publisher: {
      "@type": "Person",
      name: profile.name,
      url: siteUrl,
    },
  };
  const postJsonLdScript = (
    <script
      type="application/ld+json"
      // skipcq: JS-0440 — static JSON.stringify output, no user input
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
    />
  );
  return (
    <PageChrome locale="en" currentPath="/blog" skipLabel={dict.common.skipToContent}>
      {/* JSON.stringify output with `<` escaped is inert markup — the same
          pattern the root layout uses for its site-wide JSON-LD. */}
      {postJsonLdScript}
      <article className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6">
        <header className="mb-8">
          <h1 className="text-ink text-3xl font-bold tracking-tight sm:text-4xl">{post.title}</h1>
          <time
            dateTime={post.publishedAt}
            className="text-ink-faint mt-3 block text-sm font-medium"
          >
            {new Date(`${post.publishedAt}T00:00:00`).toLocaleDateString("en", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </header>
        <BlogPostBody blocks={post.body} />
      </article>
    </PageChrome>
  );
}
