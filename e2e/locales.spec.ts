import { expect, test } from "@playwright/test";

const HOME_COPY = {
  en: "Who I am",
  hi: "मैं कौन हूँ",
  ml: "ഞാൻ ആരാണ്",
} as const;

test.describe("locale routes", () => {
  for (const locale of ["hi", "ml"] as const) {
    test(`/${locale} serves translated home content`, async ({ page }) => {
      await page.goto(`/${locale}`);
      const lang = await page.evaluate(() => document.documentElement.getAttribute("lang"));
      expect(lang).toBe("en"); // root <html> stays en; localized regions carry lang attrs
      await expect(page.getByRole("heading", { name: HOME_COPY[locale] })).toBeVisible();
    });

    test(`/${locale}/blog shows the localized coming-soon state`, async ({ page }) => {
      await page.goto(`/${locale}/blog`);
      await expect(page.getByText(/no posts|अभी कोई पोस्ट|ഇതുവരെ പോസ്റ്റുകളില്ല/)).toBeVisible();
    });

    test(`/${locale}/accessibility renders the localized statement`, async ({ page }) => {
      await page.goto(`/${locale}/accessibility`);
      const localized = await page.locator(`div[lang="${locale}"]`).first().innerText();
      expect(localized.length).toBeGreaterThan(0);
      expect(localized).not.toMatch(/^Who I am/);
    });
  }

  test("switcher keeps the same page across locales", async ({ page }) => {
    await page.goto("/hi/blog");
    const switcher = page.getByRole("navigation", { name: "भाषा" });
    await expect(switcher.getByRole("link", { name: "English" })).toHaveAttribute("href", "/blog");
    await expect(switcher.getByRole("link", { name: "മലയാളം" })).toHaveAttribute(
      "href",
      "/ml/blog",
    );
  });

  test("home page exposes hreflang alternates for all locales", async ({ page }) => {
    await page.goto("/");
    for (const code of ["en", "hi", "ml", "x-default"]) {
      expect(await page.locator(`link[rel="alternate"][hreflang="${code}"]`).count()).toBe(1);
    }
  });

  test("nav hash links stay inside the active locale", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === "mobile", "desktop nav is hidden below md");
    await page.goto("/hi/blog");
    const about = page
      .getByRole("navigation", { name: "मुख्य" })
      .getByRole("link", { name: "परिचय" });
    await expect(about).toHaveAttribute("href", "/hi/#about");
  });
});
