// Run: pnpm perf:audit  (or in CI after `pnpm build`). Requires a Chrome/Chromium
// binary reachable via CHROME_PATH, and the app served on PORT (default 3100).
module.exports = {
  ci: {
    collect: {
      url: ["http://127.0.0.1:3100/", "http://127.0.0.1:3100/blog"],
      numberOfRuns: 3,
      settings: {
        // Mobile emulation + simulated slow-4G throttling — the 2G/3G budget.
        throttlingMethod: "simulate",
        emulatedFormFactor: "mobile",
        screenEmulation: {
          mobile: true,
          width: 412,
          height: 915,
          deviceScaleFactor: 1.75,
          disabled: false,
        },
        budgetPath: "budgets.json",
        chromeFlags: "--headless --no-sandbox --disable-gpu",
      },
    },
    assert: {
      assertions: {
        // Hard floors. Performance is scored on the same simulated slow-4G run
        // and aggregated over 3 runs, which smooths out run-to-run noise.
        "categories:performance": ["error", { minScore: 0.85 }],
        "categories:accessibility": ["error", { minScore: 0.95 }],
        "categories:best-practices": ["error", { minScore: 0.9 }],
        "categories:seo": ["error", { minScore: 0.9 }],
        "performance-budget": "error",
        "errors-in-console": "error",
        "inspector-issues": "warn",
        // Local next start serves HTTP/1.1; Vercel upgrades to HTTP/2, so only warn.
        "uses-http2": "warn",
      },
    },
    upload: {
      target: "filesystem",
      outputDir: "lighthouse-results",
    },
  },
};
