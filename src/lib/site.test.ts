import { describe, expect, it } from "vitest";
import { links, navItems, profile, projects, resumeUrl, timeline } from "@/lib/site";

describe("profile", () => {
  it("has the identity fields populated", () => {
    expect(profile.name).toBe("Sebin Mathew");
    expect(profile.email).toMatch(/@/);
    expect(profile.cgpa).toBeGreaterThan(0);
    expect(profile.bio.length).toBeGreaterThan(0);
  });

  it("keeps the phone number off the public page (privacy-first)", () => {
    const pageBlob = JSON.stringify(profile) + JSON.stringify(links);
    // A 10-digit phone run (or +91-prefixed) would be a leak; short digits in
    // usernames/handles like @M13568Sebin are fine.
    expect(pageBlob).not.toMatch(/\+?91?\s?\d{10}/);
  });
});

describe("links", () => {
  it("points to real profiles with absolute https URLs", () => {
    expect(links.github.href).toMatch(/^https:\/\/github\.com\/sebin-gg$/);
    expect(links.linkedin.href).toMatch(/^https:\/\/www\.linkedin\.com\/in\/sebin-gg$/);
    expect(links.x.href).toMatch(/^https:\/\/x\.com\//);
  });
});

describe("navigation", () => {
  it("anchors to sections that exist on the home page", () => {
    const sectionIds = ["about", "experience", "projects", "skills", "contact"];
    const anchors = navItems.filter((item) => item.href.startsWith("#"));
    for (const item of anchors) {
      expect(sectionIds).toContain(item.href.slice(1));
    }
  });

  it("ships the blog as its own route", () => {
    expect(navItems.some((item) => item.href === "/blog")).toBe(true);
  });
});

describe("projects", () => {
  it("has at least six real projects with unique names", () => {
    const names = projects.map((p) => p.name);
    expect(new Set(names).size).toBe(names.length);
    expect(names.length).toBeGreaterThanOrEqual(6);
  });

  it("links every project to github.com/sebin-gg", () => {
    for (const project of projects) {
      expect(project.href).toMatch(/^https:\/\/github\.com\/sebin-gg\/[A-Za-z0-9_.-]+$/);
    }
  });

  it("keeps any live demos absolute and https", () => {
    for (const project of projects) {
      if (project.demo) {
        expect(project.demo).toMatch(/^https:\/\//);
      }
    }
  });
});

describe("timeline", () => {
  it("lists work and program entries with periods", () => {
    for (const item of timeline) {
      expect(item.period).toMatch(/\d{4}/);
      expect(item.summary.length).toBeGreaterThan(0);
    }
    expect(timeline.some((item) => item.kind === "work")).toBe(true);
    expect(timeline.some((item) => item.kind === "program")).toBe(true);
  });
});

describe("resume", () => {
  it("is served from a stable public path", () => {
    expect(resumeUrl).toBe("/resume.pdf");
  });
});
