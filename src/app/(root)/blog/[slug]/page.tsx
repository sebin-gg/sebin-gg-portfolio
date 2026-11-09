import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { blogPosts } from "@/lib/blog";
import { profile, siteUrl } from "@/lib/site";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { PageChrome } from "@/components/page-chrome";
import { BlogPostBody } from "@/components/blog-post-body";

const dict = getDictionary("en");

type PostPageProps = {
  readonly params: Promise<{ slug: string }>;
};

function findPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export const dynamicParams = false;

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
    mainEntityOfPage: `${siteUrl}/blog/${post.slug}`,
    author: { "@type": "Person", name: profile.name, url: siteUrl },
  };
  return (
    <PageChrome locale="en" currentPath="/blog" skipLabel={dict.common.skipToContent}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
