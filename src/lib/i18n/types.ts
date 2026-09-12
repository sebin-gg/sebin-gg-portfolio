import type { Locale } from "@/lib/locale";

/**
 * One locale's view of every user-visible string. `en.json` is the source of
 * truth; translated JSON files produced by `gt translate` must satisfy the
 * same shape (enforced structurally in the loader and in tests). Keep array
 * order aligned with `site.ts` (`timeline`, `projects`, `skills`).
 *   * `skills.translatedItems` uses semantic camelCase keys ("performance",
 * "softSkills", "spokenLanguages") — lookup keys, never displayed. The
 * three prose-like groups translate their items; tool-name groups fall
 * back to the source data in every locale (missing key = fallback).
 */
export interface Dictionary {
  meta: {
    title: string;
    description: string;
    blogDescription: string;
    a11yDescription: string;
  };
  common: {
    skipToContent: string;
    language: string;
    toLight: string;
    toDark: string;
  };
  nav: {
    primary: string;
    mobile: string;
    about: string;
    experience: string;
    projects: string;
    skills: string;
    blog: string;
  };
  header: {
    resumeShort: string;
    downloadResume: string;
    openMenu: string;
    closeMenu: string;
  };
  hero: {
    intro: string;
    tagline: string;
    focusAreas: string;
    focus: string[];
    viewProjects: string;
    downloadResume: string;
    githubProfile: string;
    linkedinProfile: string;
    xProfile: string;
    highlights: string;
    emailLabel: string;
    collegeLabel: string;
    collegeLine: string;
    statsProjects: string;
    statsClass: string;
  };
  about: {
    title: string;
    bio: string[];
    quickFacts: string;
    degreeLabel: string;
    degreeValue: string;
    collegeLabel: string;
    collegeValue: string;
    cgpaLabel: string;
  };
  experience: {
    title: string;
    roles: string[];
    periods: string[];
    summaries: string[][];
  };
  projects: {
    title: string;
    taglines: string[];
    descriptions: string[];
    highlights: string[];
    liveDemo: string;
    onGithub: string;
    moreExperiments: string;
  };
  skills: {
    title: string;
    groups: string[];
    translatedItems: Record<string, string[]>;
  };
  blogCta: {
    title: string;
    comingSoon: string;
    body: string;
    link: string;
  };
  blog: {
    title: string;
    lede: string;
    emptyTitle: string;
    emptyBody: string;
    pipeline: string;
    planned: string[];
    followGithub: string;
  };
  a11y: {
    title: string;
    lede: string;
    semanticTitle: string;
    semanticBody: string;
    contrastTitle: string;
    contrastBody: string;
    motionTitle: string;
    motionBefore: string;
    motionAfter: string;
    backToPortfolio: string;
  };
  footer: {
    accessibility: string;
    sendEmail: string;
    githubProfile: string;
    linkedinProfile: string;
    xProfile: string;
    degree: string;
    college: string;
    location: string;
  };
}

export type { Locale };
