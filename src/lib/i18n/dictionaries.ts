import type { Dictionary } from "@/lib/i18n/types";
import { DEFAULT_LOCALE, type Locale } from "@/lib/locale";

import de from "@/lib/i18n/de.json";
import enJson from "@/lib/i18n/en.json";
import es from "@/lib/i18n/es.json";
import fr from "@/lib/i18n/fr.json";
import ta from "@/lib/i18n/ta.json";

/**
 * Committed translation files produced and refreshed by `gt translate`
 * (see gt.config.json). English is imported statically; every manifest
 * target locale must have a committed file so the import resolves at
 * build time — a missing file fails the build loudly instead of silently
 * rendering English under a localized URL.
 */
const dictionaries: Record<Locale, Dictionary> = {
  en: enJson as Dictionary,
  ta: ta as Dictionary,
  es: es as Dictionary,
  fr: fr as Dictionary,
  de: de as Dictionary,
};

/** Returns the dictionary for a locale, falling back to English. */
export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries[DEFAULT_LOCALE];
}

/** The English source dictionary, for tests and fallback rendering. */
export const en = enJson as Dictionary;
