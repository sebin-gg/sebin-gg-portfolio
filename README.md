# sebin-gg portfolio

Personal portfolio for **Sebin Mathew** — B.Tech CS student at College of Engineering Chengannur,
building full-stack apps, Chrome extensions and security tooling. Content comes from the résumé
PDF (see `docs/`) and the [GitHub profile](https://github.com/sebin-gg).

Built on the **T3 stack core**: Next.js (App Router) + TypeScript + Tailwind CSS — static-first on
purpose. No tRPC/Prisma/NextAuth yet: there is no database, so shipping those today would only add
bundle weight. The day the blog gets a real backend, they bolt on cleanly.

## Stack decisions

| Choice                                        | Why                                                                                                                                                  |
| --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Static-first (no tRPC client)                 | Every KB counts on 2G/3G. tRPC + zod + superjson ≈ 15–25 kB gzip of JS with zero payoff when content is static. Server components render everything. |
| No image files                                | Terminal/grid visuals are pure CSS gradients — nothing to download.                                                                                  |
| Self-hosted variable fonts via `next/font`    | One small woff2 subset per family, `display: swap`, no third-party font CDN request.                                                                 |
| Class-based dark mode with inline init script | Toggle + OS preference applied before first paint — no theme flash, and the page is correct even before hydration.                                   |
| One tiny client island                        | Only `<ThemeToggle>` and `<MobileNav>` are client components (~2 kB). Everything else is a server component.                                         |
| Typographic apostrophes                       | `&rsquo;` in copy, not ASCII `'` — reads human and keeps lint happy.                                                                                 |

## Quickstart

```bash
pnpm install            # deps
pnpm dev                # http://localhost:3000
pnpm test:e2e           # needs a build first (script runs next build itself via Playwright)
```

`bash scripts/setup.sh` does the whole first-time dance (deps, Chromium, résumé copy).

## Quality gates (the short version)

```bash
pnpm check:all    # lint → typecheck → format → unit+coverage → CRAP gate → build → e2e
pnpm test:mutation    # Stryker mutation score (slow; also runs in CI on main)
pnpm perf:audit       # Lighthouse, simulated slow-4G mobile, / + /blog (needs CHROME_PATH)
node scripts/visual-check.mjs   # screenshots + horizontal-overflow check
```

All run in CI: `.github/workflows/ci.yml` (lint/typecheck/format/unit/build/e2e),
`mutation.yml`, `perf.yml`, `codeql.yml`, `sonar.yml`.

## Testing

- **Unit** — Vitest + Testing Library (jsdom). Coverage gate: ≥85 % lines/stmts, ≥80 % functions,
  ≥75 % branches on `src/lib` + `src/components` (currently ~98 %). Thresholds are set so that the
  **CRAP score** (`c²·(1−cov)³ + c`) stays under **6** for every function given the ESLint
  complexity cap of 4 (`pnpm crap:gate`).
- **Mutation** — StrykerJS with the Vitest runner mutates `src/lib` + `src/components`
  (string-literal mutants excluded — copy is for human review). Break threshold 60 %.
- **E2E** — Playwright, two projects (desktop Chromium + iPhone-12 viewport). It renders the real
  production build (`next build && next start`), clicks _every_ button and internal link on the
  page, asserts every hash anchor resolves to an element, checks the résumé PDF downloads with
  `application/pdf`, verifies theme persistence with zero console/page errors, and covers the blog
  "coming soon" state and the 404 page.

## Performance

Measured with Lighthouse on simulated slow-4G mobile, median of 3 runs (see `budgets.json`):

- Total transfer ≈ **220 kB** (script + stylesheet + 2 self-hosted fonts — no images)
- FCP ≈ 1.1 s · LCP ≈ 2.3–2.7 s · CLS = 0 · TBT ≈ 100–160 ms
- Performance ≈ **96** (home) / **98** (blog) · Accessibility **100** · Best Practices/SEO = 100

Why it stays fast on 2G/3G: no images, one self-hosted variable sans font preloaded (the LCP
family) while the mono family loads non-blocking, zero client libraries, and just two tiny
client components (~2 kB) on an otherwise server-rendered page.

> Running Lighthouse locally while other apps peg the CPU inflates the simulated TBT. On an idle
> machine scores sit in the high 80s–90s; CI (clean runner, median of 3) is the source of truth.

## You still need to do these (one-time, ~10 min)

These need your accounts, so the repo ships a helper that opens each page:

```bash
bash scripts/links.sh   # opens GitHub new-repo, Vercel, CodeRabbit, Renovate, SonarCloud
```

1. **Push to GitHub** as `sebin-gg/sebin-gg-portfolio` (public → all free tools below apply).
2. **Vercel** — import the repo, deploy. Optionally set `NEXT_PUBLIC_SITE_URL`.
3. **CodeRabbit** — install the GitHub app on the repo (config: `.coderabbit.yaml`). Free.
4. **Renovate or Dependabot** — pick one. Dependabot: enable in repo settings (config shipped in
   `.github/dependabot.yml`). Renovate: install the GitHub app (config: `renovate.json`). Free.
5. **SonarCloud** — create a free project, set the key/org in `sonar-project.properties`, add the
   `SONAR_TOKEN` repo secret. `sonar.yml` only runs once the secret exists.
6. **CodeRabbit / CodeQL** — CodeQL runs out of the box (free, GitHub-hosted).

## Project layout

```
src/
  app/            # routes: /, /blog (coming soon), 404, sitemap, robots, icon
  components/     # server components + 2 tiny client islands
  lib/            # site.ts (all content), theme.ts (no-FOUC logic)
e2e/              # Playwright specs
scripts/          # setup, check-all, links, visual-check, crap-gate, prepare-resume
docs/             # résumé PDF + screenshots/ (for review)
```

Content lives in one file — `src/lib/site.ts`. Change copy/links there; components follow.

## Notes

- `.npmrc` documents the npmmirror fallback used when registry.npmjs.org was unreachable from this
  network (Sep 2026). Delete the file + lockfile to go back to the default registry.
- The phone number from the résumé is deliberately **not** published on the page (privacy-first,
  fitting the brand); it stays in the PDF.
- The homepage is image-free by design, so there are no `next/image` optimizations to babysit.
