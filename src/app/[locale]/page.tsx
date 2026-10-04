import type { Metadata } from "next";
import { siteUrl } from "@/lib/site";
import { hreflangAlternates } from "@/lib/locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { requireLocaleParam } from "@/app/[locale]/locale-params";
import { PageChrome } from "@/components/page-chrome";
import { Hero } from "@/components/hero";
import { Experience } from "@/components/experience";
import { Projects } from "@/components/projects";
import { Communities } from "@/components/communities";
import { Recommendations } from "@/components/recommendations";
import { Skills } from "@/components/skills";
import { Terminal } from "@/components/terminal";
import { BlogCta } from "@/components/blog-cta";

interface LocalePageProps {
  readonly params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: LocalePageProps): Promise<Metadata> {
  const locale = await requireLocaleParam(params);
  const dict = getDictionary(locale);
  return {
    title: dict.meta.title,
    description: dict.meta.description,
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: hreflangAlternates("/", siteUrl),
    },
    openGraph: {
      type: "website",
      url: `${siteUrl}/${locale}`,
      title: dict.meta.title,
      description: dict.meta.description,
      images: [
        {
          url: "/og-image",
          width: 1200,
          height: 630,
          alt: dict.meta.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.title,
      description: dict.meta.description,
      images: [`${siteUrl}/og-image`],
    },
  };
}

export default async function LocalizedHomePage({ params }: LocalePageProps) {
  const locale = await requireLocaleParam(params);
  const dict = getDictionary(locale);
  return (
    <PageChrome locale={locale} currentPath="/" skipLabel={dict.common.skipToContent}>
      <Hero locale={locale} />
      <Projects locale={locale} />
      <Experience locale={locale} />
      <Communities locale={locale} />
      <Recommendations locale={locale} />
      <Skills locale={locale} />
      <Terminal locale={locale} />
      <BlogCta locale={locale} />
    </PageChrome>
  );
}
