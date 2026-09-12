import type { Metadata } from "next";
import { siteUrl } from "@/lib/site";
import { SUPPORTED_LOCALES, hreflangAlternates } from "@/lib/locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { requireLocaleParam } from "@/app/[locale]/locale-params";
import { PageChrome } from "@/components/page-chrome";
import { AccessibilityStatement } from "@/components/accessibility-statement";

interface LocalePageProps {
  readonly params: Promise<{ locale: string }>;
}

export function generateStaticParams(): { locale: string }[] {
  return SUPPORTED_LOCALES.filter((locale) => locale !== "en").map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LocalePageProps): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(locale);
  return {
    title: dict.a11y.title,
    description: dict.meta.a11yDescription,
    alternates: {
      canonical: `${siteUrl}/${locale}/accessibility`,
      languages: hreflangAlternates("/accessibility", siteUrl),
    },
    openGraph: {
      url: `${siteUrl}/${locale}/accessibility`,
      title: dict.a11y.title,
      description: dict.meta.a11yDescription,
    },
  };
}

export default async function LocalizedAccessibilityPage({ params }: LocalePageProps) {
  const locale = await requireLocaleParam(params);
  const dict = getDictionary(locale);
  return (
    <PageChrome locale={locale} currentPath="/accessibility" skipLabel={dict.common.skipToContent}>
      <AccessibilityStatement locale={locale} />
    </PageChrome>
  );
}
