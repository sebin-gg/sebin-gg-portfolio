import { expect, test } from "@playwright/test";

test.describe("blog route", () => {
  test("shows the coming-soon empty state", async ({ page }) => {
    await page.goto("/blog");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Notes & write-ups");
    await expect(page.getByText(/no posts yet/i)).toBeVisible();
    await expect(page.getByText(/in the pipeline/i)).toBeVisible();
    await expect(page.getByText(/OWASP Bootcamp 2025/i)).toBeVisible();
  });

  test("offers a follow-on-GitHub action", async ({ page }) => {
    await page.goto("/blog");
    const follow = page.getByRole("link", { name: "Follow on GitHub" });
    await expect(follow).toHaveAttribute("href", "https://github.com/sebin-gg");
  });
});

test.describe("unknown route", () => {
  test("renders the 404 page for a missing path", async ({ page }) => {
    const response = await page.goto("/this-route-does-not-exist");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: /That page doesn.t exist/ })).toBeVisible();
    await expect(page.getByRole("link", { name: "Back to home" })).toHaveAttribute("href", "/");
  });
});
