import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    css: false,
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov", "json-summary"],
      include: ["src/lib/**/*.ts", "src/components/**/*.tsx"],
      exclude: ["src/components/icons.tsx", "src/test/**"],
      // Coverage high enough that CRAP = c^2*(1-cov)^3 + c stays < 6 for all
      // functions under the ESLint complexity cap of 4.
      thresholds: {
        lines: 85,
        statements: 85,
        functions: 80,
        branches: 75,
      },
    },
  },
});
