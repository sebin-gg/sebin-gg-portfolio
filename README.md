# sebin-gg portfolio

Personal portfolio for **Sebin Mathew** — B.Tech CS student at College of Engineering Chengannur,
building full-stack apps, Chrome extensions and security tooling. Content comes from the résumé
PDF (see `docs/`) and the [GitHub profile](https://github.com/sebin-gg).

Built on the **T3 stack core**: Next.js (App Router) + TypeScript + Tailwind CSS — static-first on
purpose. No tRPC/Prisma/NextAuth yet: there is no database, so shipping those today would only add
bundle weight. The day the blog gets a real backend, they bolt on cleanly.

## Stack decisions

| Choice                                        | Why                                                                                                                                                                |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Static-first (no tRPC client)                 | Every KB counts on 2G/3G. tRPC + zod + superjson ≈ 15–25 kB gzip of JS with zero payoff when content is static. Server components render everything.               |
| No image files                                | Terminal/grid visuals are pure CSS gradients — nothing to download.                                                                                                |
| Self-hosted variable fonts via `next/font`    | One small woff2 subset per family, `display: swap`, no third-party font CDN request.                                                                               |
| Class-based dark mode with inline init script | **Dark by default**, light is an explicit toggle — applied before first paint, no theme flash.                                                                     |
| Tiny client islands, hydrating on idle        | Header widgets (theme toggle, menu, scroll-spy, nav) render on the client but hydrate only after the main thread goes idle. Everything else is a server component. |
| Typographic apostrophes                       | `&rsquo;` in copy, not ASCII `'` — reads human and keeps lint happy.                                                                                               |

## Quickstart

```bash
pnpm install            # deps
pnpm dev                # http://localhost:3000
pnpm test:unit:fast    # unit tests, no coverage (inner loop)
pnpm test:e2e:local    # fast E2E (chromium + firefox + mobile, no webkit)
```

Fast loops: `test:unit:fast` skips coverage, `test:e2e:local` skips WebKit
(which needs system libs Fedora lacks — CI still runs it). Full gates stay in
`pnpm check:all`, whose independent steps run in parallel.

`bash scripts/setup.sh` does the whole first-time dance (deps, Chromium, résumé copy).

## Quality gates (the short version)

```bash
pnpm check:all    # static gates ∥ unit+build+browsers ∥ CRAP → e2e → terminal/thorium → CWV matrix
pnpm test:mutation    # Stryker mutation score (slow; also runs in CI on main)
pnpm perf:audit       # lhci budgets + floors, simulated slow-4G mobile, / + /blog (needs CHROME_PATH)
pnpm perf:quick       # 8-run Lighthouse subset (both routes × both devices, 4G dark) for fast local loops
pnpm perf:matrix      # full 288-run matrix, nightly in CI (PRs run budgets + perf:quick instead)
pnpm test:perf        # live Core Web Vitals matrix with real CDP network + CPU throttling
node scripts/visual-check.mjs   # screenshots + horizontal-overflow check
```

CI (all green required on `main`, which is branch-protected): `ci.yml`
(lint/typecheck/format/unit/build, e2e matrix across chromium/firefox/webkit/mobile, terminal
browsers), `perf.yml` (budgets + quick subset on PRs, full matrix nightly), `mutation.yml`,
`codeql.yml`, `browsers-nightly.yml` (puppeteer-core sweep over installed Chrome-family
browsers). SonarCloud analyzes pull requests through its GitHub App integration — no workflow
file (a sonar.yml workflow previously produced phantom zero-job push runs on main, so it was
removed). Dependabot is the sole dependency bot (grouped updates, majors ignored).

## Testing

- **Unit** — Vitest + Testing Library (jsdom). Coverage gate: ≥85 % lines/stmts, ≥80 % functions,
  ≥75 % branches on `src/lib` + `src/components` (currently ~98 %). Thresholds are set so that the
  **CRAP score** (`c²·(1−cov)³ + c`) stays under **6** for every function given the ESLint
  complexity cap of 4 (`pnpm crap:gate`).
- **Mutation** — StrykerJS with the Vitest runner mutates `src/lib` + `src/components`
  (string-literal mutants excluded — copy is for human review). Break threshold 60 %.
- **E2E** — Playwright, four projects (desktop Chromium, desktop Firefox, WebKit/Safari
  engine, iPhone-12 viewport). It renders the real production build, clicks _every_ button and
  internal link on the page with zero console/page errors (sync waits, no fixed sleeps), asserts
  every hash anchor resolves to an element, checks the résumé PDF downloads with
  `application/pdf`, verifies theme persistence and the no-FOUC init script, covers the blog
  "coming soon" state, per-page share tags, the 404 page (incl. its `noindex`), and social meta
  tags with OG image dimensions. Beyond Playwright: a terminal-browser check (lynx/w3m/links,
  zero JS) and a puppeteer-core sweep over installed Chrome-family browsers (Thorium, Brave,
  Edge, …).

## Performance

Measured with Lighthouse (see `budgets.json`, `lighthouserc.js`, and
`scripts/perf-lighthouse-matrix.mjs`):

- Total transfer ≈ **220 kB** (JS + inline CSS + 2 self-hosted fonts — no images)
- FCP ≈ 0.5–1.3 s · LCP ≈ 0.4–2.5 s · CLS = 0 · TBT ≈ 0–30 ms (simulated), ~30 ms at 4× real throttle
- `pnpm perf:matrix` sweeps every theme × network × CPU × device × mode combo:
  **Performance = 100** wherever physics allows (mobile 2G/20× included), **Accessibility,
  Best Practices and SEO = 100 in every single combination** — dark and light, mobile and desktop.
  Only exempted rows are desktop 2G (~88–91, 450 kbps cap on desktop curves) and 20× CPU
  (~87–96), where 100 is impossible by definition.

Why it stays fast on 2G/3G: no images, one self-hosted variable sans font preloaded (the LCP
family) while the mono family loads non-blocking, zero client libraries, CSS inlined via
`experimental.inlineCss` (one less round-trip on cold 2G loads), and the header's interactive
widgets hydrate only after the main thread goes idle so their work lands outside the
FCP → TTI window.

> Running Lighthouse locally while other apps peg the CPU inflates the simulated TBT. On an idle
> machine scores sit in the high 80s–90s; CI (clean runner, median of 3) is the source of truth.

## Agent productivity tools (speed + token reduction)

The repo is set up for agent-friendly work. Skills live in `.agents/skills/` (locked in
`skills-lock.json`); agents load them with the `skill` tool. `AGENTS.md` tells agents which ones
to use when working here.

| Tool / skill | What it does                                                                    | How to use                                                               |
| ------------ | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `caveman`    | Token-reducing terse mode — cuts output tokens while keeping technical accuracy | Load `skill:caveman`; levels `lite / full / ultra`; `/caveman off` exits |
| `unslop`     | Strips AI tells / redundancy from user-visible copy, with bundled scanners      | `skill:unslop`; `scripts/banned_phrase_scan.py` etc. for audits          |

Install any community skill into the repo:

```bash
npx skills add <owner/repo> --list       # preview a repo's skills
npx skills add <owner/repo> --skill <name> --yes   # install into .agents/skills/
```

Related speed tooling: `pnpm perf:matrix` (the full Lighthouse sweep), `pnpm test:perf`
(live Core Web Vitals with real throttling), and the pre-commit hook (Husky + lint-staged) that
formats and lints staged files so pushes stay green.

## Translations (i18n)

English is canonical at `/`, `/blog`, `/accessibility`. Other locales prerender
under their prefix (`/hi`, `/ml/blog`, …) from committed JSON dictionaries in
`src/lib/i18n/` — no client-side translation code, pages stay fully static.

- Translatable prose/UI copy lives in `src/lib/i18n/en.json` (the source of
  truth); structural data, links, identity and other facts stay in
  `src/lib/site.ts`. `manifest.json` lists the live locales (routes, switcher,
  hreflang and sitemap all derive from it).
- `gt.config.json` + `.github/workflows/i18n.yml` automate the rest via
  [General Translation](https://generaltranslation.com): `gt translate` refreshes
  the JSON files and opens a review PR. Needs `GT_API_KEY` / `GT_PROJECT_ID`
  secrets (local runs read `.env.local`, which is gitignored).
- Quota: the free allowance is one-time and does not reset — when it is
  exhausted, add a payment method (usage-based) or keep maintaining the seed
  files by hand. Every `gt translate` failure is non-blocking by design: the
  workflow logs a warning, keeps the committed translations, and still opens a
  review PR if any files changed. Review machine output before merging,
  especially for locales you care about.
- Adding a locale: append it to `gt.config.json` `locales`, run `gt translate`,
  add the file to `manifest.json` and the loader registry. Never publish an
  untranslated (English-copy) file under a localized URL.

GitHub repo (public, MIT), Vercel deploys on `main`, CodeRabbit + SonarCloud GitHub Apps installed,
CodeQL workflow live, Dependabot grouped updates on, `main` branch-protected with 9 required
checks. Review bots Sourcery, Greptile and DeepSource need a one-click install each
(`bash scripts/links.sh` opens them); their configs already ship in the repo. Still manual: uninstall the Renovate app (superseded by Dependabot), click Verify in
Search Console, import the site into Bing Webmaster.

## Project layout

```
src/
  app/            # routes: / (hero → projects → about → experience → skills → blog CTA),
                  # /blog (coming soon), /accessibility, /[locale]/* (ta/es/fr/de), 404,
                  # sitemap, robots, icon, opengraph-image, manifest
  components/     # server components + small client islands (header widgets hydrate on idle)
  lib/            # site.ts (structure, links, facts), i18n/ (UI copy per locale), theme.ts
e2e/              # Playwright specs (home, blog, theme, mobile-nav, locales)
scripts/          # setup, check-all, links, visual-check, crap-gate, prepare-resume,
                  # thorium/browsers/safari/firefox/terminal checks, perf matrices
docs/             # résumé PDF + screenshots/ (for review)
public/           # llms.txt, resume.pdf, Search Console verification file
```

Content structure lives in `src/lib/site.ts`; user-visible copy lives in
`src/lib/i18n/en.json` (translated per locale, see Translations above).
Change copy/links there; components follow.

## Notes

- `.npmrc` documents the npmmirror fallback used when registry.npmjs.org was unreachable from this
  network (Sep 2026). Delete the file + lockfile to go back to the default registry.
- The phone number from the résumé is deliberately **not** published on the page (privacy-first,
  fitting the brand); it stays in the PDF.
- The homepage is image-free by design, so there are no `next/image` optimizations to babysit.
- Agent-friendly: the site ships an `llms.txt` (linked from `<head>`) so LLM agents can summarize it, plus sitemap/robots/JSON-LD Person schema.
- Dark is the default theme; visitors can toggle to light (stored in localStorage, honored pre-hydration).
