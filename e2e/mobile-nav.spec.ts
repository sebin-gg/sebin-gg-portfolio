import { expect, test } from "@playwright/test";

test.describe("mobile navigation", () => {
  // Runs only under the mobile viewport project; the hamburger is hidden on desktop.
  test.skip(({ isMobile }) => !isMobile, "mobile-only");
  test("opens and closes the menu", async ({ page }) => {
    await page.goto("/");
    const openButton = page.getByRole("button", { name: "Open menu" });
    await expect(openButton).toBeVisible();

    await openButton.click();
    const menu = page.getByRole("navigation", { name: "Mobile" });
    await expect(menu).toBeVisible();
    await expect(menu.getByRole("link", { name: "Projects" })).toBeVisible();

    await page.getByRole("button", { name: "Close menu" }).click();
    await expect(menu).not.toBeVisible();
  });

  test("navigating via the menu closes it", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    await page
      .getByRole("navigation", { name: "Mobile" })
      .getByRole("link", { name: "Blog" })
      .click();
    await expect(page).toHaveURL(/\/blog$/);
    await expect(page.getByRole("navigation", { name: "Mobile" })).not.toBeVisible();
  });

  test("résumé is reachable from the menu", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    const resume = page
      .getByRole("navigation", { name: "Mobile" })
      .getByRole("link", { name: /résumé/i });
    await expect(resume).toHaveAttribute("href", "/resume.pdf");
  });
});
