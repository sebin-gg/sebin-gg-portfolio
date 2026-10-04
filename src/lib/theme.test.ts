import { afterEach, describe, expect, it, vi } from "vitest";
import {
  DARK_SCHEME_QUERY,
  THEME_DARK_CLASS,
  THEME_STORAGE_KEY,
  getThemeSnapshot,
  htmlHasDarkClass,
  prefersDarkScheme,
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
  it("follows the device when nothing is stored", () => {
    expect(resolveThemeIsDark(null, true)).toBe(true);
    expect(resolveThemeIsDark(null, false)).toBe(false);
  });

  it("lets an explicit stored choice beat the device", () => {
    expect(resolveThemeIsDark("dark", false)).toBe(true);
    expect(resolveThemeIsDark("light", true)).toBe(false);
  });
});

describe("prefersDarkScheme", () => {
  it("reads the dark-scheme media query", () => {
    const win = { matchMedia: vi.fn(() => ({ matches: true })) };
    expect(prefersDarkScheme(win as unknown as Window)).toBe(true);
    expect(win.matchMedia).toHaveBeenCalledWith(DARK_SCHEME_QUERY);
  });

  it("is false when the device reports light", () => {
    const win = { matchMedia: () => ({ matches: false }) };
    expect(prefersDarkScheme(win as unknown as Window)).toBe(false);
  });

  it("survives a missing or throwing matchMedia", () => {
    expect(prefersDarkScheme({} as unknown as Window)).toBe(false);
    expect(
      prefersDarkScheme({
        matchMedia: () => {
          throw new Error("unsupported");
        },
      } as unknown as Window),
    ).toBe(false);
  });
});

describe("htmlHasDarkClass", () => {
  it("detects the dark class on the html element", () => {
    const element = { classList: { contains: vi.fn(() => true) } };
    expect(htmlHasDarkClass({ documentElement: element as unknown as HTMLElement })).toBe(true);
    expect(element.classList.contains).toHaveBeenCalledWith(THEME_DARK_CLASS);
  });
});

/** Runs the init script with a stubbed matchMedia reporting `dark`. */
function runInitWithDevice(dark: boolean) {
  const listeners = new Set<() => void>();
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: dark,
    media: query,
    addEventListener: (_: string, handler: () => void) => listeners.add(handler),
  }));
  new Function(themeInitScriptSource())();
  return {
    /** Simulates the OS flipping its color scheme mid-session. */
    flipDevice(next: boolean) {
      dark = next;
      for (const handler of listeners) handler();
    },
  };
}

describe("themeInitScriptSource", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    document.documentElement.classList.remove(THEME_DARK_CLASS);
    localStorage.clear();
  });

  it("references the storage key, dark class and device query", () => {
    const source = themeInitScriptSource();
    expect(source).toContain(THEME_STORAGE_KEY);
    expect(source).toContain(THEME_DARK_CLASS);
    expect(source).toContain(DARK_SCHEME_QUERY);
  });

  it("adopts the device's dark scheme when nothing is stored", () => {
    runInitWithDevice(true);
    expect(document.documentElement.classList.contains(THEME_DARK_CLASS)).toBe(true);
  });

  it("stays light on a light-mode device", () => {
    runInitWithDevice(false);
    expect(document.documentElement.classList.contains(THEME_DARK_CLASS)).toBe(false);
  });

  it("lets a stored choice override the device", () => {
    localStorage.setItem(THEME_STORAGE_KEY, "dark");
    runInitWithDevice(false);
    expect(document.documentElement.classList.contains(THEME_DARK_CLASS)).toBe(true);
  });

  it("follows a live device change while nothing is stored", () => {
    const device = runInitWithDevice(false);
    expect(document.documentElement.classList.contains(THEME_DARK_CLASS)).toBe(false);
    device.flipDevice(true);
    expect(document.documentElement.classList.contains(THEME_DARK_CLASS)).toBe(true);
  });

  it("ignores a device change once the visitor picked a theme", () => {
    localStorage.setItem(THEME_STORAGE_KEY, "light");
    const device = runInitWithDevice(false);
    device.flipDevice(true);
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
