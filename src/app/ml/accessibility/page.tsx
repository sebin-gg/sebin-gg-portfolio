import type { Metadata } from "next";
import { siteUrl } from "@/lib/site";
import { getDictionary } from "@/lib/dictionaries";
import { HTML_LANG, hreflangAlternates } from "@/lib/locale";
import { AccessibilityStatement } from "@/components/accessibility-statement";

const dict = getDictionary("ml");

export const metadata: Metadata = {
  title: dict.a11yTitle,
  description: dict.a11yMetaDescription,
  alternates: {
    canonical: `${siteUrl}/ml/accessibility`,
    languages: hreflangAlternates("/accessibility", siteUrl),
  },
  openGraph: {
    url: `${siteUrl}/ml/accessibility`,
    title: dict.a11yTitle,
    description: dict.a11yMetaDescription,
  },
};

export default function MalayalamAccessibilityPage() {
  return (
    <div lang={HTML_LANG.ml}>
      <AccessibilityStatement locale="ml" />
    </div>
  );
}
