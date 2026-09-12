import type { Metadata } from "next";
import { profile, siteUrl } from "@/lib/site";
import { hreflangAlternates } from "@/lib/locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { PageChrome } from "@/components/page-chrome";
import { AccessibilityStatement } from "@/components/accessibility-statement";

const dict = getDictionary("en");

export const metadata: Metadata = {
  title: dict.a11y.title,
  description: dict.meta.a11yDescription,
  alternates: {
    canonical: `${siteUrl}/accessibility`,
    languages: hreflangAlternates("/accessibility", siteUrl),
  },
  openGraph: {
    url: `${siteUrl}/accessibility`,
    title: `${dict.a11y.title} · ${profile.name}`,
    description: dict.meta.a11yDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: `${dict.a11y.title} · ${profile.name}`,
    description: dict.meta.a11yDescription,
  },
};

export default function AccessibilityPage() {
  return (
    <PageChrome locale="en" currentPath="/accessibility" skipLabel={dict.common.skipToContent}>
      <AccessibilityStatement locale="en" />
    </PageChrome>
  );
}
