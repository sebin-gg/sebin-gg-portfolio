import { expect, test } from "@playwright/test";

test.describe("blog route", () => {
  test("lists published posts", async ({ page }) => {
    await page.goto("/blog");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Notes & write-ups");
    const post = page.getByRole("link", { name: /punishes you for typing too fast/i });
    await expect(post).toHaveAttribute(
      "href",
      "/blog/slowlang-a-language-that-punishes-fast-typing",
    );
    await expect(page.getByText(/SlowLang/i).first()).toBeVisible();
  });

  test("offers follow and RSS actions", async ({ page }) => {
    await page.goto("/blog");
    const follow = page.getByRole("link", { name: "Follow on GitHub" });
    await expect(follow).toHaveAttribute("href", "https://github.com/sebin-gg");
    await expect(page.getByRole("link", { name: "Subscribe via RSS" })).toHaveAttribute(
      "href",
      "/rss.xml",
    );
  });

  test("exposes its own share tags with the blog URL", async ({ page }) => {
    await page.goto("/blog");
    const meta = async (selector: string, attr = "content") =>
      page.locator(selector).first().getAttribute(attr);
    expect(await meta('meta[property="og:url"]')).toMatch(/\/blog$/);
    expect(await meta('meta[property="og:type"]')).toBe("article");
    // Title is dictionary-driven ("Notes & write-ups · Sebin Mathew").
    expect(await meta('meta[name="twitter:title"]')).toMatch(/Notes & write-ups/);
  });
});

test.describe("blog post page", () => {
  test("renders the article with post schema", async ({ page }) => {
    await page.goto("/blog/slowlang-a-language-that-punishes-fast-typing");
    await expect(
      page.getByRole("heading", { name: /punishes you for typing too fast/i }),
    ).toBeVisible();
    const jsonLd = (
      await page.locator('script[type="application/ld+json"]').allTextContents()
    ).join("\n");
    expect(jsonLd).toContain('"@type":"BlogPosting"');
    expect(jsonLd).toContain("Sebin Mathew");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      /\/blog\/slowlang-a-language-that-punishes-fast-typing$/,
    );
  });
});

test.describe("unknown route", () => {
  test("renders the 404 page for a missing path", async ({ page }) => {
    const response = await page.goto("/this-route-does-not-exist");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: /That page doesn.t exist/ })).toBeVisible();
    // A page-level noindex must exist; crawlers honor the most restrictive
    // tag even when a sitewide index directive is also present.
    await expect(page.locator('meta[name="robots"][content*="noindex"]').first()).toBeAttached();
    await expect(page.getByRole("link", { name: "Back to home" })).toHaveAttribute("href", "/");
  });
});
