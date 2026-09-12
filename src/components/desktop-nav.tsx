"use client";

import type { ResolvedNavItem } from "@/lib/navigation";

/**
 * Presentational desktop nav. The resolved items (labels + hrefs) come from
 * the server-rendered page, so no locale data or pathname lookup is needed
 * in the client bundle. Scroll-spy mutates these links via `data-spy`.
 */
export function DesktopNav({
  items,
  ariaLabel,
}: {
  readonly items: readonly ResolvedNavItem[];
  readonly ariaLabel: string;
}) {
  return (
    <nav aria-label={ariaLabel} className="hidden md:block">
      <ul className="flex items-center gap-1">
        {items.map((item) => (
          <li key={item.rawHref}>
            <a
              href={item.href}
              data-spy={item.spyId}
              aria-current={item.isCurrent ? "page" : undefined}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                item.isCurrent
                  ? "text-accent bg-panel-2/70 font-semibold"
                  : "text-ink-soft hover:text-accent hover:bg-panel-2/60"
              }`}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
