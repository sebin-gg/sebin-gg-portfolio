import type { Metadata } from "next";
import { BlogEmptyState } from "@/components/blog-empty-state";
import { Eyebrow } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Write-ups on security drills, prompt engineering, and shipping fast websites. Coming soon.",
};

export default function BlogPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
      <header className="mb-10 flex flex-col items-center text-center">
        <Eyebrow>Blog</Eyebrow>
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
