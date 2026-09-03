"use client";

import { useSyncExternalStore } from "react";
import { MoonIcon, SunIcon } from "@/components/icons";
import { THEME_DARK_CLASS, THEME_STORAGE_KEY, htmlHasDarkClass } from "@/lib/theme";

const THEME_EVENT = "themechange";

function subscribe(onStoreChange: () => void): () => void {
  window.addEventListener(THEME_EVENT, onStoreChange);
  return () => window.removeEventListener(THEME_EVENT, onStoreChange);
}

function getSnapshot(): boolean {
  return htmlHasDarkClass(document);
}

function getServerSnapshot(): boolean {
  return false;
}

export function ThemeToggle() {
  const dark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function toggle() {
    const next = !dark;
    document.documentElement.classList.toggle(THEME_DARK_CLASS, next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next ? "dark" : "light");
    } catch {
      // Storage can be unavailable (private mode); the class still flips.
    }
    // Notify subscribers so useSyncExternalStore re-reads the class.
    window.dispatchEvent(new Event(THEME_EVENT));
  }

  const label = dark ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="border-line bg-panel text-ink-soft hover:border-line-strong hover:text-accent flex h-10 w-10 items-center justify-center rounded-md border transition-colors"
    >
      {dark ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
    </button>
  );
}
