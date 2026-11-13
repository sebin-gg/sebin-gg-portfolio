import type { Metadata } from "next";
import { profile, siteUrl } from "@/lib/site";
import { hreflangAlternates } from "@/lib/locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { PageChrome } from "@/components/page-chrome";
import { BlogHeader } from "@/components/blog-header";
import { BlogEmptyState } from "@/components/blog-empty-state";
import { BlogPostList } from "@/components/blog-post-list";
import { blogPosts } from "@/lib/blog";

const dict = getDictionary("en");

export const metadata: Metadata = {
  title: dict.blog.title,
  description: dict.meta.blogDescription,
  alternates: {
    canonical: `${siteUrl}/blog`,
    languages: hreflangAlternates("/blog", siteUrl),
  },
  openGraph: {
    type: "article",
    url: `${siteUrl}/blog`,
    title: `${dict.blog.title} · ${profile.name}`,
    description: dict.meta.blogDescription,
    images: [
      {
        url: "/og-image",
        width: 1200,
        height: 630,
        alt: `${dict.blog.title} · ${profile.name}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${dict.blog.title} · ${profile.name}`,
    description: dict.meta.blogDescription,
  },
};

// skipcq: JS-0067 — module-scoped component export, not a global declaration
export default function BlogPage() {
  return (
    <PageChrome locale="en" currentPath="/blog" skipLabel={dict.common.skipToContent}>
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 2xl:max-w-[90rem]">
        <BlogHeader locale="en" />
        {blogPosts.length > 0 ? <BlogPostList locale="en" /> : <BlogEmptyState locale="en" />}
      </div>
    </PageChrome>
  );
}
