import type { Dictionary } from "@/lib/i18n/types";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type Locale } from "@/lib/locale";

import hi from "@/lib/i18n/hi.json";
import enJson from "@/lib/i18n/en.json";
import ml from "@/lib/i18n/ml.json";

/**
 * Committed translation files produced and refreshed by `gt translate`
 * (see gt.config.json). English is imported statically; every manifest
 * target locale must have a committed file so the import resolves at
 * build time — a missing file fails the build loudly instead of silently
 * rendering English under a localized URL.
 *
 * Rule: a locale joins this registry only once a real translated
 * dictionary exists. Seeding en.json under a new locale code would
 * publish English content at localized URLs (bad for users and SEO).
 * To add a language: extend `gt.config.json` locales, run
 * `GT_API_KEY=… GT_PROJECT_ID=… pnpm exec gt translate`, review the
 * output, then add the import + entry here and the manifest entry.
 */
const dictionaries: Record<Locale, Dictionary> = {
  en: enJson,
  hi,
  ml,
};

/**
 * A manifest locale without a committed dictionary would silently render
 * English under a localized URL — the exact trap of a manifest-driven
 * pipeline. Fail loudly (and locally, in tests) the moment the two drift.
 */
const missing = SUPPORTED_LOCALES.filter((locale) => !(locale in dictionaries));
if (missing.length > 0) {
  throw new Error(
    "i18n manifest locales missing committed dictionaries: " +
      missing.join(", ") +
      ". Run `gt translate`, commit the generated files, then retry.",
  );
}

/** Returns the dictionary for a locale, falling back to English. */
export function getDictionary(locale: Locale): Dictionary {
  // Own-property check: an arbitrary string index could otherwise resolve
  // to an inherited prototype member ("toString", …) which is no Dictionary.
  return Object.hasOwn(dictionaries, locale) ? dictionaries[locale] : dictionaries[DEFAULT_LOCALE];
}

/** The English source dictionary, for tests and fallback rendering. */
export const en = enJson;
