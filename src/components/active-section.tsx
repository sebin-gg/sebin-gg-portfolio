"use client";

import { useEffect } from "react";

type ActiveSectionProps = {
  /** Section ids to watch, in document order. */
  ids: string[];
};

const ACTIVE_CLASS = "text-accent";
const DEFAULT_CLASS = "text-ink-soft";

/** Picks the intersecting entry whose box is highest in the viewport. */
function topmost(entries: IntersectionObserverEntry[]): IntersectionObserverEntry | null {
  let best: IntersectionObserverEntry | null = null;
  let bestTop = Number.POSITIVE_INFINITY;
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    if (entry.boundingClientRect.top < bestTop) {
      best = entry;
      bestTop = entry.boundingClientRect.top;
    }
  }
  return best;
}

function applyActive(id: string | null) {
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

export function ActiveSection({ ids }: ActiveSectionProps) {
  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const pinLastAtBottom = () => {
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      if (maxScroll > 0 && window.scrollY >= maxScroll - 2 && ids.length > 0) {
        applyActive(ids[ids.length - 1]);
      }
    };

    let observer: IntersectionObserver | null = null;
    let stopPinning: (() => void) | undefined;
    if (sections.length > 0 && typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        (entries) => {
          const hit = topmost(entries);
          // At page bottom no section sits in band; clearing here makes nav flicker.
          // Keep last active instead. Bottom pin handled by scroll listener below.
          if (hit) applyActive(hit.target.id);
        },
        { rootMargin: "-35% 0px -55% 0px", threshold: 0 },
      );
      for (const section of sections) observer.observe(section);
      window.addEventListener("scroll", pinLastAtBottom, { passive: true });
      pinLastAtBottom();
      stopPinning = () => window.removeEventListener("scroll", pinLastAtBottom);
    }
    return () => {
      stopPinning?.();
      observer?.disconnect();
    };
  }, [ids]);

  return null;
}
