import { expect, test, type Page } from "@playwright/test";

const htmlClass = (page: Page) => page.evaluate(() => document.documentElement.className);

/**
 * WebKit never re-evaluates `matchMedia().matches` after load under
 * `page.emulateMedia`, and the app's live listener re-queries matchMedia
 * rather than trusting the change event — so an event payload can't fake it.
 * Install a proxy before any page script runs: it records every created
 * MediaQueryList and, once `__scheme` is set, reports that scheme from
 * `.matches`. Dispatching `change` on the recorded lists then reaches the
 * app's registered listener through the real code path.
 */
const installSchemeProbe = (page: Page, scheme: "light" | "dark") =>
  page.addInitScript((initial) => {
    const win = window as unknown as {
      __scheme?: "light" | "dark";
      __mediaQueryLists?: MediaQueryList[];
      __origMatchMedia?: typeof window.matchMedia;
    };
    if (win.__origMatchMedia) return;
    // Seed before page scripts run so even the first-paint media query sees
    // the emulated scheme on engines where emulateMedia is inert (WebKit).
    win.__scheme = initial;
    win.__mediaQueryLists = [];
    win.__origMatchMedia = window.matchMedia.bind(window);
    const origMatchMedia = win.__origMatchMedia;
    window.matchMedia = (query: string) => {
      const mq = origMatchMedia(query);
      const proxied = new Proxy(mq, {
        get(target, prop, receiver) {
          if (prop === "matches" && win.__scheme && query.includes("prefers-color-scheme")) {
            return query.includes("dark") ? win.__scheme === "dark" : win.__scheme !== "dark";
          }
          const value = Reflect.get(target, prop, receiver);
          return typeof value === "function" ? value.bind(target) : value;
        },
      });
      win.__mediaQueryLists?.push(proxied);
      return proxied;
    };
  }, scheme);

const visitWithScheme = (page: Page, scheme: "light" | "dark", url = "/") =>
  page
    .emulateMedia({ colorScheme: scheme })
    .then(() => installSchemeProbe(page, scheme))
    .then(() => page.goto(url));

const setDeviceScheme = async (page: Page, scheme: "light" | "dark") => {
  await page.emulateMedia({ colorScheme: scheme });
  // Flip the recorded scheme and fire `change` on every tracked query list,
  // so listeners that re-read `.matches` (the app's own path) see the new
  // value on engines that never propagate emulated media (WebKit).
  await page.evaluate((next) => {
    const win = window as unknown as {
      __scheme?: string;
      __mediaQueryLists?: MediaQueryList[];
    };
    win.__scheme = next;
    for (const mq of win.__mediaQueryLists ?? []) {
      try {
        mq.dispatchEvent(new Event("change"));
      } catch {
        /* detached list */
      }
    }
  }, scheme);
  // Nudge a few times for engines that deliver the emulated change late.
  for (let attempt = 0; attempt < 3; attempt++) {
    await page.evaluate((next) => {
      for (const query of [`(prefers-color-scheme: ${next})`, "(prefers-color-scheme: dark)"]) {
        const mq = window.matchMedia(query);
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
    await visitWithScheme(page, "light");
    expect(await htmlClass(page)).not.toContain("dark");
    await expect(page.getByRole("button", { name: "Switch to dark mode" })).toBeVisible();
  });

  test("a fresh visitor on a dark device gets the dark theme", async ({ page }) => {
    await visitWithScheme(page, "dark");
    expect(await htmlClass(page)).toContain("dark");
    await expect(page.getByRole("button", { name: "Switch to light mode" })).toBeVisible();
  });

  test("an explicit choice overrides the device and survives a reload", async ({ page }) => {
    await visitWithScheme(page, "dark");
    await page.getByRole("button", { name: "Switch to light mode" }).click();

    await expect(page.getByRole("button", { name: "Switch to dark mode" })).toBeVisible();
    expect(await htmlClass(page)).not.toContain("dark");

    await page.reload();
    expect(await htmlClass(page)).not.toContain("dark");
    await expect(page.getByRole("button", { name: "Switch to dark mode" })).toBeVisible();
  });

  test("toggling to dark from a light device persists", async ({ page }) => {
    await visitWithScheme(page, "light");
    await page.getByRole("button", { name: "Switch to dark mode" }).click();

    await expect(page.getByRole("button", { name: "Switch to light mode" })).toBeVisible();
    expect(await htmlClass(page)).toContain("dark");

    // The stored "dark" must win over the light device preference on reload.
    await page.reload();
    expect(await htmlClass(page)).toContain("dark");
  });

  test("follows a live device change while nothing is stored", async ({ page }) => {
    await visitWithScheme(page, "light");
    expect(await htmlClass(page)).not.toContain("dark");

    // No explicit choice, so flipping the OS switches the site over.
    await setDeviceScheme(page, "dark");
    await expect.poll(() => htmlClass(page)).toContain("dark");
  });

  test("an explicit choice is not undone by a later device change", async ({ page }) => {
    await visitWithScheme(page, "dark");
    await page.getByRole("button", { name: "Switch to light mode" }).click();
    expect(await htmlClass(page)).not.toContain("dark");

    await setDeviceScheme(page, "light");
    expect(await htmlClass(page)).not.toContain("dark");
  });

  test("native widgets match the palette via color-scheme", async ({ page }) => {
    await visitWithScheme(page, "light");
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
