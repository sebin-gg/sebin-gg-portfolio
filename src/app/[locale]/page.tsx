import type { Metadata } from "next";
import { siteUrl } from "@/lib/site";
import { SUPPORTED_LOCALES, hreflangAlternates } from "@/lib/locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { requireLocaleParam } from "@/app/[locale]/locale-params";
import { PageChrome } from "@/components/page-chrome";
import { Hero } from "@/components/hero";
import { Experience } from "@/components/experience";
import { Projects } from "@/components/projects";
import { Skills } from "@/components/skills";
import { BlogCta } from "@/components/blog-cta";

interface LocalePageProps {
  readonly params: Promise<{ locale: string }>;
}

/** Prerenders one static page per manifest locale (English excluded — it owns the root). */
export function generateStaticParams(): { locale: string }[] {
  return SUPPORTED_LOCALES.filter((locale) => locale !== "en").map((locale) => ({ locale }));
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
      <Skills locale={locale} />
      <BlogCta locale={locale} />
    </PageChrome>
  );
}
