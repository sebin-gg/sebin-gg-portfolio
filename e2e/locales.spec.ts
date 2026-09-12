import { expect, test } from "@playwright/test";

/**
 * Localized routes: one prerendered static page per manifest locale under
 * /[locale]/..., English canonical at the root. No client-side translation
 * code — content must already be in the served HTML.
 */

const LOCALES = [
  { code: "ta", native: "தமிழ்", about: "நான் யார்", lang: "மொழி" },
  { code: "es", native: "Español", about: "Quién soy", lang: "Idioma" },
  { code: "fr", native: "Français", about: "Qui je suis", lang: "Langue" },
  { code: "de", native: "Deutsch", about: "Wer ich bin", lang: "Sprache" },
];

test.describe("localized routes", () => {
  test("English home stays canonical at / with no locale prefix", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Sebin Mathew/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Sebin Mathew");
    expect(new URL(page.url()).pathname).toBe("/");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });

  for (const locale of LOCALES) {
    test(`${locale.code} home prerenders translated content`, async ({ page }) => {
      await page.goto(`/${locale.code}`);
      // Translated section heading proves the dictionary rendered server-side.
      await expect(page.getByRole("heading", { name: locale.about })).toBeVisible();
      // Localized content region: the single root layout keeps html lang=en
      // (no multi-root layouts, so 404 handling stays native), while the
      // main/header/footer regions carry the locale lang per WCAG H58.
      await expect(page.getByRole("main")).toHaveAttribute("lang", locale.code);
      await expect(page.getByRole("navigation", { name: locale.lang })).toBeAttached();
      // No locale JSON, no translation runtime fetched at runtime.
      const clientFetches = page.evaluate(() =>
        performance
          .getEntriesByType("resource")
          .filter((entry) => entry.name.includes("i18n"))
          .map((entry) => entry.name),
      );
      expect(await clientFetches).toEqual([]);
    });

    test(`${locale.code} blog page renders localized chrome`, async ({ page }) => {
      await page.goto(`/${locale.code}/blog`);
      await expect(page.getByRole("main")).toHaveAttribute("lang", locale.code);
      await expect(page.getByRole("contentinfo")).toBeVisible();
    });
  }

  test("language switcher navigates to the same page in another locale and back", async ({
    page,
  }) => {
    await page.goto("/");
    const switcher = page.getByRole("navigation", { name: "Language" });
    await switcher.getByRole("link", { name: "தமிழ்" }).click();
    // waitForURL (not toHaveURL): under heavy CI load Firefox can resolve the
    // URL assertion against the pre-navigation page; this pins the wait to
    // the navigation itself.
    await page.waitForURL(/\/ta$/);
    await expect(page.getByRole("main")).toHaveAttribute("lang", "ta");

    // The switcher label is localized too — re-locate it in Tamil.
    await page
      .getByRole("navigation", { name: "மொழி" })
      .getByRole("link", { name: "English" })
      .click();
    await page.waitForURL(/\/$/);
    await expect(page.getByRole("main")).not.toHaveAttribute("lang");
  });

  test("switcher preserves the blog route across locales", async ({ page }) => {
    await page.goto("/blog");
    const switcher = page.getByRole("navigation", { name: "Language" });
    await switcher.getByRole("link", { name: "Español" }).click();
    await expect(page).toHaveURL(/\/es\/blog$/);
    await expect(page.getByRole("main")).toHaveAttribute("lang", "es");
  });

  test("unknown locale returns 404, not an English page", async ({ page }) => {
    const response = await page.goto("/xx");
    expect(response?.status()).toBe(404);
  });

  test("hreflang alternates cover every locale on the home page", async ({ page }) => {
    await page.goto("/");
    for (const locale of LOCALES) {
      await expect(page.locator(`link[rel="alternate"][hreflang="${locale.code}"]`)).toHaveCount(1);
    }
    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveCount(1);
  });
});
