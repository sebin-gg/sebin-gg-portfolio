"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { navItems, resumeUrl } from "@/lib/site";
import { CloseIcon, DownloadIcon, MenuIcon } from "@/components/icons";

function getNavHref(itemHref: string, isHome: boolean): string {
  if (isHome || !itemHref.startsWith("#")) return itemHref;
  return `/${itemHref}`;
}

function getNavItemProps(itemHref: string, isHome: boolean, pathname: string) {
  const isHash = itemHref.startsWith("#");
  return {
    href: getNavHref(itemHref, isHome),
    isCurrent: !isHash && pathname === itemHref,
  };
}

function NavLink(props: {
  itemHref: string;
  label: string;
  isHome: boolean;
  pathname: string;
  onClick: () => void;
}) {
  const { href, isCurrent } = getNavItemProps(props.itemHref, props.isHome, props.pathname);
  return (
    <li>
      <a
        href={href}
        onClick={props.onClick}
        aria-current={isCurrent ? "page" : undefined}
        className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
          isCurrent
            ? "text-accent bg-panel-2/70 font-semibold"
            : "text-ink hover:bg-panel-2 hover:text-accent"
        }`}
      >
        {props.label}
      </a>
    </li>
  );
}

function ToggleIcon({ open }: { open: boolean }) {
  if (open) return <CloseIcon className="h-5 w-5" />;
  return <MenuIcon className="h-5 w-5" />;
}

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isHome = !pathname || pathname === "/";
  const label = open ? "Close menu" : "Open menu";

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
          aria-label="Mobile"
          className="border-line/80 bg-panel/95 absolute inset-x-0 top-full z-50 mt-2 max-h-[calc(100dvh-5rem)] overflow-y-auto rounded-xl border p-3 shadow-xl backdrop-blur-md"
        >
          <ul className="flex flex-col">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                itemHref={item.href}
                label={item.label}
                isHome={isHome}
                pathname={pathname}
                onClick={close}
              />
            ))}

            <li>
              <a
                href={resumeUrl}
                onClick={close}
                className="border-line/80 text-ink hover:border-accent hover:text-accent mt-1.5 flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors"
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
