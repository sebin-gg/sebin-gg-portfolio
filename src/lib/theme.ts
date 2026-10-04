export const THEME_STORAGE_KEY = "theme";
export const THEME_DARK_CLASS = "dark";
export const THEME_EVENT = "themechange";

/** Media query carrying the device's own light/dark preference. */
export const DARK_SCHEME_QUERY = "(prefers-color-scheme: dark)";

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

/** Runs a media query defensively, for environments without matchMedia. */
function queryMatches(win: Pick<Window, "matchMedia"> | null, query: string): boolean {
  const matchMedia = win?.matchMedia;
  if (typeof matchMedia !== "function") return false;
  try {
    return matchMedia.call(win, query).matches === true;
  } catch {
    return false;
  }
}

/**
 * Whether the device reports a dark color scheme. Tolerant of environments
 * without matchMedia (jsdom stubs, very old browsers): those are treated as
 * light rather than throwing during the pre-paint script.
 */
export function prefersDarkScheme(win: Pick<Window, "matchMedia"> | null = globalThis.window) {
  return queryMatches(win, DARK_SCHEME_QUERY);
}

/**
 * An explicit stored choice always wins. With no stored choice the device
 * preference decides, so first-time visitors on a light-mode phone get the
 * light theme instead of being forced onto the dark default.
 */
export function resolveThemeIsDark(
  stored: Theme | null,
  systemDark = prefersDarkScheme(),
): boolean {
  if (stored === "dark") return true;
  if (stored === "light") return false;
  return systemDark;
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

/**
 * Returns the raw inline script that applies the theme class before paint.
 *
 * It runs in <head> before first paint, so the correct palette is on <html>
 * with no flash. It also keeps following the device while the visitor has made
 * no explicit choice: flipping the OS to dark mid-session switches the site
 * over, whereas an explicit toggle is persisted and then always wins.
 *
 * The logic is duplicated from resolveThemeIsDark/storedTheme on purpose: it
 * cannot import them before the bundle loads.
 */
export function themeInitScriptSource(): string {
  const key = JSON.stringify(THEME_STORAGE_KEY);
  const darkClass = JSON.stringify(THEME_DARK_CLASS);
  const query = JSON.stringify(DARK_SCHEME_QUERY);
  const script = `
(function () {
  var KEY = ${key}, CLASS = ${darkClass};
  function stored() {
    try { return window.localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function media() {
    try { return window.matchMedia(${query}); } catch (e) { return null; }
  }
  function isDark() {
    var saved = stored();
    if (saved === "dark") return true;
    if (saved === "light") return false;
    var mq = media();
    return !!(mq && mq.matches);
  }
  function apply() {
    document.documentElement.classList.toggle(CLASS, isDark());
    window.dispatchEvent(new Event(${JSON.stringify(THEME_EVENT)}));
  }
  apply();
  // Follow the device, but only while nothing has been explicitly stored, so
  // an explicit toggle is never undone by an OS change.
  var mq = media();
  if (mq && mq.addEventListener) {
    mq.addEventListener("change", function () {
      if (stored() === null) apply();
    });
  }
})();
`;
  return script;
}
