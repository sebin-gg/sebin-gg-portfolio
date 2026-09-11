"use client";

import dynamic from "next/dynamic";
import type { ResolvedNavItem } from "@/lib/navigation";
import { useIdle } from "@/lib/use-idle";
import { MenuIcon, SunIcon } from "@/components/icons";

/**
 * The header's interactive widgets are progressive enhancement: the page is
 * fully usable without them (theme is set by the inline init script, nav links
 * are plain anchors). Hydrating them before the user needs them only adds
 * main-thread work inside the Total Blocking Time window, so each widget is
 * code-split and mounted only after the main thread goes idle.
 */

const buttonShell =
  "border-line/80 bg-panel/90 text-ink-soft flex h-10 w-10 items-center justify-center rounded-lg border shadow-xs backdrop-blur-xs";

function ThemeToggleFallback() {
  return (
    <span aria-hidden="true" className={buttonShell}>
      <SunIcon className="h-5 w-5" />
    </span>
  );
}

function MobileNavFallback() {
  return (
    <span aria-hidden="true" className={buttonShell}>
      <MenuIcon className="h-5 w-5" />
    </span>
  );
}

const ThemeToggleWidget = dynamic(() => import("./theme-toggle").then((m) => m.ThemeToggle), {
  ssr: false,
  loading: () => <ThemeToggleFallback />,
});

const MobileNavWidget = dynamic(() => import("./mobile-nav").then((m) => m.MobileNav), {
  ssr: false,
  loading: () => <MobileNavFallback />,
});

const ActiveSectionWidget = dynamic(() => import("./active-section").then((m) => m.ActiveSection), {
  ssr: false,
});

export function DeferredThemeToggle({
  lightLabel,
  darkLabel,
}: {
  lightLabel: string;
  darkLabel: string;
}) {
  const ready = useIdle();
  return ready ? (
    <ThemeToggleWidget lightLabel={lightLabel} darkLabel={darkLabel} />
  ) : (
    <ThemeToggleFallback />
  );
}

export function DeferredMobileNav({
  items,
  mobileLabel,
  openLabel,
  closeLabel,
  resumeLabel,
}: {
  items: readonly ResolvedNavItem[];
  mobileLabel: string;
  openLabel: string;
  closeLabel: string;
  resumeLabel: string;
}) {
  const ready = useIdle();
  return ready ? (
    <MobileNavWidget
      items={items}
      navLabel={mobileLabel}
      openLabel={openLabel}
      closeLabel={closeLabel}
      resumeLabel={resumeLabel}
    />
  ) : (
    <MobileNavFallback />
  );
}

export function DeferredActiveSection({ ids }: { ids: string[] }) {
  const ready = useIdle();
  return ready ? <ActiveSectionWidget ids={ids} /> : null;
}
