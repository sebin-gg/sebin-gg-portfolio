import type { Metadata } from "next";
import { siteUrl } from "@/lib/site";
import { getDictionary } from "@/lib/dictionaries";
import { HTML_LANG, hreflangAlternates } from "@/lib/locale";
import { BlogHeader } from "@/components/blog-header";
import { BlogEmptyState } from "@/components/blog-empty-state";

const dict = getDictionary("hi");

export const metadata: Metadata = {
  title: dict.blogTitle,
  description: dict.blogMetaDescription,
  alternates: {
    canonical: `${siteUrl}/hi/blog`,
    languages: hreflangAlternates("/blog", siteUrl),
  },
  openGraph: {
    type: "article",
    url: `${siteUrl}/hi/blog`,
    title: dict.blogTitle,
    description: dict.blogMetaDescription,
  },
};

export default function HindiBlogPage() {
  return (
    <div
      lang={HTML_LANG.hi}
      className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 2xl:max-w-[90rem]"
    >
      <BlogHeader locale="hi" />
      <BlogEmptyState locale="hi" />
    </div>
  );
}
