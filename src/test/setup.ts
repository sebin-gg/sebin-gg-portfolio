import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// jsdom's localStorage is gated behind Node's `--localstorage-file` flag on
// modern runtimes (Node 22+: "localStorage is not available because
// --localstorage-file was not provided"), so in a default vitest run its
// value is `undefined`. The theme module reads/writes `localStorage` directly,
// so tests get a functional in-memory stand-in unless the real one exists.
if (typeof globalThis.localStorage === "undefined") {
  const store = new Map<string, string>();
  const polyfill = {
    getItem: (key: string) => (store.has(key) ? (store.get(key) as string) : null),
    setItem: (key: string, value: string) => void store.set(key, String(value)),
    removeItem: (key: string) => void store.delete(key),
    clear: () => void store.clear(),
    key: (index: number) => [...store.keys()][index] ?? null,
    get length() {
      return store.size;
    },
  };
  Object.defineProperty(globalThis, "localStorage", { value: polyfill, configurable: true });
  Object.defineProperty(globalThis.window || {}, "localStorage", {
    value: polyfill,
    configurable: true,
  });
}

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(() => "/"),
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  })),
}));
