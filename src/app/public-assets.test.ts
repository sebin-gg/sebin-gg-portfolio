import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const PUBLIC_DIR = join(process.cwd(), "public");
const APP_DIR = join(process.cwd(), "src", "app");

/** Static assets Next.js serves straight out of `public/` (no build step). */
const STATIC_ASSET = /\.(?:svg|png|jpe?g|ico|webp|avif|pdf|woff2?)$/i;

/** Root-relative string literals that look like a public asset path. */
const PUBLIC_PATH_LITERAL =
  /["'`](\/[A-Za-z0-9._/-]+\.(?:svg|png|jpe?g|ico|webp|avif|pdf|woff2?))["'`]/g;

/** Route-handler URLs. These are built from `route.ts(x)` files, not `public/`. */
const ROUTE_HANDLERS = new Set(["/og-image"]);

function walk(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    if (entry === "node_modules" || entry.startsWith(".")) return [];
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

function isRouteHandler(file: string): boolean {
  return /(^|[\\/])route\.tsx?$/.test(file);
}

/** Root-relative static asset URLs hardcoded in one source file. */
function assetsIn(file: string): string[] {
  const source = readFileSync(file, "utf8");
  return [...source.matchAll(PUBLIC_PATH_LITERAL)].map((match) => match[1]);
}

/** Every root-relative static asset URL hardcoded anywhere under `src/app`. */
function referencedAssets(): string[] {
  const sources = walk(APP_DIR).filter((file) => !isRouteHandler(file));
  const urls = sources.flatMap(assetsIn).filter((url) => !ROUTE_HANDLERS.has(url));
  return [...new Set(urls)].sort();
}

describe("public asset references", () => {
  it("finds the asset references it is meant to guard", () => {
    // Guards against the scanner silently matching nothing, which would make
    // every assertion below vacuously true.
    expect(referencedAssets()).toContain("/icon.svg");
  });

  it("ships every hardcoded static asset in public/", () => {
    const missing = referencedAssets().filter((url) => !existsSync(join(PUBLIC_DIR, url)));
    expect(missing).toEqual([]);
  });

  it("serves the favicon from a stable path", () => {
    // Next.js rewrites `icon.svg` metadata files living inside a route group to
    // a hashed name (`/icon-<hash>.svg`). Layouts and the web manifest pin the
    // stable `/icon.svg`, so the file has to live in `public/` or every page
    // logs a 404 and Lighthouse's `errors-in-console` gate fails.
    expect(existsSync(join(PUBLIC_DIR, "icon.svg"))).toBe(true);
  });

  it("keeps no copy of the icon inside a route group", () => {
    const strays = walk(APP_DIR)
      .filter((file) => STATIC_ASSET.test(file) && /(^|[\\/])icon\./.test(file))
      .map((file) => file.slice(process.cwd().length + 1));
    expect(strays).toEqual([]);
  });

  it("pins the favicon to the same path in every layout and the manifest", () => {
    const referencing = walk(APP_DIR).filter((file) => {
      if (isRouteHandler(file)) return false;
      return /icons\s*:/.test(readFileSync(file, "utf8"));
    });
    expect(referencing.length).toBeGreaterThan(0);
    for (const file of referencing) {
      expect(readFileSync(file, "utf8"), file).toContain('"/icon.svg"');
    }
  });
});
