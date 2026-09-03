import { afterEach, describe, expect, it, vi } from "vitest";
import {
  THEME_DARK_CLASS,
  THEME_STORAGE_KEY,
  htmlHasDarkClass,
  prefersDarkTheme,
  storedTheme,
  themeInitScriptSource,
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

describe("prefersDarkTheme", () => {
  it("respects the stored choice first", () => {
    expect(prefersDarkTheme("dark", false)).toBe(true);
    expect(prefersDarkTheme("light", true)).toBe(false);
  });

  it("falls back to the OS preference when nothing is stored", () => {
    expect(prefersDarkTheme(null, true)).toBe(true);
    expect(prefersDarkTheme(null, false)).toBe(false);
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

  it("applies the dark class when storage says dark", () => {
    localStorage.setItem(THEME_STORAGE_KEY, "dark");
    vi.stubGlobal("matchMedia", () => ({ matches: false }));
    new Function(themeInitScriptSource())();
    expect(document.documentElement.classList.contains(THEME_DARK_CLASS)).toBe(true);
  });

  it("does not apply dark when storage says light even if the OS prefers dark", () => {
    localStorage.setItem(THEME_STORAGE_KEY, "light");
    vi.stubGlobal("matchMedia", () => ({ matches: true }));
    new Function(themeInitScriptSource())();
    expect(document.documentElement.classList.contains(THEME_DARK_CLASS)).toBe(false);
  });

  it("survives blocked storage and a missing matchMedia", () => {
    vi.stubGlobal("localStorage", undefined);
    vi.stubGlobal("matchMedia", undefined);
    expect(() => {
      new Function(themeInitScriptSource())();
    }).not.toThrow();
  });
});
