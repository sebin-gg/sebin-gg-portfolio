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

/**
 * The site is dark by default — the brand is a terminal. Light is an opt-out
 * the user stores explicitly; the OS preference does not override either.
 */
export function resolveThemeIsDark(stored: Theme | null): boolean {
  return stored !== "light";
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
    if (localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)}) !== "light") {
      document.documentElement.classList.add(${JSON.stringify(THEME_DARK_CLASS)});
    }
  } catch (e) {
    // Storage can be blocked (private mode); dark is the default anyway.
  }
})();
`;
  return script;
}
