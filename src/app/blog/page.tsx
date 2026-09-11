import type { Metadata } from "next";
import { profile, siteUrl } from "@/lib/site";
import { getDictionary } from "@/lib/dictionaries";
import { hreflangAlternates } from "@/lib/locale";
import { BlogHeader } from "@/components/blog-header";
import { BlogEmptyState } from "@/components/blog-empty-state";

const dict = getDictionary("en");

export const metadata: Metadata = {
  title: "Blog",
  description: dict.blogMetaDescription,
  alternates: {
    canonical: `${siteUrl}/blog`,
    languages: hreflangAlternates("/blog", siteUrl),
  },
  openGraph: {
    type: "article",
    url: `${siteUrl}/blog`,
    title: `Blog · ${profile.name}`,
    description: dict.blogMetaDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: `Blog · ${profile.name}`,
    description: dict.blogMetaDescription,
  },
};

export default function BlogPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 2xl:max-w-[90rem]">
      <BlogHeader />
      <BlogEmptyState />
    </div>
  );
}
