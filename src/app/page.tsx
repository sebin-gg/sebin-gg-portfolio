import type { Metadata } from "next";
import { siteUrl } from "@/lib/site";
import { hreflangAlternates } from "@/lib/locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { PageChrome } from "@/components/page-chrome";
import { Hero } from "@/components/hero";
import { Experience } from "@/components/experience";
import { Projects } from "@/components/projects";
import { Skills } from "@/components/skills";
import { BlogCta } from "@/components/blog-cta";

export const metadata: Metadata = {
  alternates: {
    canonical: siteUrl,
    languages: hreflangAlternates("/", siteUrl),
  },
};

export default function HomePage() {
  const dict = getDictionary("en");
  return (
    <PageChrome locale="en" currentPath="/" skipLabel={dict.common.skipToContent}>
      <Hero locale="en" />
      <Projects locale="en" />
      <Experience locale="en" />
      <Skills locale="en" />
      <BlogCta locale="en" />
    </PageChrome>
  );
}
