import { SectionHeading } from "@/components/section-heading";
import { ArrowUpRightIcon } from "@/components/icons";

export function BlogCta() {
  return (
    <section
      id="blog"
      aria-labelledby="blog-title"
      className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 2xl:max-w-[90rem]"
    >
      <SectionHeading
        id="blog-title"
        kicker="Blog"
        title="Notes & write-ups"
        lede="Security walkthroughs, project post-mortems and whatever else survives the draft folder."
      />

      <a
        href="/blog"
        className="group border-line-strong/80 bg-panel/80 hover:border-accent hover:shadow-accent/5 flex flex-col items-start justify-between gap-4 rounded-2xl border border-dashed p-6 backdrop-blur-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl sm:flex-row sm:items-center sm:p-8"
      >
        <div>
          <p className="border-accent/20 bg-accent-soft text-accent inline-flex rounded-full border px-3 py-1 text-xs font-semibold">
            Coming soon
          </p>
          <p className="text-ink mt-3 text-lg font-semibold">The blog is coming soon.</p>
          <p className="text-ink-soft mt-1 max-w-xl text-sm leading-relaxed">
            First posts are planned around OWASP drills, the brevity-prompt extension, and what 2G
            performance budgets taught me. No newsletter spam — just a feed.
          </p>
        </div>
        <span className="border-line/80 bg-panel/90 text-ink group-hover:border-accent group-hover:text-accent inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold shadow-xs backdrop-blur-xs transition-all">
          See what&rsquo;s planned
          <ArrowUpRightIcon className="h-4 w-4" />
        </span>
      </a>
    </section>
  );
}
