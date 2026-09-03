import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Project-level ignores:
    "coverage/**",
    "playwright-report/**",
    "test-results/**",
    "stryker-report/**",
    ".stryker-tmp/**",
    "public/**",
    "docs/**",
    "scripts/**.mjs",
    "lighthouse-results/**",
  ]),
  {
    // Cyclomatic complexity cap for app code only. CRAP = c^2 * (1 - cov)^3 + c,
    // so a function with complexity <= 4 and >= 55% coverage stays under 6.
    // Test files and scripts are exempt: their step sequences read linearly.
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      complexity: ["error", { max: 4 }],
    },
  },
]);

export default eslintConfig;
