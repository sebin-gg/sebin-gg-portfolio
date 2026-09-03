export const THEME_STORAGE_KEY = "theme";
export const THEME_DARK_CLASS = "dark";

export type Theme = "dark" | "light";

/** Reads the stored preference; returns null when nothing is stored. */
export function storedTheme(storage: Pick<Storage, "getItem">): Theme | null {
  try {
    const value = storage.getItem(THEME_STORAGE_KEY);
    return value === "dark" || value === "light" ? value : null;
  } catch {
    return null;
  }
}

/** Whether dark mode should win given the stored value and OS preference. */
export function prefersDarkTheme(stored: Theme | null, systemPrefersDark: boolean): boolean {
  if (stored !== null) return stored === "dark";
  return systemPrefersDark;
}

/** Whether the <html> element currently carries the dark class. */
export function htmlHasDarkClass(doc: { documentElement: { classList: DOMTokenList } }): boolean {
  return doc.documentElement.classList.contains(THEME_DARK_CLASS);
}

/** Returns the raw inline script that applies the theme class before paint. */
export function themeInitScriptSource(): string {
  const script = `
(function () {
  try {
    var stored = localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});
    var dark =
      stored === ${JSON.stringify("dark")} ||
      (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches);
    if (dark) {
      document.documentElement.classList.add(${JSON.stringify(THEME_DARK_CLASS)});
    }
  } catch (e) {
    // Storage can be blocked (private mode); fall back to the default theme.
  }
})();
`;
  return script;
}
