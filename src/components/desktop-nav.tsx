"use client";

import { usePathname } from "next/navigation";
import { getDictionary, localizedNavItems } from "@/lib/dictionaries";
import { localeFromPathname } from "@/lib/locale";
import { resolveNavigation } from "@/lib/navigation";

export function DesktopNav() {
  const pathname = usePathname();
  const locale = localeFromPathname(pathname);
  const dict = getDictionary(locale);
  const items = resolveNavigation(pathname, localizedNavItems(dict, locale));

  return (
    <nav aria-label={dict.primaryNav} className="hidden md:block">
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
