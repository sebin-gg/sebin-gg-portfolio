import { expect, test, type Page } from "@playwright/test";

async function htmlClass(page: Page) {
  return page.evaluate(() => document.documentElement.className);
}

/**
 * The site follows the device's color scheme until the visitor makes an
 * explicit choice, after which that choice is persisted and always wins.
 * Playwright's default `colorScheme` is "light", so every test below sets the
 * device preference explicitly instead of relying on it.
 */
test.describe("theme", () => {
  test("a fresh visitor on a light device gets the light theme", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    expect(await htmlClass(page)).not.toContain("dark");
    await expect(page.getByRole("button", { name: "Switch to dark mode" })).toBeVisible();
  });

  test("a fresh visitor on a dark device gets the dark theme", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/");
    expect(await htmlClass(page)).toContain("dark");
    await expect(page.getByRole("button", { name: "Switch to light mode" })).toBeVisible();
  });

  test("an explicit choice overrides the device and survives a reload", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/");
    await page.getByRole("button", { name: "Switch to light mode" }).click();

    await expect(page.getByRole("button", { name: "Switch to dark mode" })).toBeVisible();
    expect(await htmlClass(page)).not.toContain("dark");

    await page.reload();
    expect(await htmlClass(page)).not.toContain("dark");
    await expect(page.getByRole("button", { name: "Switch to dark mode" })).toBeVisible();
  });

  test("toggling to dark from a light device persists", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    await page.getByRole("button", { name: "Switch to dark mode" }).click();

    await expect(page.getByRole("button", { name: "Switch to light mode" })).toBeVisible();
    expect(await htmlClass(page)).toContain("dark");

    // The stored "dark" must win over the light device preference on reload.
    await page.reload();
    expect(await htmlClass(page)).toContain("dark");
  });

  test("follows a live device change while nothing is stored", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    expect(await htmlClass(page)).not.toContain("dark");

    // No explicit choice, so flipping the OS switches the site over.
    await page.emulateMedia({ colorScheme: "dark" });
    await expect.poll(() => htmlClass(page)).toContain("dark");
  });

  test("an explicit choice is not undone by a later device change", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/");
    await page.getByRole("button", { name: "Switch to light mode" }).click();
    expect(await htmlClass(page)).not.toContain("dark");

    await page.emulateMedia({ colorScheme: "light" });
    await page.waitForTimeout(250);
    expect(await htmlClass(page)).not.toContain("dark");
  });

  test("native widgets match the palette via color-scheme", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    const light = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue("color-scheme").trim(),
    );
    expect(light).toBe("light");

    await page.emulateMedia({ colorScheme: "dark" });
    await expect
      .poll(() =>
        page.evaluate(() =>
          getComputedStyle(document.documentElement).getPropertyValue("color-scheme").trim(),
        ),
      )
      .toBe("dark");
  });

  test("no wrong-theme flash: init script runs in the head", async ({ page }) => {
    // The inline script must be present in the initial HTML (server rendered),
    // before any client bundle runs, and must read the device preference.
    const response = await page.goto("/");
    const html = await response!.text();
    expect(html).toContain("prefers-color-scheme: dark");
    expect(html).toContain("classList.toggle");
  });
});
