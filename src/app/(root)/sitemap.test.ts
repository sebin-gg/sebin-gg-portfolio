import { describe, expect, it } from "vitest";
import sitemap from "./sitemap";
import { hreflangAlternates, localePath, SUPPORTED_LOCALES } from "@/lib/locale";
import { siteUrl } from "@/lib/site";

const CANONICAL_PATHS = ["/", "/blog", "/accessibility"] as const;

describe("sitemap", () => {
  it("emits every localized route as its own <loc>", () => {
    const urls = sitemap().map((entry) => entry.url);
    for (const path of CANONICAL_PATHS) {
      for (const locale of SUPPORTED_LOCALES) {
        expect(urls).toContain(`${siteUrl}${localePath(locale, path)}`);
      }
    }
  });

  it("carries hreflang alternates for every locale on each localized row", () => {
    const localizedRows = sitemap().filter((entry) =>
      CANONICAL_PATHS.some((path) =>
        SUPPORTED_LOCALES.some((locale) => entry.url === `${siteUrl}${localePath(locale, path)}`),
      ),
    );
    expect(localizedRows).toHaveLength(CANONICAL_PATHS.length * SUPPORTED_LOCALES.length);
    for (const row of localizedRows) {
      const path = CANONICAL_PATHS.find((candidate) =>
        SUPPORTED_LOCALES.some(
          (locale) => row.url === `${siteUrl}${localePath(locale, candidate)}`,
        ),
      );
      expect(row.alternates?.languages).toEqual(hreflangAlternates(path ?? "/", siteUrl));
    }
  });
});
