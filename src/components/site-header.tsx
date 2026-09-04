import { resumeUrl } from "@/lib/site";
import { getSectionIds } from "@/lib/navigation";
import { BrandLink } from "@/components/brand-link";
import { DesktopNav } from "@/components/desktop-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { MobileNav } from "@/components/mobile-nav";
import { ActiveSection } from "@/components/active-section";
import { DownloadIcon } from "@/components/icons";

const sectionIds = getSectionIds();

export function SiteHeader() {
  return (
    <header className="border-line/70 bg-canvas/80 sticky top-0 z-40 border-b backdrop-blur-lg">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 2xl:max-w-[90rem]">
        <BrandLink />
        <DesktopNav />

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
