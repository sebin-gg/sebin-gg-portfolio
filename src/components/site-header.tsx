"use client";

import { usePathname } from "next/navigation";
import { navItems, resumeUrl } from "@/lib/site";
import { ThemeToggle } from "@/components/theme-toggle";
import { MobileNav } from "@/components/mobile-nav";
import { ActiveSection } from "@/components/active-section";
import { DownloadIcon } from "@/components/icons";

const sectionIds = navItems
  .filter((item) => item.href.startsWith("#"))
  .map((item) => item.href.slice(1));

function getNavHref(itemHref: string, isHome: boolean): string {
  if (isHome || !itemHref.startsWith("#")) return itemHref;
  return `/${itemHref}`;
}

function getNavItemProps(itemHref: string, isHome: boolean, pathname: string) {
  const isHash = itemHref.startsWith("#");
  return {
    href: getNavHref(itemHref, isHome),
    spyId: isHash ? itemHref.slice(1) : undefined,
    isCurrent: !isHash && pathname === itemHref,
  };
}

export function SiteHeader() {
  const pathname = usePathname();
  const isHome = !pathname || pathname === "/";
  const logoHref = isHome ? "#top" : "/";

  return (
    <header className="border-line/70 bg-canvas/80 sticky top-0 z-40 border-b backdrop-blur-lg">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
        <a
          href={logoHref}
          className="text-ink hover:text-accent rounded-lg text-[15px] font-bold tracking-tight transition-colors"
        >
          Sebin Mathew<span className="text-accent">.</span>
        </a>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => {
              const { href, spyId, isCurrent } = getNavItemProps(item.href, isHome, pathname);
              return (
                <li key={item.href}>
                  <a
                    href={href}
                    data-spy={spyId}
                    aria-current={isCurrent ? "page" : undefined}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                      isCurrent
                        ? "text-accent bg-panel-2/70 font-semibold"
                        : "text-ink-soft hover:text-accent hover:bg-panel-2/60"
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {/* Tablet: icon-only résumé (no room for the label); full button from lg. */}
          <a
            href={resumeUrl}
            aria-label="Download résumé"
            title="Download résumé"
            className="bg-accent text-accent-ink hover:bg-accent-strong shadow-accent/20 hidden h-10 w-10 items-center justify-center rounded-lg shadow-sm transition-all hover:shadow-md md:flex lg:hidden"
          >
            <DownloadIcon className="h-4 w-4" />
          </a>
          <a
            href={resumeUrl}
            className="bg-accent text-accent-ink hover:bg-accent-strong shadow-accent/20 hidden items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold shadow-sm transition-all hover:shadow-md lg:flex"
          >
            <DownloadIcon className="h-4 w-4" />
            Résumé
          </a>
          <MobileNav />
        </div>
      </div>
      <ActiveSection ids={sectionIds} />
    </header>
  );
}
