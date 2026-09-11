import type { Metadata } from "next";
import { profile, siteUrl } from "@/lib/site";
import { hreflangAlternates } from "@/lib/locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { PageChrome } from "@/components/page-chrome";
import { BlogHeader } from "@/components/blog-header";
import { BlogEmptyState } from "@/components/blog-empty-state";

const dict = getDictionary("en");

export const metadata: Metadata = {
  title: "Blog",
  description: dict.meta.blogDescription,
  alternates: {
    canonical: `${siteUrl}/blog`,
    languages: hreflangAlternates("/blog", siteUrl),
  },
  openGraph: {
    type: "article",
    url: `${siteUrl}/blog`,
    title: `Blog · ${profile.name}`,
    description: dict.meta.blogDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: `Blog · ${profile.name}`,
    description: dict.meta.blogDescription,
  },
};

export default function BlogPage() {
  return (
    <PageChrome locale="en" currentPath="/blog" skipLabel={dict.common.skipToContent}>
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 2xl:max-w-[90rem]">
        <BlogHeader locale="en" />
        <BlogEmptyState locale="en" />
      </div>
    </PageChrome>
  );
}
