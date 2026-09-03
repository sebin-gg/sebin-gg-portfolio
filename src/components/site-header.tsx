import { navItems, resumeUrl } from "@/lib/site";
import { ThemeToggle } from "@/components/theme-toggle";
import { MobileNav } from "@/components/mobile-nav";
import { DownloadIcon, TerminalIcon } from "@/components/icons";

export function SiteHeader() {
  return (
    <header className="border-line bg-canvas/85 sticky top-0 z-40 border-b backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
        <a
          href="#top"
          className="text-ink flex items-center gap-2 rounded-md font-mono text-sm font-semibold"
        >
          <TerminalIcon className="text-accent h-4 w-4" />
          sebin<span className="text-accent">@</span>portfolio
        </a>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-ink-soft hover:text-accent rounded-md px-2.5 py-2 text-sm font-medium transition-colors lg:px-3"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a
            href={resumeUrl}
            className="bg-accent text-accent-ink hover:bg-accent-strong hidden items-center gap-2 rounded-md px-3.5 py-2 text-sm font-semibold transition-colors lg:flex"
          >
            <DownloadIcon className="h-4 w-4" />
            Résumé
          </a>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
