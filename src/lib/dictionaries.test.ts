import { describe, expect, it } from "vitest";
import type { Locale } from "@/lib/locale";
import { SUPPORTED_LOCALES } from "@/lib/locale";
import { getDictionary, localizedNavItems } from "@/lib/dictionaries";
import { navItems, profile, projects, siteMeta, skills, timeline } from "@/lib/site";

const locales = [...SUPPORTED_LOCALES];

function dicts() {
  return locales.map((locale) => getDictionary(locale as Locale));
}

describe("getDictionary", () => {
  it("covers every supported locale and defaults to English", () => {
    for (const locale of locales) {
      expect(getDictionary(locale as Locale).locale).toBe(locale);
    }
    expect(getDictionary("en").metaTitle).toBe(siteMeta.title);
  });

  it("derives English copy from site.ts so it cannot drift", () => {
    const dict = getDictionary("en");
    expect(dict.heroRole).toBe(profile.role);
    expect(dict.heroTagline).toBe(profile.tagline);
    expect([...dict.heroFocus]).toEqual([...profile.focus]);
    expect([...dict.bio]).toEqual([...profile.bio]);
    expect(dict.degreeValue).toBe(profile.degree);
    expect(dict.collegeValue).toBe(profile.college);
    expect([...dict.timelineTitles]).toEqual(timeline.map((item) => item.title));
    expect([...dict.timelinePeriods]).toEqual(timeline.map((item) => item.period));
    expect(dict.timelineSummaries.map((summary) => [...summary])).toEqual(
      timeline.map((item) => [...item.summary]),
    );
    expect([...dict.projectTaglines]).toEqual(projects.map((project) => project.tagline));
    expect([...dict.projectDescriptions]).toEqual(projects.map((project) => project.description));
    expect([...dict.skillGroups]).toEqual(skills.map((group) => group.group));
    expect(dict.skillItems.map((items) => [...items])).toEqual(
      skills.map((group) => [...group.items]),
    );
    expect(dict.navAbout).toBe(navItems[0].label);
    expect(dict.navBlog).toBe(navItems[4].label);
  });

  it("keeps every locale aligned with the site content counts", () => {
    for (const dict of dicts()) {
      expect(dict.timelineTitles).toHaveLength(timeline.length);
      expect(dict.timelinePeriods).toHaveLength(timeline.length);
      expect(dict.timelineSummaries).toHaveLength(timeline.length);
      dict.timelineSummaries.forEach((summary, index) => {
        expect(summary).toHaveLength(timeline[index].summary.length);
      });
      expect(dict.projectTaglines).toHaveLength(projects.length);
      expect(dict.projectDescriptions).toHaveLength(projects.length);
      expect(dict.projectHighlights).toHaveLength(projects.length);
      expect(dict.skillGroups).toHaveLength(skills.length);
      expect(dict.skillItems).toHaveLength(skills.length);
      dict.skillItems.forEach((items, index) => {
        expect(items).toHaveLength(skills[index].items.length);
      });
      expect(dict.heroFocus).toHaveLength(profile.focus.length);
      expect(dict.bio.length).toBeGreaterThan(0);
      expect(dict.planned.length).toBeGreaterThan(0);
    }
  });

  it("leaves no translated string empty", () => {
    const texts = (locale: Locale) => {
      const dict = getDictionary(locale);
      return [
        dict.skipToContent,
        dict.navAbout,
        dict.navExperience,
        dict.navProjects,
        dict.navSkills,
        dict.navBlog,
        dict.resumeShort,
        dict.downloadResume,
        dict.heroRole,
        dict.heroTagline,
        dict.viewProjects,
        dict.aboutTitle,
        dict.experienceTitle,
        dict.projectsTitle,
        dict.skillsTitle,
        dict.blogTitle,
        dict.blogCtaLink,
        dict.emptyTitle,
        dict.followGithub,
        dict.a11yTitle,
        dict.backToPortfolio,
        dict.footerAccessibility,
        dict.metaTitle,
        dict.metaDescription,
        ...dict.bio,
        ...dict.timelineTitles,
        ...dict.timelinePeriods,
        ...dict.projectTaglines,
        ...dict.projectDescriptions,
        ...dict.skillGroups,
        ...dict.planned,
      ];
    };
    for (const locale of ["hi", "ml"] as const) {
      for (const text of texts(locale)) {
        expect(text.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("translates the section chrome into Hindi and Malayalam", () => {
    expect(getDictionary("hi").aboutTitle).toBe("मैं कौन हूँ");
    expect(getDictionary("ml").aboutTitle).toBe("ഞാൻ ആരാണ്");
    expect(getDictionary("hi").projectsTitle).toBe("जो मैंने बनाया है");
    expect(getDictionary("ml").projectsTitle).toBe("ഞാൻ നിർമ്മിച്ചവ");
    expect(getDictionary("hi").viewProjects).toBe("प्रोजेक्ट्स देखें");
    expect(getDictionary("ml").viewProjects).toBe("പ്രോജക്ടുകൾ കാണുക");
  });

  it("keeps proper nouns readable: project names stay Latin", () => {
    expect(getDictionary("hi").projectTaglines[0]).toContain("टाइपिंग");
    expect(getDictionary("ml").projectDescriptions[3]).toContain("Ollama");
  });
});

describe("localizedNavItems", () => {
  it("keeps canonical hrefs with English labels", () => {
    const items = localizedNavItems(getDictionary("en"), "en");
    expect(items.map((item) => item.href)).toEqual(navItems.map((item) => item.href));
    expect(items.map((item) => item.label)).toEqual(navItems.map((item) => item.label));
  });

  it("translates labels and prefixes the blog route per locale", () => {
    const hi = localizedNavItems(getDictionary("hi"), "hi");
    expect(hi[0]).toEqual({ label: "परिचय", href: "#about" });
    expect(hi.find((item) => item.label === "ब्लॉग")).toEqual({
      label: "ब्लॉग",
      href: "/hi/blog",
    });
    const ml = localizedNavItems(getDictionary("ml"), "ml");
    expect(ml.find((item) => item.label === "ബ്ലോഗ്")).toEqual({
      label: "ബ്ലോഗ്",
      href: "/ml/blog",
    });
  });
});
