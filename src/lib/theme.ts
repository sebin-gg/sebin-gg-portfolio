export const THEME_STORAGE_KEY = "theme";
export const THEME_DARK_CLASS = "dark";
export const THEME_EVENT = "themechange";

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
 * The site is dark by default with a modern, executive aesthetic.
 * Light is an opt-out the user stores explicitly; the OS preference
 * does not override either.
 */
export function resolveThemeIsDark(stored: Theme | null): boolean {
  return stored !== "light";
}

/** Whether the <html> element currently carries the dark class. */
export function htmlHasDarkClass(doc: { documentElement: { classList: DOMTokenList } }): boolean {
  return doc.documentElement.classList.contains(THEME_DARK_CLASS);
}

/** Subscribes to theme change events on the window. */
export function subscribeTheme(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }
  window.addEventListener(THEME_EVENT, onStoreChange);
  return () => window.removeEventListener(THEME_EVENT, onStoreChange);
}

/** Reads the current theme snapshot from document. */
export function getThemeSnapshot(): boolean {
  if (typeof document === "undefined") {
    return false;
  }
  return htmlHasDarkClass(document);
}

function persistThemePreference(dark: boolean): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, dark ? "dark" : "light");
  } catch {
    // Storage can be unavailable in private browsing mode.
  }
}

function dispatchThemeEvent(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(THEME_EVENT));
  }
}

/** Toggles between light and dark, updating DOM, localStorage and dispatching event. */
export function toggleTheme(): boolean {
  if (typeof document === "undefined") {
    return false;
  }
  const nextDark = !htmlHasDarkClass(document);
  document.documentElement.classList.toggle(THEME_DARK_CLASS, nextDark);
  persistThemePreference(nextDark);
  dispatchThemeEvent();
  return nextDark;
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
