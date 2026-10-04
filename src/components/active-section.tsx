"use client";

import { useEffect } from "react";

// DeepSource's JS-0067 flags every module-scope declaration as a global
// one, but this is an ES module: `export`/`import` makes these
// module-scoped and they cannot leak into a global scope. Suppressed per
// declaration below because the analyzer's exclude_patterns does not take
// effect on this repository. Remove these if DeepSource ever fixes the rule.
type ActiveSectionProps = {
  /** Section ids to watch, in document order. */
  ids: string[];
};

/** Viewport-relative top of a watched section, measured at scroll time. */
export type SpySection = { id: string; top: number };

/**
 * Where the eye rests, as a fraction of viewport height. A section counts as
 * "reached" once its top edge has scrolled above this line.
 */
const READING_LINE = 0.3;

/** Slack for "scrolled to the very bottom", in px. */
const BOTTOM_EPSILON = 2;

const ACTIVE_CLASS = "text-accent";
const DEFAULT_CLASS = "text-ink-soft";

/**
 * Picks the nav entry to highlight.
 *
 * The highlight latches forward: it stays on the most recently *reached*
 * section and only moves when a later one arrives. Picking the topmost
 * intersecting section instead (the previous behavior) let the highlight jump
 * backwards whenever a tall section or a fast flick scrolled past several
 * sections at once, and it cleared entirely at the page bottom where no section
 * sits near the reading line.
 *
 * At the very bottom the last section is pinned, because a short trailing
 * section may never scroll above the reading line.
 *
 * Returns null before the first section is reached, i.e. while the reader is
 * still in the hero and has not arrived anywhere yet.
 */
// skipcq: JS-0067
export function pickActiveSection(
  sections: readonly SpySection[],
  readingLine: number,
  atPageBottom: boolean,
): string | null {
  if (atPageBottom) return lastSectionId(sections);
  return lastReachedId(sections, readingLine);
}

// skipcq: JS-0067
function lastSectionId(sections: readonly SpySection[]): string | null {
  return sections.length > 0 ? sections[sections.length - 1].id : null;
}

// skipcq: JS-0067
function lastReachedId(sections: readonly SpySection[], readingLine: number): string | null {
  let reached: string | null = null;
  for (const section of sections) {
    if (section.top <= readingLine) reached = section.id;
  }
  return reached;
}

// skipcq: JS-0067
function applyActive(id: string) {
  for (const link of Array.from(document.querySelectorAll<HTMLAnchorElement>("a[data-spy]"))) {
    const isActive = link.dataset.spy === id;
    link.classList.toggle(ACTIVE_CLASS, isActive);
    link.classList.toggle(DEFAULT_CLASS, !isActive);
    if (isActive) {
      link.setAttribute("aria-current", "true");
    } else {
      link.removeAttribute("aria-current");
    }
  }
}

// skipcq: JS-0067
export function ActiveSection({ ids }: ActiveSectionProps) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);
    if (elements.length === 0) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const atPageBottom = maxScroll > 0 && window.scrollY >= maxScroll - BOTTOM_EPSILON;
      const measured = elements.map((element) => ({
        id: element.id,
        top: element.getBoundingClientRect().top,
      }));
      // Null means nothing has been reached yet; leave the server-rendered
      // state untouched rather than blanking out every link.
      const active = pickActiveSection(measured, window.innerHeight * READING_LINE, atPageBottom);
      if (active !== null) applyActive(active);
    };
    // Coalesced to one measurement per frame so a fast scroll cannot queue up
    // more layout reads than the browser can paint.
    const schedule = () => {
      if (frame === 0) frame = window.requestAnimationFrame(update);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    // skipcq: JS-0045 — an effect callback legitimately returns its cleanup
    // function; the rule expects a plain void return here.
    return () => {
      if (frame !== 0) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [ids]);

  return null;
}
