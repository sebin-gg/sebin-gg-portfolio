import { expect, test } from "@playwright/test";

async function htmlClass(page: import("@playwright/test").Page) {
  return page.evaluate(() => document.documentElement.className);
}

test.describe("theme toggle", () => {
  test("is dark by default (fresh visitor, nothing stored)", async ({ page }) => {
    await page.goto("/");
    // Dark is the default: no stored preference yet.
    expect(await htmlClass(page)).toContain("dark");
    const toggle = page.getByRole("button", { name: "Switch to light mode" });
    await expect(toggle).toBeVisible();
  });

  test("switches to light and persists after reload", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Switch to light mode" }).click();

    await expect(page.getByRole("button", { name: "Switch to dark mode" })).toBeVisible();
    expect(await htmlClass(page)).not.toContain("dark");

    await page.reload();
    // Init script reads the stored "light" and skips the dark class.
    await expect(page.getByRole("button", { name: "Switch to dark mode" })).toBeVisible();
    expect(await htmlClass(page)).not.toContain("dark");
  });

  test("switches back to dark and persists that too", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Switch to light mode" }).click();
    await page.getByRole("button", { name: "Switch to dark mode" }).click();
    await expect(page.getByRole("button", { name: "Switch to light mode" })).toBeVisible();
    expect(await htmlClass(page)).toContain("dark");
    await page.reload();
    expect(await htmlClass(page)).toContain("dark");
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
