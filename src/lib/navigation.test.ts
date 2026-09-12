import { describe, expect, it } from "vitest";
import {
  getLogoHref,
  getNavHref,
  getSectionIds,
  isHomeRoute,
  localizedNavItems,
  resolveNavItem,
  resolveNavigation,
} from "@/lib/navigation";
import { getDictionary } from "@/lib/i18n/dictionaries";

describe("navigation module", () => {
  it("determines home route correctly", () => {
    expect(isHomeRoute("/")).toBe(true);
    expect(isHomeRoute("")).toBe(true);
    expect(isHomeRoute(null)).toBe(true);
    expect(isHomeRoute(undefined)).toBe(true);
    expect(isHomeRoute("/blog")).toBe(false);
    expect(isHomeRoute("/projects")).toBe(false);
  });

  it("resolves logo href based on current route", () => {
    expect(getLogoHref("/")).toBe("#top");
    expect(getLogoHref(null)).toBe("#top");
    expect(getLogoHref("/blog")).toBe("/");
  });

  it("resolves nav href for in-page anchors and path routes", () => {
    expect(getNavHref("#about", true)).toBe("#about");
    expect(getNavHref("/blog", true)).toBe("/blog");
    expect(getNavHref("#about", false)).toBe("/#about");
    expect(getNavHref("/blog", false)).toBe("/blog");
  });

  it("resolves single nav item on home and non-home routes", () => {
    const hashItem = { label: "About", href: "#about" };
    const routeItem = { label: "Blog", href: "/blog" };

    const resolvedHashHome = resolveNavItem(hashItem, "/");
    expect(resolvedHashHome).toEqual({
      label: "About",
      rawHref: "#about",
      href: "#about",
      spyId: "about",
      isCurrent: false,
    });

    const resolvedHashBlog = resolveNavItem(hashItem, "/blog");
    expect(resolvedHashBlog).toEqual({
      label: "About",
      rawHref: "#about",
      href: "/#about",
      spyId: "about",
      isCurrent: false,
    });

    const resolvedRouteBlog = resolveNavItem(routeItem, "/blog");
    expect(resolvedRouteBlog).toEqual({
      label: "Blog",
      rawHref: "/blog",
      href: "/blog",
      spyId: undefined,
      isCurrent: true,
    });
  });

  it("resolves full list of navigation items", () => {
    const list = resolveNavigation("/blog");
    expect(list.length).toBeGreaterThan(0);
    const blogEntry = list.find((item) => item.rawHref === "/blog");
    expect(blogEntry?.isCurrent).toBe(true);
    const aboutEntry = list.find((item) => item.rawHref === "#experience");
    expect(aboutEntry?.href).toBe("/#experience");
  });

  it("marks the localized blog page active via canonical path", () => {
    // /hi/blog renders nav href /hi/blog but must match the canonical /blog
    // item for aria-current (regression: locale prefix broke active state).
    const items = localizedNavItems(getDictionary("hi"), "hi");
    const resolved = resolveNavigation("/hi/blog", items);
    const blog = resolved.find((item) => item.rawHref === "/hi/blog");
    expect(blog?.href).toBe("/hi/blog");
    expect(blog?.isCurrent).toBe(true);
  });

  it("keeps off-home hash anchors inside the active locale", () => {
    const items = localizedNavItems(getDictionary("ml"), "ml");
    const resolved = resolveNavigation("/ml/blog", items);
    const about = resolved.find((item) => item.rawHref === "#experience");
    expect(about?.href).toBe("/ml/#experience");
    expect(about?.isCurrent).toBe(false);
  });

  it("extracts section IDs correctly", () => {
    const items = [
      { label: "About", href: "#about" },
      { label: "Blog", href: "/blog" },
      { label: "Skills", href: "#skills" },
    ];
    expect(getSectionIds(items)).toEqual(["about", "skills"]);
  });
});
