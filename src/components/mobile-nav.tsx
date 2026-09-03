"use client";

import { useState } from "react";
import { navItems, resumeUrl } from "@/lib/site";
import { CloseIcon, DownloadIcon, MenuIcon } from "@/components/icons";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  function close() {
    setOpen(false);
  }

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((v) => !v)}
        className="border-line bg-panel text-ink-soft hover:text-accent flex h-10 w-10 items-center justify-center rounded-md border transition-colors"
      >
        {open ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
      </button>

      {open ? (
        <nav
          id="mobile-menu"
          aria-label="Mobile"
          className="border-line bg-panel absolute inset-x-0 top-full z-50 mt-2 max-h-[calc(100dvh-5rem)] overflow-y-auto rounded-lg border p-3 shadow-lg"
        >
          <ul className="flex flex-col">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={close}
                  className="text-ink hover:bg-panel-2 hover:text-accent block rounded-md px-3 py-2.5 text-sm font-medium transition-colors"
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href={resumeUrl}
                onClick={close}
                className="border-line text-ink hover:border-accent hover:text-accent mt-1 flex items-center gap-2 rounded-md border px-3 py-2.5 text-sm font-medium transition-colors"
              >
                <DownloadIcon className="h-4 w-4" />
                Résumé
              </a>
            </li>
          </ul>
        </nav>
      ) : null}
    </div>
  );
}
