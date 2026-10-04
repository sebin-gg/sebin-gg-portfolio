import type { Metadata } from "next";
import { siteUrl } from "@/lib/site";
import { hreflangAlternates } from "@/lib/locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { requireLocaleParam } from "@/app/[locale]/locale-params";
import { PageChrome } from "@/components/page-chrome";
import { AccessibilityStatement } from "@/components/accessibility-statement";

interface LocalePageProps {
  readonly params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: LocalePageProps): Promise<Metadata> {
  const locale = await requireLocaleParam(params);
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
      images: [
        {
          url: "/og-image",
          width: 1200,
          height: 630,
          alt: dict.a11y.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: dict.a11y.title,
      description: dict.meta.a11yDescription,
      images: [`${siteUrl}/og-image`],
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
