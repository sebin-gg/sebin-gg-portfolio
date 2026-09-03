<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project conventions

Static-first personal portfolio on Next.js 16 (App Router) + TypeScript + Tailwind v4. Content
comes from the résumé in `docs/` and the GitHub profile. Single page + a "blog coming soon" route.

## Commands (pnpm)

- `pnpm dev` — dev server on :3000
- `pnpm check:all` — full local quality gate (lint, typecheck, format, unit+coverage, CRAP, build, e2e)
- `pnpm test:unit` / `pnpm test:e2e` / `pnpm test:mutation` — Vitest / Playwright / Stryker
- `pnpm perf:audit` — Lighthouse (simulated slow-4G mobile) against a production server on :3100
- `node scripts/visual-check.mjs` — screenshots into `docs/screenshots/` + overflow check

## Rules

1. **Performance is a feature.** This site is image-free and static-first on purpose — the budget
   is ~2G/3G. Do not add client-side libraries, images, analytics, or heavy JS. New interactive
   UI = tiny isolated client component only. Self-host fonts via `next/font`, never a CDN link.
2. **Content lives in `src/lib/site.ts`.** Copy, links, projects, experience — update data there,
   not inside components. Keep copy human-voiced (no AI tells), with typographic apostrophes.
3. **Dark mode is class-based** (`.dark` on `<html>`) and **dark is the default** — light only
   when the user explicitly stored `theme=light`. Logic lives in `src/lib/theme.ts`; the inline
   no-FOUC script and the toggle must stay in sync with it.
4. **Quality gates must stay green:** ESLint complexity cap ≤ 4 (`src/**`), Prettier, strict
   TypeScript, coverage ≥ 85 % lines on lib+components, Stryker break threshold 60 %,
   Lighthouse perf ≥ 85 on a median of 3 runs. New code ships with tests.
5. **Semantics/a11y:** real `<button>`/`<nav>`/`<dl>` elements, aria labels, keyboard focus rings,
   `prefers-reduced-motion` respected (see `globals.css`). No `target="_blank"` without
   `rel="noopener noreferrer"`. No ASCII apostrophes in JSX text.
6. **Don't put the phone number on the page.** It stays in the résumé PDF only.
7. Tailwind v4: theme tokens are CSS vars in `globals.css` mapped via `@theme inline`; use the
   semantic utilities (`bg-canvas`, `text-ink-soft`, `border-line`, `text-accent`, …) rather than
   raw palette classes.
