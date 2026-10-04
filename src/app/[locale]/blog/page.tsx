import type { Metadata } from "next";
import { siteUrl, profile } from "@/lib/site";
import { hreflangAlternates } from "@/lib/locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { requireLocaleParam } from "@/app/[locale]/locale-params";
import { PageChrome } from "@/components/page-chrome";
import { BlogHeader } from "@/components/blog-header";
import { BlogEmptyState } from "@/components/blog-empty-state";

interface LocalePageProps {
  readonly params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: LocalePageProps): Promise<Metadata> {
  const locale = await requireLocaleParam(params);
  const dict = getDictionary(locale);
  return {
    title: dict.blog.title,
    description: dict.meta.blogDescription,
    alternates: {
      canonical: `${siteUrl}/${locale}/blog`,
      languages: hreflangAlternates("/blog", siteUrl),
    },
    openGraph: {
      type: "article",
      url: `${siteUrl}/${locale}/blog`,
      title: dict.blog.title,
      description: dict.meta.blogDescription,
      images: [
        {
          url: "/og-image",
          width: 1200,
          height: 630,
          alt: dict.blog.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${dict.blog.title} · ${profile.name}`,
      description: dict.meta.blogDescription,
      images: [`${siteUrl}/og-image`],
    },
  };
}

export default async function LocalizedBlogPage({ params }: LocalePageProps) {
  const locale = await requireLocaleParam(params);
  const dict = getDictionary(locale);
  return (
    <PageChrome locale={locale} currentPath="/blog" skipLabel={dict.common.skipToContent}>
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 2xl:max-w-[90rem]">
        <BlogHeader locale={locale} />
        <BlogEmptyState locale={locale} />
      </div>
    </PageChrome>
  );
}
