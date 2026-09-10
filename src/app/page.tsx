import type { Metadata } from "next";
import { siteUrl } from "@/lib/site";
import { Hero } from "@/components/hero";
import { About } from "@/components/about";
import { Experience } from "@/components/experience";
import { Projects } from "@/components/projects";
import { Skills } from "@/components/skills";
import { BlogCta } from "@/components/blog-cta";

export const metadata: Metadata = {
  alternates: { canonical: siteUrl },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <Projects />
      <About />
      <Experience />
      <Skills />
      <BlogCta />
    </>
  );
}
