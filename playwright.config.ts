import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;
// Set E2E_SKIP_BUILD=1 when the production build already exists (CI reuses
// the build artifact from the `build` job; locally `reuseExistingServer`
// picks up a dev/preview server).
const start = process.env.E2E_SKIP_BUILD
  ? `pnpm start --port ${PORT}`
  : `pnpm build && pnpm start --port ${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
    // iPhone 12 viewport/UA on chromium (real Safari covered by `webkit`).
    {
      name: "mobile",
      use: { ...devices["iPhone 12"], browserName: "chromium" },
    },
  ],
  webServer: {
    command: start,
    url: `http://127.0.0.1:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
