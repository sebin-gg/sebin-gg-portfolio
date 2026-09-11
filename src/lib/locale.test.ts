import { describe, expect, it } from "vitest";
import {
  DEFAULT_LOCALE,
  HTML_LANG,
  LOCALE_NAMES,
  SUPPORTED_LOCALES,
  formatString,
  hreflangAlternates,
  isLocale,
  localeFromPathname,
  localePath,
  resolveLocale,
  stripLocalePrefix,
  switchLocalePath,
} from "@/lib/locale";

describe("isLocale / resolveLocale", () => {
  it("accepts exactly the supported locales", () => {
    expect(SUPPORTED_LOCALES).toEqual(["en", "hi", "ml"]);
    expect(isLocale("en")).toBe(true);
    expect(isLocale("hi")).toBe(true);
    expect(isLocale("ml")).toBe(true);
    expect(isLocale("ta")).toBe(false);
    expect(isLocale("")).toBe(false);
    expect(isLocale(null)).toBe(false);
    expect(isLocale(undefined)).toBe(false);
  });

  it("falls back to the English default", () => {
    expect(DEFAULT_LOCALE).toBe("en");
    expect(resolveLocale("ml")).toBe("ml");
    expect(resolveLocale("fr")).toBe("en");
    expect(resolveLocale(null)).toBe("en");
  });

  it("names every supported locale in its own script", () => {
    expect(LOCALE_NAMES.en).toBe("English");
    expect(LOCALE_NAMES.hi).toBe("हिन्दी");
    expect(LOCALE_NAMES.ml).toBe("മലയാളം");
  });
});

describe("localeFromPathname", () => {
  it("reads the locale from the first path segment", () => {
    expect(localeFromPathname("/hi/blog")).toBe("hi");
    expect(localeFromPathname("/ml")).toBe("ml");
    expect(localeFromPathname("/blog")).toBe("en");
    expect(localeFromPathname("/")).toBe("en");
  });

  it("is null-safe for tests and missing router context", () => {
    expect(localeFromPathname(null)).toBe("en");
    expect(localeFromPathname(undefined)).toBe("en");
    expect(localeFromPathname("")).toBe("en");
  });
});

describe("stripLocalePrefix", () => {
  it("removes a leading locale segment", () => {
    expect(stripLocalePrefix("/hi/blog")).toBe("/blog");
    expect(stripLocalePrefix("/ml/accessibility")).toBe("/accessibility");
    expect(stripLocalePrefix("/hi")).toBe("/");
  });

  it("leaves root and unprefixed paths alone", () => {
    expect(stripLocalePrefix("/")).toBe("/");
    expect(stripLocalePrefix("/blog")).toBe("/blog");
  });
});

describe("localePath", () => {
  it("keeps English on the canonical root routes", () => {
    expect(localePath("en", "/")).toBe("/");
    expect(localePath("en", "/blog")).toBe("/blog");
  });

  it("prefixes Hindi and Malayalam routes", () => {
    expect(localePath("hi", "/")).toBe("/hi");
    expect(localePath("hi", "/blog")).toBe("/hi/blog");
    expect(localePath("ml", "/accessibility")).toBe("/ml/accessibility");
  });
});

describe("switchLocalePath", () => {
  it("stays on the same page across locales", () => {
    expect(switchLocalePath("/hi/blog", "ml")).toBe("/ml/blog");
    expect(switchLocalePath("/ml/blog", "en")).toBe("/blog");
    expect(switchLocalePath("/blog", "hi")).toBe("/hi/blog");
    expect(switchLocalePath("/", "ml")).toBe("/ml");
    expect(switchLocalePath("/hi", "en")).toBe("/");
  });

  it("falls back to home without a pathname", () => {
    expect(switchLocalePath(null, "hi")).toBe("/hi");
    expect(switchLocalePath(undefined, "en")).toBe("/");
  });
});

describe("formatString", () => {
  it("fills named placeholders", () => {
    expect(formatString("{short} · class of {year}", { short: "CEC", year: 2028 })).toBe(
      "CEC · class of 2028",
    );
  });

  it("leaves unknown placeholders untouched", () => {
    expect(formatString("{name} on GitHub", {})).toBe("{name} on GitHub");
  });
});

describe("HTML_LANG", () => {
  it("maps every locale to its BCP 47 tag", () => {
    expect(HTML_LANG.en).toBe("en");
    expect(HTML_LANG.hi).toBe("hi");
    expect(HTML_LANG.ml).toBe("ml");
  });
});

describe("hreflangAlternates", () => {
  it("lists every locale plus x-default pointing at English", () => {
    const alternates = hreflangAlternates("/blog", "https://example.com");
    expect(alternates).toEqual({
      en: "https://example.com/blog",
      hi: "https://example.com/hi/blog",
      ml: "https://example.com/ml/blog",
      "x-default": "https://example.com/blog",
    });
  });

  it("localizes the home path without a trailing slug", () => {
    const alternates = hreflangAlternates("/", "https://example.com");
    expect(alternates.hi).toBe("https://example.com/hi");
    expect(alternates["x-default"]).toBe("https://example.com/");
  });
});
