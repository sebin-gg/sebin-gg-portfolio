import { RssIcon } from "@/components/icons";

const planned = [
  "OWASP Bootcamp 2025: what a phishing drill actually taught me",
  "Inside brevity-prompt: cutting 40–65% of tokens with pure regex",
  "Shipping a portfolio that loads on 2G — budgets, fonts, trade-offs",
  "Local AI on the edge: building Aegis' Ollama pipeline",
];

export function BlogEmptyState() {
  return (
    <div className="border-line-strong/80 bg-panel/80 mx-auto max-w-2xl rounded-2xl border border-dashed p-8 text-center shadow-lg shadow-black/5 backdrop-blur-xs sm:p-12">
      <div className="from-accent to-accent-strong text-accent-ink shadow-accent/20 mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br shadow-md">
        <RssIcon className="h-6 w-6" />
      </div>
      <h2 className="text-ink mt-5 text-xl font-bold">No posts yet — this space is warming up</h2>
      <p className="text-ink-soft mx-auto mt-2 max-w-md text-sm leading-relaxed">
        I&rsquo;m drafting the first few write-ups. They&rsquo;ll land here, one at a time, as I
        finish them. If you want to know when that happens, the cheapest way is watching this repo
        on GitHub.
      </p>

      <div className="mt-8 text-left">
        <p className="border-accent/20 bg-accent-soft text-accent inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wider uppercase">
          In the pipeline
        </p>
        <ul className="mt-3 space-y-2.5">
          {planned.map((post) => (
            <li key={post} className="text-ink-soft flex items-start gap-2.5 text-sm">
              <span
                aria-hidden="true"
                className="bg-accent mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
              />
              {post}
            </li>
          ))}
        </ul>
      </div>

      <a
        href="https://github.com/sebin-gg"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-accent text-accent-ink hover:bg-accent-strong shadow-accent/20 mt-8 inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-semibold shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
      >
        Follow on GitHub
      </a>
    </div>
  );
}
