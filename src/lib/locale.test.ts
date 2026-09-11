import { describe, expect, it } from "vitest";
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
    expect(SUPPORTED_LOCALES[0]).toBe("en");
    expect(SUPPORTED_LOCALES).toContain("ta");
    expect(LOCALE_NAMES.en).toBe("English");
    expect(LOCALE_NAMES.ta).toBe("தமிழ்");
  });

  it("marks only Arabic-script locales as RTL", () => {
    expect(TEXT_DIRECTION.en).toBe("ltr");
    expect(TEXT_DIRECTION.ta).toBe("ltr");
    for (const locale of SUPPORTED_LOCALES) {
      expect(TEXT_DIRECTION[locale]).toBe("ltr");
    }
  });

  it("maps BCP 47 tags for html lang", () => {
    expect(HTML_LANG.en).toBe("en");
    expect(HTML_LANG.ta).toBe("ta");
  });
});

describe("isLocale / resolveLocale", () => {
  it("accepts supported codes and rejects everything else", () => {
    expect(isLocale("en")).toBe(true);
    expect(isLocale("ta")).toBe(true);
    expect(isLocale("xx")).toBe(false);
    expect(isLocale(null)).toBe(false);
    expect(isLocale(42)).toBe(false);
  });

  it("falls back to English for unknown input", () => {
    expect(resolveLocale("ta")).toBe("ta");
    expect(resolveLocale("nope")).toBe("en");
    expect(resolveLocale(undefined)).toBe("en");
  });
});

describe("localeFromPathname", () => {
  it("reads the first segment when it is a locale", () => {
    expect(localeFromPathname("/ta/blog")).toBe("ta");
    expect(localeFromPathname("/ta")).toBe("ta");
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
    expect(stripLocalePrefix("/ta/blog")).toBe("/blog");
    expect(stripLocalePrefix("/ta")).toBe("/");
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
    expect(localePath("ta", "/")).toBe("/ta");
    expect(localePath("ta", "/blog")).toBe("/ta/blog");
    expect(localePath("ta", "/accessibility")).toBe("/ta/accessibility");
  });
});

describe("switchLocalePath", () => {
  it("switches between locales preserving the page", () => {
    expect(switchLocalePath("/ta/blog", "fr")).toBe("/fr/blog");
    expect(switchLocalePath("/", "ta")).toBe("/ta");
    expect(switchLocalePath("/ta", "en")).toBe("/");
    expect(switchLocalePath(null, "ta")).toBe("/ta");
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
    expect(alternates.ta).toBe("https://example.com/ta/blog");
    expect(alternates["x-default"]).toBe("https://example.com/blog");
    expect(Object.keys(alternates)).toHaveLength(SUPPORTED_LOCALES.length + 1);
  });

  it("uses bare locale prefix for the home path", () => {
    const alternates = hreflangAlternates("/", "https://example.com");
    expect(alternates.ta).toBe("https://example.com/ta");
    expect(alternates["x-default"]).toBe("https://example.com/");
  });
});
