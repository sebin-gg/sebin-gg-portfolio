import { expect, test } from "@playwright/test";
import { links, navItems, profile, projects, resumeUrl } from "../src/lib/site";

test.describe("home page", () => {
  test("shows the name, tagline and profile highlights", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(profile.name);
    await expect(page.getByText(profile.tagline.slice(0, 32))).toBeVisible();
    await expect(page.getByRole("complementary", { name: "Profile highlights" })).toBeVisible();
  });

  test("all section anchors point at elements that exist", async ({ page }) => {
    await page.goto("/");
    const hashLinks = page.locator('a[href^="#"]');
    const count = await hashLinks.count();
    expect(count).toBeGreaterThan(0);

    const ids: string[] = await page.evaluate(() =>
      Array.from(document.querySelectorAll("section[id], main[id]")).map((el) => el.id),
    );
    for (let i = 0; i < count; i++) {
      const href = await hashLinks.nth(i).getAttribute("href");
      expect(ids, `missing section target for ${href}`).toContain(href!.slice(1));
    }
  });

  test("every external link is absolute and opens safely", async ({ page }) => {
    await page.goto("/");
    const external = page.locator('a[href^="http"]');
    const count = await external.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const link = external.nth(i);
      const href = await link.getAttribute("href");
      expect(href).toMatch(/^https:\/\//);
      expect(await link.getAttribute("target")).toBe("_blank");
      expect(await link.getAttribute("rel")).toContain("noopener");
      // Every project card links back to the real GitHub account.
      if (projects.some((p) => p.href === href)) {
        expect(href).toContain("github.com/sebin-gg");
      }
    }
  });

  test("resume and blog routes respond 200", async ({ request }) => {
    const resume = await request.get(resumeUrl);
    expect(resume.status()).toBe(200);
    expect(resume.headers()["content-type"]).toContain("application/pdf");
    const blog = await request.get("/blog");
    expect(blog.status()).toBe(200);
  });

  test("click tour of every button and link leaves no console or page errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    page.on("pageerror", (err) => errors.push(err.message));

    await page.goto("/");

    // Theme toggle (desktop header) — click it a few times.
    const toggle = page.getByRole("button", { name: /switch to/i }).first();
    await toggle.click();
    await toggle.click();
    await toggle.click();

    // Click every visible button on the page, including the mobile menu when open.
    for (let round = 0; round < 2; round++) {
      const buttons = page.getByRole("button");
      const total = await buttons.count();
      for (let i = 0; i < total; i++) {
        const button = buttons.nth(i);
        if (await button.isVisible()) {
          await button.click();
          await page.waitForTimeout(50);
        }
      }
    }

    // Click every internal anchor (hash + same-origin paths). Skip the
    // sr-only "skip to content" link: it is clipped off-screen, so clicking
    // it would hang.
    const linksOnPage = page.locator("a:not(.sr-only)");
    const linkCount = await linksOnPage.count();
    for (let i = 0; i < linkCount; i++) {
      const link = linksOnPage.nth(i);
      if (!(await link.isVisible())) continue;
      const href = await link.getAttribute("href");
      if (!href || href.startsWith("http") || href.startsWith("mailto:")) continue;
      await link.click();
      await page.waitForTimeout(30);
    }

    await expect(page.getByText(profile.name).first()).toBeVisible();
    expect(errors).toEqual([]);
  });

  test("social profile links point at the real profiles", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: "GitHub profile" }).first()).toHaveAttribute(
      "href",
      links.github.href,
    );
    await expect(page.getByRole("link", { name: "LinkedIn profile" }).first()).toHaveAttribute(
      "href",
      links.linkedin.href,
    );
    await expect(page.getByRole("link", { name: "X profile" }).first()).toHaveAttribute(
      "href",
      links.x.href,
    );
  });

  test("navigation covers the expected destinations", async ({ page, isMobile }) => {
    await page.goto("/");
    if (isMobile) {
      // On small screens the links live inside the closed hamburger menu;
      // open it first, then assert from within.
      await page.getByRole("button", { name: "Open menu" }).click();
    }
    for (const item of navItems) {
      const link = page.getByRole("link", { name: item.label }).first();
      await expect(link).toHaveAttribute("href", item.href);
    }
  });
});
