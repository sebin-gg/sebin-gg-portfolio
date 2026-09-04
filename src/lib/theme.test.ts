import { afterEach, describe, expect, it, vi } from "vitest";
import {
  THEME_DARK_CLASS,
  THEME_STORAGE_KEY,
  getThemeSnapshot,
  htmlHasDarkClass,
  resolveThemeIsDark,
  storedTheme,
  subscribeTheme,
  themeInitScriptSource,
  toggleTheme,
} from "@/lib/theme";

function makeStorage(initial: Record<string, string> = {}) {
  const map = new Map(Object.entries(initial));
  return {
    getItem: vi.fn((key: string) => map.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => void map.set(key, value)),
  };
}

describe("storedTheme", () => {
  it("returns the stored theme when valid", () => {
    expect(storedTheme(makeStorage({ theme: "dark" }))).toBe("dark");
    expect(storedTheme(makeStorage({ theme: "light" }))).toBe("light");
  });

  it("returns null when unset or invalid", () => {
    expect(storedTheme(makeStorage({}))).toBeNull();
    expect(storedTheme(makeStorage({ theme: "neon" }))).toBeNull();
  });

  it("returns null when storage throws", () => {
    const broken = {
      getItem: () => {
        throw new Error("blocked");
      },
    };
    expect(storedTheme(broken)).toBeNull();
  });
});

describe("resolveThemeIsDark", () => {
  it("defaults to dark when nothing is stored", () => {
    expect(resolveThemeIsDark(null)).toBe(true);
  });

  it("stays dark when the user stored dark", () => {
    expect(resolveThemeIsDark("dark")).toBe(true);
  });

  it("only goes light when the user explicitly stored light", () => {
    expect(resolveThemeIsDark("light")).toBe(false);
  });
});

describe("htmlHasDarkClass", () => {
  it("detects the dark class on the html element", () => {
    const element = { classList: { contains: vi.fn(() => true) } };
    expect(htmlHasDarkClass({ documentElement: element as unknown as HTMLElement })).toBe(true);
    expect(element.classList.contains).toHaveBeenCalledWith(THEME_DARK_CLASS);
  });
});

describe("themeInitScriptSource", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    document.documentElement.classList.remove(THEME_DARK_CLASS);
    localStorage.clear();
  });

  it("references the storage key and dark class", () => {
    const source = themeInitScriptSource();
    expect(source).toContain(THEME_STORAGE_KEY);
    expect(source).toContain(THEME_DARK_CLASS);
  });

  it("applies dark by default when nothing is stored", () => {
    new Function(themeInitScriptSource())();
    expect(document.documentElement.classList.contains(THEME_DARK_CLASS)).toBe(true);
  });

  it("applies dark when storage says dark", () => {
    localStorage.setItem(THEME_STORAGE_KEY, "dark");
    new Function(themeInitScriptSource())();
    expect(document.documentElement.classList.contains(THEME_DARK_CLASS)).toBe(true);
  });

  it("skips dark only when the user stored light", () => {
    localStorage.setItem(THEME_STORAGE_KEY, "light");
    new Function(themeInitScriptSource())();
    expect(document.documentElement.classList.contains(THEME_DARK_CLASS)).toBe(false);
  });

  it("survives blocked storage", () => {
    vi.stubGlobal("localStorage", undefined);
    expect(() => {
      new Function(themeInitScriptSource())();
    }).not.toThrow();
  });
});

describe("theme lifecycle & store", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    document.documentElement.classList.remove(THEME_DARK_CLASS);
    localStorage.clear();
  });

  it("reads snapshot from document", () => {
    document.documentElement.classList.remove(THEME_DARK_CLASS);
    expect(getThemeSnapshot()).toBe(false);

    document.documentElement.classList.add(THEME_DARK_CLASS);
    expect(getThemeSnapshot()).toBe(true);
  });

  it("toggles theme and notifies subscribers", () => {
    document.documentElement.classList.add(THEME_DARK_CLASS);
    const subscriber = vi.fn();
    const unsubscribe = subscribeTheme(subscriber);

    const next = toggleTheme();
    expect(next).toBe(false);
    expect(document.documentElement.classList.contains(THEME_DARK_CLASS)).toBe(false);
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");
    expect(subscriber).toHaveBeenCalled();

    unsubscribe();
  });

  it("toggle survives blocked localStorage", () => {
    vi.stubGlobal("localStorage", {
      setItem: () => {
        throw new Error("blocked");
      },
    });
    expect(() => toggleTheme()).not.toThrow();
  });
});
