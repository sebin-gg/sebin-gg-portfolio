import { notFound } from "next/navigation";
import { DEFAULT_LOCALE, isLocale, type Locale } from "@/lib/locale";

/**
 * Validates the `[locale]` route param: unknown locales and English (which
 * owns the root routes) are hard 404s. Without this, a stray URL could
 * silently render English content under a localized path — both in the page
 * body and in its metadata, so every `[locale]` route awaits this first.
 */
export async function requireLocaleParam(params: Promise<{ locale: string }>): Promise<Locale> {
  const { locale } = await params;
  if (!isLocale(locale) || locale === DEFAULT_LOCALE) {
    notFound();
  }
  return locale;
}
