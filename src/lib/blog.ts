/** Blog post catalogue. The RSS route, sitemap and index pages all read from
 * here, so publishing means appending one entry. Bodies are structured blocks;
 * inline text supports the two marks the body renderer understands:
 * `[label](https://url)` links and `**strong**` spans. */
export type BlogPostBlock =
  | { readonly kind: "p"; readonly text: string }
  | { readonly kind: "h2"; readonly text: string }
  | { readonly kind: "list"; readonly items: readonly string[] };

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  body: readonly BlogPostBlock[];
};

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Slugs land raw in route params, index links, RSS and the sitemap, so they
 * must stay unique single URL-safe path segments. Runs at module load — a bad
 * entry fails the build rather than publishing an unreachable post. */
// skipcq: JS-0067 — module-scoped function, not a global declaration
export function assertBlogSlugs(posts: readonly { readonly slug: string }[]): void {
  const seen = new Set<string>();
  for (const post of posts) {
    if (!SLUG_PATTERN.test(post.slug)) {
      throw new Error(`Blog slug must be a lowercase URL-safe segment: ${post.slug}`);
    }
    if (seen.has(post.slug)) {
      throw new Error(`Duplicate blog slug: ${post.slug}`);
    }
    seen.add(post.slug);
  }
}

export const blogPosts: BlogPost[] = [
  {
    slug: "slowlang-a-language-that-punishes-fast-typing",
    title: "I built a programming language that punishes you for typing too fast",
    description:
      "SlowLang is a sarcastic, Python-like language and IDE that enforces slow, mindful typing — winner of TinkerHub Useless Projects 2.0.",
    publishedAt: "2026-11-09",
    body: [
      {
        kind: "p",
        text: "Most programming languages want you to go faster. Faster compile times, faster iteration, faster shipping. So for TinkerHub’s Useless Projects 2.0 hackathon — a Kerala event celebrating gloriously useless software — my teammate [Abin Zachariah Abraham](https://www.linkedin.com/in/abin-zachariah-abraham-124576339/) and I went the other way: we built a language that actively slows you down.",
      },
      {
        kind: "p",
        text: "**SlowLang** (also called TortoiseLang) is a sarcastic, Python-like programming language with its own Tkinter IDE. Its core feature is a typing-speed enforcer: type too fast and it throws errors at you.",
      },
      { kind: "h2", text: "What it actually does" },
      {
        kind: "list",
        items: [
          "It tracks your typing speed in the IDE. Cross the threshold and you get an angry ASCII turtle and a lockout until you calm down.",
          "Error messages are haikus and sarcastic praise instead of stack traces.",
          "There’s a lazy mode that randomly refuses to run, because sometimes the code just isn’t in the mood.",
          "It runs in the browser too — a Pyodide-powered demo mirrors the desktop behavior, no install needed.",
        ],
      },
      {
        kind: "p",
        text: "Under the jokes there’s real engineering: a keyboard-event monitor, a state machine for turtle moods (calm / annoyed / furious), a rage lockout timer, and a pytest suite covering the spec. The browser demo reimplements the same state machine in JavaScript, so both versions behave identically.",
      },
      { kind: "h2", text: "Why build something useless on purpose" },
      {
        kind: "p",
        text: "The hackathon’s whole point was creativity over practicality. Building a joke with craft taught us more than a CRUD app would have: state machines, desktop UI with Tkinter, packaging a Python project properly, and porting the same behavior to a WASM runtime for the web demo. Also, it won — SlowLang took first place at Useless Projects 2.0.",
      },
      {
        kind: "p",
        text: "I wrote about the event itself [on LinkedIn](https://www.linkedin.com/posts/sebin-m_uselessprojects-creativity-innovation-activity-7364503415713943552-sttp) earlier, and posted [the winner announcement](https://www.linkedin.com/posts/sebin-m_excited-to-share-that-our-project-slowlang-activity-7377585860021669888-JQKx) when the results came out.",
      },
      { kind: "h2", text: "Try it / steal it" },
      {
        kind: "list",
        items: [
          "[Browser demo](https://sebin-gg.github.io/slowlang/) — no install, Pyodide under the hood",
          "[Source on GitHub](https://github.com/sebin-gg/slowlang) — Python + Tkinter, tests included",
          "[Also on DEV](https://dev.to/sebin_mathew_33808dbc3817/i-built-a-programming-language-that-punishes-you-for-typing-too-fast-4fj4) — the cross-posted version",
        ],
      },
      {
        kind: "p",
        text: "I’m a B.Tech CS student at College of Engineering Chengannur in Kerala, India. If a sarcastic turtle ever taught you anything about your typing habits, I’d love to hear it.",
      },
    ],
  },
];

// skipcq: JS-0067 — module-scoped function, not a global declaration
export function findPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

assertBlogSlugs(blogPosts);
