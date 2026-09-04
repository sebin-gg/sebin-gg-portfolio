"use client";

import { useSyncExternalStore } from "react";
import { MoonIcon, SunIcon } from "@/components/icons";
import { getThemeSnapshot, subscribeTheme, toggleTheme } from "@/lib/theme";

function getServerSnapshot(): boolean {
  return false;
}

export function ThemeToggle() {
  const dark = useSyncExternalStore(subscribeTheme, getThemeSnapshot, getServerSnapshot);
  const label = dark ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button
      type="button"
      onClick={() => toggleTheme()}
      aria-label={label}
      title={label}
      className="border-line/80 bg-panel/90 text-ink-soft hover:border-accent hover:text-accent flex h-10 w-10 items-center justify-center rounded-lg border shadow-xs backdrop-blur-xs transition-all"
    >
      {dark ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
    </button>
  );
}
