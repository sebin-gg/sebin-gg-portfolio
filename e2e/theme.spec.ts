import { expect, test } from "@playwright/test";

async function htmlClass(page: import("@playwright/test").Page) {
  return page.evaluate(() => document.documentElement.className);
}

test.describe("theme toggle", () => {
  test("flips the dark class and persists after reload", async ({ page }) => {
    await page.goto("/");
    // Start light: nothing stored and OS light in this browser context.
    const toggle = page.getByRole("button", { name: "Switch to dark mode" });
    await expect(toggle).toBeVisible();
    await toggle.click();

    await expect(page.getByRole("button", { name: "Switch to light mode" })).toBeVisible();
    expect(await htmlClass(page)).toContain("dark");

    await page.reload();
    // Init script re-applies dark from localStorage before hydration.
    await expect(page.getByRole("button", { name: "Switch to light mode" })).toBeVisible();
    expect(await htmlClass(page)).toContain("dark");
  });

  test("switches back to light and persists that too", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Switch to dark mode" }).click();
    await page.getByRole("button", { name: "Switch to light mode" }).click();
    await expect(page.getByRole("button", { name: "Switch to dark mode" })).toBeVisible();
    expect(await htmlClass(page)).not.toContain("dark");
    await page.reload();
    expect(await htmlClass(page)).not.toContain("dark");
  });

  test("no wrong-theme flash: init script runs in the head", async ({ page }) => {
    // The inline script must be present in the initial HTML (server rendered),
    // before any client bundle runs.
    const response = await page.goto("/");
    const html = await response!.text();
    expect(html).toContain('localStorage.getItem("theme")');
    expect(html).toContain('document.documentElement.classList.add("dark")');
  });
});
