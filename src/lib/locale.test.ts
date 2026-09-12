import { describe, expect, it } from "vitest";
import manifest from "@/lib/i18n/manifest.json";
import {
  DEFAULT_LOCALE,
  HTML_LANG,
  LOCALE_NAMES,
  SUPPORTED_LOCALES,
  TEXT_DIRECTION,
  formatString,
  hreflangAlternates,
  isLocale,
  localeFromPathname,
  localePath,
  resolveLocale,
  stripLocalePrefix,
  switchLocalePath,
} from "@/lib/locale";

describe("locale manifest", () => {
  it("includes English as the default and a fixed set of locales", () => {
    expect(DEFAULT_LOCALE).toBe("en");
    expect(SUPPORTED_LOCALES).toEqual(["en", "hi", "ml"]);
    expect(LOCALE_NAMES.en).toBe("English");
    // Native names come from the manifest (single source); asserting the
    // whole map keeps specs cspell-clean and tracks manifest changes.
    expect(LOCALE_NAMES).toEqual(Object.fromEntries(manifest.map((e) => [e.code, e.native])));
  });

  it("marks only Arabic-script locales as RTL", () => {
    expect(TEXT_DIRECTION.en).toBe("ltr");
    expect(TEXT_DIRECTION.hi).toBe("ltr");
    expect(TEXT_DIRECTION.ml).toBe("ltr");
    for (const locale of SUPPORTED_LOCALES) {
      expect(TEXT_DIRECTION[locale]).toBe("ltr");
    }
  });

  it("maps BCP 47 tags for html lang", () => {
    expect(HTML_LANG.en).toBe("en");
    expect(HTML_LANG.hi).toBe("hi");
    expect(HTML_LANG.ml).toBe("ml");
  });
});

describe("isLocale / resolveLocale", () => {
  it("accepts supported codes and rejects everything else", () => {
    expect(isLocale("en")).toBe(true);
    expect(isLocale("hi")).toBe(true);
    expect(isLocale("ml")).toBe(true);
    expect(isLocale("xx")).toBe(false);
    expect(isLocale(null)).toBe(false);
    expect(isLocale(42)).toBe(false);
  });

  it("falls back to English for unknown input", () => {
    expect(resolveLocale("ml")).toBe("ml");
    expect(resolveLocale("nope")).toBe("en");
    expect(resolveLocale(undefined)).toBe("en");
  });
});

describe("localeFromPathname", () => {
  it("reads the first segment when it is a locale", () => {
    expect(localeFromPathname("/hi/blog")).toBe("hi");
    expect(localeFromPathname("/ml")).toBe("ml");
  });

  it("treats non-locale first segments as English", () => {
    expect(localeFromPathname("/blog")).toBe("en");
    expect(localeFromPathname("/")).toBe("en");
    expect(localeFromPathname("")).toBe("en");
  });

  it("is null-safe", () => {
    expect(localeFromPathname(null)).toBe("en");
    expect(localeFromPathname(undefined)).toBe("en");
  });
});

describe("stripLocalePrefix", () => {
  it("strips known locale prefixes", () => {
    expect(stripLocalePrefix("/hi/blog")).toBe("/blog");
    expect(stripLocalePrefix("/ml")).toBe("/");
  });

  it("keeps non-locale paths untouched", () => {
    expect(stripLocalePrefix("/blog")).toBe("/blog");
    expect(stripLocalePrefix("/")).toBe("/");
  });
});

describe("localePath", () => {
  it("keeps English on canonical root routes", () => {
    expect(localePath("en", "/")).toBe("/");
    expect(localePath("en", "/blog")).toBe("/blog");
  });

  it("prefixes other locales without double slashes", () => {
    expect(localePath("hi", "/")).toBe("/hi");
    expect(localePath("hi", "/blog")).toBe("/hi/blog");
    expect(localePath("ml", "/accessibility")).toBe("/ml/accessibility");
  });
});

describe("switchLocalePath", () => {
  it("switches between locales preserving the page", () => {
    expect(switchLocalePath("/hi/blog", "ml")).toBe("/ml/blog");
    expect(switchLocalePath("/", "hi")).toBe("/hi");
    expect(switchLocalePath("/ml", "en")).toBe("/");
    expect(switchLocalePath(null, "hi")).toBe("/hi");
  });
});

describe("formatString", () => {
  it("fills placeholders and keeps unknown ones", () => {
    expect(formatString("{name} on GitHub", { name: "slowlang" })).toBe("slowlang on GitHub");
    expect(formatString("class of {year}", { year: 2028 })).toBe("class of 2028");
    expect(formatString("hi {missing}", {})).toBe("hi {missing}");
  });
});

describe("hreflangAlternates", () => {
  it("lists every locale plus x-default pointing at English", () => {
    const alternates = hreflangAlternates("/blog", "https://example.com");
    expect(alternates.en).toBe("https://example.com/blog");
    expect(alternates.hi).toBe("https://example.com/hi/blog");
    expect(alternates.ml).toBe("https://example.com/ml/blog");
    expect(alternates["x-default"]).toBe("https://example.com/blog");
    expect(Object.keys(alternates)).toHaveLength(SUPPORTED_LOCALES.length + 1);
  });

  it("uses bare locale prefix for the home path", () => {
    const alternates = hreflangAlternates("/", "https://example.com");
    expect(alternates.hi).toBe("https://example.com/hi");
    expect(alternates["x-default"]).toBe("https://example.com/");
  });

  it("tolerates a trailing slash on the site URL", () => {
    const alternates = hreflangAlternates("/blog", "https://example.com/");
    expect(alternates.hi).toBe("https://example.com/hi/blog");
    expect(alternates.ml).toBe("https://example.com/ml/blog");
    expect(alternates["x-default"]).toBe("https://example.com/blog");
  });
});
