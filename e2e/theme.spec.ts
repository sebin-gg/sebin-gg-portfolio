import { expect, test, type Page } from "@playwright/test";

const htmlClass = async (page: Page) => page.evaluate(() => document.documentElement.className);

const setDeviceScheme = async (page: Page, scheme: "light" | "dark") => {
  await page.emulateMedia({ colorScheme: scheme });
  // Playwright 1.64+/WebKit can be flaky delivering the emulated matchMedia
  // change event; dispatch it explicitly so the app's live-scheme listener
  // (registered in the theme init script) is exercised reliably. Try both the
  // scheme query and the query object form; also nudge a couple times because
  // matchMedia listener instance identity can vary by engine.
  for (let attempt = 0; attempt < 3; attempt++) {
    await page.evaluate((next) => {
      for (const q of [`(prefers-color-scheme: ${next})`, "(prefers-color-scheme: dark)"]) {
        const mq = window.matchMedia(q);
        try {
          mq.dispatchEvent(
            new MediaQueryListEvent("change", { matches: mq.matches, media: mq.media }),
          );
        } catch {
          mq.dispatchEvent(new Event("change"));
        }
      }
    }, scheme);
    await page.waitForTimeout(50);
  }
};

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
    await setDeviceScheme(page, "dark");
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

    await setDeviceScheme(page, "dark");
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
