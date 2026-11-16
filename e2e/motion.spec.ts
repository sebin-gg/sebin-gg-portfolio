import { expect, test } from "@playwright/test";

/**
 * The ?motion= URL override: "on" must visibly animate on load (the
 * one-shot page-enter cue needs no scroll-driven timeline, so it also
 * covers engines without view() support), "off" must kill everything,
 * and no override must leave #main unanimated.
 */
test.describe("motion override", () => {
  test("?motion=on plays a one-shot page-enter on #main and ends visible", async ({ page }) => {
    await page.goto("/?motion=on");
    const main = page.locator("#main");
    await expect(main).toHaveCSS("animation-name", "page-enter");
    await expect(main).toHaveCSS("animation-iteration-count", "1");

    // both = forwards fill: after the 700ms run the page stays fully visible.
    await page.waitForTimeout(1000);
    await expect(main).toHaveCSS("opacity", "1");
  });

  test("?motion=off disables the load-in cue", async ({ page }) => {
    await page.goto("/?motion=off");
    await expect(page.locator("#main")).toHaveCSS("animation-name", "none");
  });

  test("no override leaves #main unanimated by default", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#main")).toHaveCSS("animation-name", "none");
  });
});
