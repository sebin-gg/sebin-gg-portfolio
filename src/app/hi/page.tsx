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
  title: getDictionary("hi").metaTitle,
  description: getDictionary("hi").metaDescription,
  alternates: {
    canonical: `${siteUrl}/hi`,
    languages: hreflangAlternates("/", siteUrl),
  },
  openGraph: {
    type: "website",
    locale: "hi_IN",
    url: `${siteUrl}/hi`,
    title: getDictionary("hi").metaTitle,
    description: getDictionary("hi").metaDescription,
  },
};

export default function HindiHomePage() {
  return (
    <div lang={HTML_LANG.hi}>
      <Hero locale="hi" />
      <Projects locale="hi" />
      <About locale="hi" />
      <Experience locale="hi" />
      <Skills locale="hi" />
      <BlogCta locale="hi" />
    </div>
  );
}
