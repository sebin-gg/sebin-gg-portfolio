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

/** Deliberately not in `public/`; exists only to prove test files are skipped. */
const SELF_REFERENCE_PROBE = "/probe-exists-only-in-this-test.svg";

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

/**
 * Test files carry the same `"/icon.svg"` literals this suite scans for, so
 * including them would let the assertions pass off their own source.
 */
function isTestFile(file: string): boolean {
  return /(^|[\\/])[\w.-]+\.(?:test|spec)\.[cm]?[jt]sx?$/.test(file);
}

function isScannable(file: string): boolean {
  return !isRouteHandler(file) && !isTestFile(file);
}

/** Root-relative static asset URLs hardcoded in one source file. */
function assetsIn(file: string): string[] {
  const source = readFileSync(file, "utf8");
  return [...source.matchAll(PUBLIC_PATH_LITERAL)].map((match) => match[1]);
}

/** Every root-relative static asset URL hardcoded anywhere under `src/app`. */
function referencedAssets(): string[] {
  const sources = walk(APP_DIR).filter(isScannable);
  const urls = sources.flatMap(assetsIn).filter((url) => !ROUTE_HANDLERS.has(url));
  return [...new Set(urls)].sort();
}

/**
 * Files that own the favicon metadata: every root layout plus the web manifest.
 * These are separate roots, so none inherits `icons` from another — each has to
 * pin the path itself.
 */
function iconMetadataFiles(): string[] {
  return walk(APP_DIR).filter(
    (file) => isScannable(file) && /(^|[\\/])(layout\.tsx|manifest\.ts)$/.test(file),
  );
}

describe("public asset references", () => {
  it("finds the asset references it is meant to guard", () => {
    // Guards against the scanner silently matching nothing, which would make
    // every assertion below vacuously true. This suite's own `"/icon.svg"`
    // literals are excluded, so the match has to come from real app code.
    expect(referencedAssets()).toContain("/icon.svg");
  });

  it("keeps its own source out of the scan", () => {
    // A literal that exists only in this file. If test files were scanned, the
    // scanner would report it as a missing public asset.
    expect(referencedAssets()).not.toContain(SELF_REFERENCE_PROBE);
    expect(iconMetadataFiles().some(isTestFile)).toBe(false);
    expect(assetsIn(__filename)).toContain(SELF_REFERENCE_PROBE);
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

  it("pins the favicon in every root layout and the manifest", () => {
    const owners = iconMetadataFiles();
    expect(owners.length).toBeGreaterThan(1);
    for (const file of owners) {
      expect(readFileSync(file, "utf8"), file).toContain('"/icon.svg"');
    }
  });
});
