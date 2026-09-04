import { describe, expect, it } from "vitest";
import {
  getLogoHref,
  getNavHref,
  getSectionIds,
  isHomeRoute,
  resolveNavItem,
  resolveNavigation,
} from "@/lib/navigation";

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
    const aboutEntry = list.find((item) => item.rawHref === "#about");
    expect(aboutEntry?.href).toBe("/#about");
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
