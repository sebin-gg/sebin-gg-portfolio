import manifest from "@/lib/i18n/manifest.json";

/**
 * Supported page locales. English is the canonical default served from the
 * root routes (`/`, `/blog`); every other locale is prerendered under its
 * prefix (`/hi`, `/hi/blog`, …). Translations come from committed JSON files
 * refreshed by the General Translation CLI (`gt translate`, see
 * gt.config.json), so pages stay fully static with zero client-side
 * translation code.
 *
 * The manifest is the single source of truth: routes, the language switcher,
 * hreflang alternates and the sitemap are all derived from it. Adding a
 * language = add it to `gt.config.json`, run `gt translate`, add it here.
 */

export const DEFAULT_LOCALE = "en" as const;

type ManifestEntry = { code: string; native: string };

const entries = manifest as readonly ManifestEntry[];

export const SUPPORTED_LOCALES = entries.map((entry) => entry.code);
if (!SUPPORTED_LOCALES.includes(DEFAULT_LOCALE)) {
  throw new Error("i18n manifest must include the default locale: " + DEFAULT_LOCALE);
}

export type Locale = (typeof SUPPORTED_LOCALES)[number];

/** Native display name per locale, used for switcher labels. */
export const LOCALE_NAMES: Record<string, string> = Object.fromEntries(
  entries.map((entry) => [entry.code, entry.native]),
);

/** BCP 47 tag per locale for `<html lang>` / hreflang / Open Graph. */
export const HTML_LANG: Record<string, string> = Object.fromEntries(
  entries.map((entry) => [entry.code, entry.code]),
);

/** Text direction per locale; only Arabic script locales are RTL. */
const RTL_LOCALES = new Set(["ar", "he", "fa", "ur"]);
export const TEXT_DIRECTION: Record<string, "ltr" | "rtl"> = Object.fromEntries(
  entries.map((entry) => [entry.code, RTL_LOCALES.has(entry.code) ? "rtl" : "ltr"]),
);

/** Type guard for locale codes from untrusted input (paths, storage). */
export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && SUPPORTED_LOCALES.includes(value);
}

/** Falls back to English for anything that is not a supported locale. */
export function resolveLocale(value: unknown): Locale {
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

/**
 * Derives the page locale from a pathname (`/hi/blog` -> `hi`).
 * Null-safe so unit tests and missing router context fall back to English.
 */
export function localeFromPathname(pathname: string | null | undefined): Locale {
  if (!pathname) {
    return DEFAULT_LOCALE;
  }
  const segment = pathname.split("/").find(Boolean);
  return resolveLocale(segment);
}

/** Strips a locale prefix (`/hi/blog` -> `/blog`, `/hi` -> `/`). */
export function stripLocalePrefix(pathname: string): string {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) {
    return "/";
  }
  if (!isLocale(parts[0])) {
    return pathname;
  }
  const rest = parts.slice(1).join("/");
  return rest ? `/${rest}` : "/";
}

/**
 * Localizes a site path. English stays on the canonical root routes;
 * every other locale gets a path prefix (`/hi/blog`).
 */
export function localePath(locale: Locale, path: string): string {
  if (locale === DEFAULT_LOCALE) {
    return path;
  }
  if (path === "/") {
    return `/${locale}`;
  }
  return `/${locale}${path}`;
}

/** Points the language switcher at the same page in another locale. */
export function switchLocalePath(pathname: string | null | undefined, locale: Locale): string {
  const base = !pathname ? "/" : stripLocalePrefix(pathname);
  return localePath(locale, base);
}

/** Fills `{name}` placeholders in a dictionary template string. */
export function formatString(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => {
    const value = vars[key];
    return value === undefined ? match : String(value);
  });
}

/**
 * hreflang alternates for a page path: every supported locale plus x-default
 * (points at English). `path` is the canonical route (`/`, `/blog`, ...).
 */
export function hreflangAlternates(path: string, siteUrl: string): Record<string, string> {
  // Normalize here so a trailing slash on NEXT_PUBLIC_SITE_URL can never
  // leak double slashes into metadata or the sitemap.
  const base = siteUrl.replace(/\/$/, "");
  const alternates: Record<string, string> = {};
  for (const locale of SUPPORTED_LOCALES) {
    alternates[HTML_LANG[locale]] = `${base}${localePath(locale, path)}`;
  }
  alternates["x-default"] = `${base}${path}`;
  return alternates;
}
