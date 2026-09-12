import { navItems } from "@/lib/site";
import { DEFAULT_LOCALE, localeFromPathname, stripLocalePrefix, type Locale } from "@/lib/locale";
import type { Dictionary } from "@/lib/i18n/types";

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

/** Locale home base joined before hash anchors ("" for English, "/hi" otherwise). */
function localeHomeBase(locale: Locale): string {
  return locale === DEFAULT_LOCALE ? "" : `/${locale}`;
}

/**
 * Resolves an anchor href depending on whether user is currently on a home
 * page. Off-home hash links jump to the same locale's home (`/hi/blog` ->
 * `/hi/#experience`), never crossing languages.
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

/** Resolves the logo anchor: in-page jump on home, same-locale home elsewhere. */
export function getLogoHref(pathname: string | null | undefined): string {
  if (isHomeRoute(pathname)) return "#top";
  return localeHomeBase(localeFromPathname(pathname)) || "/";
}

/**
 * Active-state compares canonical (locale-stripped) paths: /hi/blog is the
 * same page as /blog even though its rendered href carries the prefix.
 */
function isCurrentRoute(item: NavItemDef, canonicalPath: string): boolean {
  return !item.href.startsWith("#") && canonicalPath === stripLocalePrefix(item.href);
}

/** Resolves a single navigation item definition against the active route. */
export function resolveNavItem(
  item: NavItemDef,
  pathname: string | null | undefined,
  locale: Locale = localeFromPathname(pathname),
): ResolvedNavItem {
  const isHome = isHomeRoute(pathname);
  const isHash = item.href.startsWith("#");
  const canonicalPath = stripLocalePrefix(pathname ?? "/");
  return {
    label: item.label,
    rawHref: item.href,
    href: getNavHref(item.href, isHome, locale),
    spyId: isHash ? item.href.slice(1) : undefined,
    isCurrent: isCurrentRoute(item, canonicalPath),
  };
}

/** Resolves all navigation items against the active route. */
export function resolveNavigation(
  pathname: string | null | undefined,
  items: readonly NavItemDef[] = navItems,
  locale?: Locale,
): ResolvedNavItem[] {
  // Pass the locale explicitly on canonical paths (e.g. the header resolves
  // "/blog" while rendering /hi/blog) so hash links stay in-locale.
  return items.map((item) =>
    locale === undefined ? resolveNavItem(item, pathname) : resolveNavItem(item, pathname, locale),
  );
}

/**
 * Builds route-aware nav items: hash anchors stay canonical, the blog route
 * gets a locale prefix, labels come from the locale dictionary.
 */
export function localizedNavItems(dict: Dictionary, locale: Locale): NavItemDef[] {
  const labels = [dict.nav.experience, dict.nav.projects, dict.nav.skills, dict.nav.blog];
  return navItems.map((item, index) => ({
    label: labels[index] ?? item.label,
    href: item.href === "/blog" && locale !== DEFAULT_LOCALE ? `/${locale}/blog` : item.href,
  }));
}

/** Extracts hash target section IDs for scroll-spy observation. */
export function getSectionIds(items: readonly NavItemDef[] = navItems): string[] {
  return items.filter((item) => item.href.startsWith("#")).map((item) => item.href.slice(1));
}
