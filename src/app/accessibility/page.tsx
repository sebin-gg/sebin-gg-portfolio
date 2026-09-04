import type { Metadata } from "next";
import Link from "next/link";
import { siteUrl } from "@/lib/site";
import { Eyebrow } from "@/components/section-heading";
import { ArrowUpRightIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Accessibility",
  description: "Accessibility statement and standards for Sebin Mathew’s portfolio.",
  alternates: { canonical: `${siteUrl}/accessibility` },
};

export default function AccessibilityPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <header className="mb-8">
        <Eyebrow>Standards</Eyebrow>
        <h1 className="text-ink text-3xl font-bold tracking-tight sm:text-4xl">
          Accessibility statement
        </h1>
        <p className="text-ink-soft mt-3 text-base leading-relaxed sm:text-lg">
          This portfolio is designed to be lightweight, semantic, and navigable by keyboard, touch,
          and assistive technologies.
        </p>
      </header>

      <div className="border-line/80 bg-panel/70 space-y-6 rounded-xl border p-6 backdrop-blur-xs sm:p-8">
        <section>
          <h2 className="text-ink text-lg font-semibold">Semantic HTML &amp; ARIA</h2>
          <p className="text-ink-soft mt-2 text-sm leading-relaxed">
            All interactive elements use standard native elements (&lt;button&gt;, &lt;a&gt;,
            &lt;nav&gt;) with explicit labels, roles, and focus outlines.
          </p>
        </section>

        <section>
          <h2 className="text-ink text-lg font-semibold">Contrast &amp; theme</h2>
          <p className="text-ink-soft mt-2 text-sm leading-relaxed">
            Both dark and light color palettes adhere to WCAG AA contrast thresholds across all
            typography and interactive states.
          </p>
        </section>

        <section>
          <h2 className="text-ink text-lg font-semibold">Motion preferences</h2>
          <p className="text-ink-soft mt-2 text-sm leading-relaxed">
            The site respects system{" "}
            <code className="text-accent text-xs">prefers-reduced-motion</code> settings, disabling
            non-essential animations for users with vestibular sensitivities.
          </p>
        </section>

        <section>
          <h2 className="text-ink text-lg font-semibold">Performance &amp; privacy</h2>
          <p className="text-ink-soft mt-2 text-sm leading-relaxed">
            Zero third-party trackers, zero advertising scripts, and zero telemetry. Total payload
            is optimized for low-bandwidth 2G/3G connections.
          </p>
        </section>
      </div>

      <div className="mt-8 flex justify-center">
        <Link
          href="/"
          className="border-line/80 bg-panel/90 text-ink hover:border-accent hover:text-accent inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold shadow-xs transition-all"
        >
          Return to portfolio
          <ArrowUpRightIcon className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
