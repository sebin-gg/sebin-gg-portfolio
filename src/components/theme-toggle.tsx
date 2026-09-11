"use client";

import { useSyncExternalStore } from "react";
import { MoonIcon, SunIcon } from "@/components/icons";
import { getThemeSnapshot, subscribeTheme, toggleTheme } from "@/lib/theme";

function getServerSnapshot(): boolean {
  return false;
}

function ToggleIcon({ dark }: { dark: boolean }) {
  return dark ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />;
}

export function ThemeToggle({
  lightLabel = "Switch to light mode",
  darkLabel = "Switch to dark mode",
}: {
  lightLabel?: string;
  darkLabel?: string;
}) {
  const dark = useSyncExternalStore(subscribeTheme, getThemeSnapshot, getServerSnapshot);
  const label = dark ? lightLabel : darkLabel;

  return (
    <button
      type="button"
      onClick={() => toggleTheme()}
      aria-label={label}
      title={label}
      className="border-line/80 bg-panel/90 text-ink-soft hover:border-accent hover:text-accent flex h-10 w-10 items-center justify-center rounded-lg border shadow-xs backdrop-blur-xs transition-all"
    >
      <ToggleIcon dark={dark} />
    </button>
  );
}
