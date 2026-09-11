import { describe, expect, it } from "vitest";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { SUPPORTED_LOCALES } from "@/lib/locale";
import { en } from "@/lib/i18n/dictionaries";
import { projects, skills, timeline } from "@/lib/site";

describe("dictionaries loader", () => {
  it("returns the English dictionary for the default locale", () => {
    expect(getDictionary("en")).toBe(en);
  });

  it("serves every manifest locale from a committed file", () => {
    for (const locale of SUPPORTED_LOCALES) {
      const dict = getDictionary(locale);
      expect(dict.meta.title).toBeTruthy();
      expect(dict.nav.about).toBeTruthy();
      expect(dict.footer.location).toBeTruthy();
    }
  });

  it("falls back to English for unknown locales", () => {
    expect(getDictionary("xx")).toBe(en);
  });
});

describe("dictionary shape vs source data", () => {
  it("keeps timeline arrays aligned with site.ts", () => {
    for (const locale of SUPPORTED_LOCALES) {
      const dict = getDictionary(locale);
      expect(dict.experience.roles).toHaveLength(timeline.length);
      expect(dict.experience.periods).toHaveLength(timeline.length);
      expect(dict.experience.summaries).toHaveLength(timeline.length);
      dict.experience.summaries.forEach((paragraphs, i) => {
        expect(paragraphs).toHaveLength(timeline[i].summary.length);
      });
    }
  });

  it("keeps project arrays aligned with site.ts", () => {
    for (const locale of SUPPORTED_LOCALES) {
      const dict = getDictionary(locale);
      expect(dict.projects.taglines).toHaveLength(projects.length);
      expect(dict.projects.descriptions).toHaveLength(projects.length);
      expect(dict.projects.highlights).toHaveLength(projects.length);
    }
  });

  it("keeps skill group names aligned with site.ts", () => {
    for (const locale of SUPPORTED_LOCALES) {
      const dict = getDictionary(locale);
      expect(dict.skills.groups).toHaveLength(skills.length);
    }
  });

  it("translates the three prose-like skill groups", () => {
    for (const locale of SUPPORTED_LOCALES) {
      const items = getDictionary(locale).skills.translatedItems;
      expect(items.performance).toHaveLength(3);
      expect(items.softSkills).toHaveLength(4);
      expect(items.spokenLanguages).toHaveLength(3);
    }
  });

  it("has no ASCII apostrophes in user-facing strings", () => {
    for (const locale of SUPPORTED_LOCALES) {
      const dict = getDictionary(locale);
      const flat: string[] = [
        dict.meta.title,
        dict.hero.viewProjects,
        dict.blogCta.body,
        dict.a11y.lede,
      ];
      for (const text of flat) {
        expect(text).not.toMatch(/'/);
      }
    }
  });
});
