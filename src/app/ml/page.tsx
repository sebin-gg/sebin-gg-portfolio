import type { Metadata } from "next";
import { siteUrl } from "@/lib/site";
import { getDictionary } from "@/lib/dictionaries";
import { HTML_LANG, hreflangAlternates } from "@/lib/locale";
import { Hero } from "@/components/hero";
import { About } from "@/components/about";
import { Experience } from "@/components/experience";
import { Projects } from "@/components/projects";
import { Skills } from "@/components/skills";
import { BlogCta } from "@/components/blog-cta";

export const metadata: Metadata = {
  title: getDictionary("ml").metaTitle,
  description: getDictionary("ml").metaDescription,
  alternates: {
    canonical: `${siteUrl}/ml`,
    languages: hreflangAlternates("/", siteUrl),
  },
  openGraph: {
    type: "website",
    locale: "ml_IN",
    url: `${siteUrl}/ml`,
    title: getDictionary("ml").metaTitle,
    description: getDictionary("ml").metaDescription,
  },
};

export default function MalayalamHomePage() {
  return (
    <div lang={HTML_LANG.ml}>
      <Hero locale="ml" />
      <Projects locale="ml" />
      <About locale="ml" />
      <Experience locale="ml" />
      <Skills locale="ml" />
      <BlogCta locale="ml" />
    </div>
  );
}
