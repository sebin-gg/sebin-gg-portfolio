import type { Metadata } from "next";
import { profile, siteUrl } from "@/lib/site";
import { BlogEmptyState } from "@/components/blog-empty-state";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Write-ups on security drills, prompt engineering, and shipping fast websites. Coming soon.",
  alternates: { canonical: `${siteUrl}/blog` },
  openGraph: {
    type: "article",
    url: `${siteUrl}/blog`,
    title: `Blog · ${profile.name}`,
    description:
      "Write-ups on security drills, prompt engineering, and shipping fast websites. Coming soon.",
  },
  twitter: {
    card: "summary_large_image",
    title: `Blog · ${profile.name}`,
    description:
      "Write-ups on security drills, prompt engineering, and shipping fast websites. Coming soon.",
  },
};

export default function BlogPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 2xl:max-w-[90rem]">
      <header className="mb-10 flex flex-col items-center text-center">
        <h1 className="text-ink text-3xl font-bold tracking-tight sm:text-4xl">
          Notes &amp; write-ups
        </h1>
        <p className="text-ink-soft mx-auto mt-3 max-w-xl">
          Security walkthroughs, project post-mortems, and performance notes.
        </p>
      </header>
      <BlogEmptyState />
    </div>
  );
}
