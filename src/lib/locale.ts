/**
 * Supported page locales. English is the canonical default served from the
 * root routes (`/`, `/blog`); Hindi and Malayalam ship as fully static
 * pre-translated routes (`/hi`, `/ml`) so no client-side translation library,
 * third-party script, or paid API is needed.
 *
 * To add another language: append its code here, add a dictionary in
 * `dictionaries.ts`, add the static pages under `src/app/<code>/`, and list
 * the URLs in `sitemap.ts`.
 */

export const DEFAULT_LOCALE = "en" as const;

export const SUPPORTED_LOCALES = ["en", "hi", "ml"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

/** Native display name per locale, used for switcher labels. */
export const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  hi: "हिन्दी",
  ml: "മലയാളം",
};

/** Type guard for locale codes from untrusted input (paths, storage). */
export function isLocale(value: unknown): value is Locale {
  return value === "en" || value === "hi" || value === "ml";
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
  const segment = pathname.split("/").filter(Boolean)[0];
  return resolveLocale(segment);
}

/** Strips a locale prefix (`/ml/blog` -> `/blog`, `/hi` -> `/`). */
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

/** BCP 47 tag for `<html lang>`, hreflang and Open Graph. */
export const HTML_LANG: Record<Locale, string> = {
  en: "en",
  hi: "hi",
  ml: "ml",
};

/**
 * hreflang alternates for a page path: every supported locale plus x-default
 * (points at English). `path` is the canonical route (`/`, `/blog`, ...).
 */
export function hreflangAlternates(path: string, siteUrl: string): Record<string, string> {
  const alternates: Record<string, string> = {};
  for (const locale of SUPPORTED_LOCALES) {
    alternates[HTML_LANG[locale]] = `${siteUrl}${localePath(locale, path)}`;
  }
  alternates["x-default"] = `${siteUrl}${path}`;
  return alternates;
}
