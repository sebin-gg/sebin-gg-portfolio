import { expect, test } from "@playwright/test";

/**
 * Browser-level coverage for the playground terminal. The RTL suite asserts
 * the classes; these assert what the user actually gets — a centred panel and a
 * fade that respects the motion preference.
 */

/**
 * Anchored on an explicit attribute rather than the `font-mono` utility class:
 * the command chips are monospace too, so a class-based selector matched all
 * ten elements and broke the strict-mode locator.
 */
const PANEL = "#terminal [data-terminal-panel]";
const ROW = `${PANEL} div > div`;

/**
 * `exact` matters here: the command chips are named "Run command: <name>", and
 * a substring match for "Run" would resolve to the chips as well as the submit
 * button.
 */
const run = async (page: import("@playwright/test").Page, command: string) => {
  await page.getByLabel("Terminal command").fill(command);
  await page.getByRole("button", { name: "Run", exact: true }).click();
};

test.describe("playground terminal", () => {
  test("centers the panel within its section", async ({ page }) => {
    await page.goto("/");
    const section = await page.locator("#terminal").boundingBox();
    const panel = await page.locator(PANEL).boundingBox();
    expect(section).not.toBeNull();
    expect(panel).not.toBeNull();
    if (!section || !panel) return;

    const left = panel.x - section.x;
    const right = section.x + section.width - (panel.x + panel.width);
    // Sub-pixel rounding on the centred margin; 2px is generous.
    expect(Math.abs(left - right)).toBeLessThanOrEqual(2);
  });

  test("fades a staggered line in without flashing before the delay", async ({ page }) => {
    await page.goto("/");
    await page.locator("#terminal").scrollIntoViewIfNeeded();

    // Fill the transcript so the next row lands at a high index and therefore
    // a real positive animation-delay — where a missing fill mode made the row
    // paint at full opacity and then snap to zero.
    for (const command of [
      "whoami",
      "about",
      "projects",
      "skills",
      "experience",
      "resume",
      "contact",
      "help",
    ]) {
      await run(page, command);
    }
    await expect(page.locator(ROW)).toHaveCount(8);

    await run(page, "whoami");
    const row = page.locator(ROW).last();
    const styles = await row.evaluate((el) => {
      const computed = getComputedStyle(el);
      return {
        name: computed.animationName,
        delay: computed.animationDelay,
        fill: computed.animationFillMode,
      };
    });
    expect(styles.name).toBe("terminal-fade");
    expect(styles.fill).toBe("both");
    expect(Number.parseFloat(styles.delay)).toBeGreaterThan(0);

    // Sampled inside the delay window, the row must still be invisible.
    expect(await row.evaluate((el) => Number(getComputedStyle(el).opacity))).toBeLessThan(0.05);

    // And it must actually end up fully visible.
    await expect
      .poll(() => row.evaluate((el) => Number(getComputedStyle(el).opacity)), {
        timeout: 3000,
      })
      .toBeGreaterThan(0.99);
  });

  test("does not animate when reduced motion is preferred", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/");
    await run(page, "whoami");

    const styles = await page
      .locator(ROW)
      .last()
      .evaluate((el) => {
        const computed = getComputedStyle(el);
        return { name: computed.animationName, delay: computed.animationDelay };
      });
    expect(styles.name).toBe("none");
    expect(styles.delay).toBe("0s");
    // Content still renders — the motion is what is suppressed.
    await expect(page.locator(ROW)).toHaveCount(1);
    await context.close();
  });
});
