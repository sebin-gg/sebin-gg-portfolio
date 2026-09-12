"use client";

import { useState } from "react";
import { resumeUrl } from "@/lib/site";
import type { ResolvedNavItem } from "@/lib/navigation";
import { CloseIcon, DownloadIcon, MenuIcon } from "@/components/icons";

function NavLink({
  item,
  onClick,
}: {
  readonly item: ResolvedNavItem;
  readonly onClick: () => void;
}) {
  return (
    <li>
      <a
        href={item.href}
        onClick={onClick}
        aria-current={item.isCurrent ? "page" : undefined}
        className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
          item.isCurrent
            ? "text-accent bg-panel-2/70 font-semibold"
            : "text-ink hover:bg-panel-2 hover:text-accent"
        }`}
      >
        {item.label}
      </a>
    </li>
  );
}

function ToggleIcon({ open }: { readonly open: boolean }) {
  if (open) return <CloseIcon className="h-5 w-5" />;
  return <MenuIcon className="h-5 w-5" />;
}

/**
 * Mobile menu. Local state is the only client concern; labels and the
 * resolved nav list arrive via props from the server-rendered header.
 */
export function MobileNav({
  items,
  navLabel,
  openLabel,
  closeLabel,
  resumeLabel,
}: {
  readonly items: readonly ResolvedNavItem[];
  readonly navLabel: string;
  readonly openLabel: string;
  readonly closeLabel: string;
  readonly resumeLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const label = open ? closeLabel : openLabel;

  function close() {
    setOpen(false);
  }

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((v) => !v)}
        className="border-line/80 bg-panel/90 text-ink-soft hover:border-accent hover:text-accent flex h-10 w-10 items-center justify-center rounded-lg border shadow-xs backdrop-blur-xs transition-all"
      >
        <ToggleIcon open={open} />
      </button>

      {open ? (
        <nav
          id="mobile-menu"
          aria-label={navLabel}
          className="border-line/80 bg-panel/95 absolute inset-x-0 top-full z-50 mt-2 max-h-[calc(100dvh-5rem)] overflow-y-auto rounded-xl border p-3 shadow-xl backdrop-blur-md"
        >
          <ul className="flex flex-col">
            {items.map((item) => (
              <NavLink key={item.rawHref} item={item} onClick={close} />
            ))}

            <li>
              <a
                href={resumeUrl}
                onClick={close}
                className="border-line/80 text-ink hover:border-accent hover:text-accent mt-1.5 flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors"
              >
                <DownloadIcon className="h-4 w-4" />
                {resumeLabel}
              </a>
            </li>
          </ul>
        </nav>
      ) : null}
    </div>
  );
}
