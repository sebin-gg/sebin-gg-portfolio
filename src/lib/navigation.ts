import { navItems } from "@/lib/site";

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

/** Determines whether the given pathname represents the home root route. */
export function isHomeRoute(pathname: string | null | undefined): boolean {
  return !pathname || pathname === "/";
}

/** Resolves the logo anchor: in-page jump on home, root navigation elsewhere. */
export function getLogoHref(pathname: string | null | undefined): string {
  return isHomeRoute(pathname) ? "#top" : "/";
}

/** Resolves an anchor href depending on whether user is currently on the home page. */
export function getNavHref(itemHref: string, isHome: boolean): string {
  if (isHome || !itemHref.startsWith("#")) {
    return itemHref;
  }
  return `/${itemHref}`;
}

/** Resolves a single navigation item definition against the active route. */
export function resolveNavItem(
  item: NavItemDef,
  pathname: string | null | undefined,
): ResolvedNavItem {
  const isHome = isHomeRoute(pathname);
  const isHash = item.href.startsWith("#");
  return {
    label: item.label,
    rawHref: item.href,
    href: getNavHref(item.href, isHome),
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
