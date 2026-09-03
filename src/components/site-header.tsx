import { navItems, resumeUrl } from "@/lib/site";
import { ThemeToggle } from "@/components/theme-toggle";
import { MobileNav } from "@/components/mobile-nav";
import { ActiveSection } from "@/components/active-section";
import { DownloadIcon } from "@/components/icons";

const sectionIds = navItems
  .filter((item) => item.href.startsWith("#"))
  .map((item) => item.href.slice(1));

export function SiteHeader() {
  return (
    <header className="border-line bg-canvas/85 sticky top-0 z-40 border-b backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
        <a href="#top" className="text-ink rounded-md text-[15px] font-bold tracking-tight">
          Sebin Mathew<span className="text-accent">.</span>
        </a>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => {
              const spyId = item.href.startsWith("#") ? item.href.slice(1) : undefined;
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    data-spy={spyId}
                    className="text-ink-soft hover:text-accent rounded-md px-3 py-1.5 text-sm font-medium transition-colors"
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
            className="bg-accent text-accent-ink hover:bg-accent-strong hidden h-10 w-10 items-center justify-center rounded-md transition-colors md:flex lg:hidden"
          >
            <DownloadIcon className="h-4 w-4" />
          </a>
          <a
            href={resumeUrl}
            className="bg-accent text-accent-ink hover:bg-accent-strong hidden items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition-colors lg:flex"
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
