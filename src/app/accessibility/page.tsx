import type { Metadata } from "next";
import { profile, siteUrl } from "@/lib/site";
import { getDictionary } from "@/lib/dictionaries";
import { hreflangAlternates } from "@/lib/locale";
import { AccessibilityStatement } from "@/components/accessibility-statement";

const dict = getDictionary("en");

export const metadata: Metadata = {
  title: "Accessibility",
  description: dict.a11yMetaDescription,
  alternates: {
    canonical: `${siteUrl}/accessibility`,
    languages: hreflangAlternates("/accessibility", siteUrl),
  },
  openGraph: {
    url: `${siteUrl}/accessibility`,
    title: `Accessibility · ${profile.name}`,
    description: dict.a11yMetaDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: `Accessibility · ${profile.name}`,
    description: dict.a11yMetaDescription,
  },
};

export default function AccessibilityPage() {
  return <AccessibilityStatement />;
}
