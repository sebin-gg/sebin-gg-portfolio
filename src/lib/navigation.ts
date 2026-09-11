import { navItems } from "@/lib/site";
import {
  DEFAULT_LOCALE,
  localeFromPathname,
  localePath,
  stripLocalePrefix,
  type Locale,
} from "@/lib/locale";

export interface NavItemDef {
  label: string;
  href: string;
}

export interface ResolvedNavItem {
  label: string;
  rawHref: string;
  href: string;
  spyId?: string;
  isCurrent: boolean;
}

/**
 * Determines whether the given pathname represents a home route in any locale
 * (`/` and `/hi` are both home; `/blog` and `/hi/blog` are not).
 */
export function isHomeRoute(pathname: string | null | undefined): boolean {
  if (!pathname) return true;
  return stripLocalePrefix(pathname) === "/";
}

/**
 * Resolves the logo anchor: in-page jump on home, otherwise the same
 * locale's home route (`/hi/blog` -> `/hi`, `/blog` -> `/`).
 */
export function getLogoHref(pathname: string | null | undefined): string {
  return isHomeRoute(pathname) ? "#top" : localePath(localeFromPathname(pathname), "/");
}

/** Locale home base joined before hash anchors ("" for English, "/hi" otherwise). */
function localeHomeBase(locale: Locale): string {
  return locale === DEFAULT_LOCALE ? "" : `/${locale}`;
}

/**
 * Resolves an anchor href depending on whether user is currently on a home
 * page. Off-home hash links jump to the same locale's home (`/hi/blog` ->
 * `/hi/#about`), never crossing languages.
 */
export function getNavHref(
  itemHref: string,
  isHome: boolean,
  locale: Locale = DEFAULT_LOCALE,
): string {
  if (isHome || !itemHref.startsWith("#")) {
    return itemHref;
  }
  return `${localeHomeBase(locale)}/${itemHref}`;
}

/** Resolves a single navigation item definition against the active route. */
export function resolveNavItem(
  item: NavItemDef,
  pathname: string | null | undefined,
): ResolvedNavItem {
  const isHome = isHomeRoute(pathname);
  const locale = localeFromPathname(pathname);
  const isHash = item.href.startsWith("#");
  return {
    label: item.label,
    rawHref: item.href,
    href: getNavHref(item.href, isHome, locale),
    spyId: isHash ? item.href.slice(1) : undefined,
    isCurrent: !isHash && pathname === item.href,
  };
}

/** Resolves all navigation items against the active route. */
export function resolveNavigation(
  pathname: string | null | undefined,
  items: readonly NavItemDef[] = navItems,
): ResolvedNavItem[] {
  return items.map((item) => resolveNavItem(item, pathname));
}

/** Extracts hash target section IDs for scroll-spy observation. */
export function getSectionIds(items: readonly NavItemDef[] = navItems): string[] {
  return items.filter((item) => item.href.startsWith("#")).map((item) => item.href.slice(1));
}
