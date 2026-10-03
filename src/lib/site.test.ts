import { describe, expect, it } from "vitest";
import {
  communities,
  links,
  navItems,
  profile,
  projects,
  recommendations,
  resolveSiteUrl,
  resumeUrl,
  runTerminalCommand,
  siteUrl,
  terminalCommands,
  terminalResponses,
  timeline,
} from "@/lib/site";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "@/lib/locale";

describe("siteUrl", () => {
  it("resolves to an absolute https origin by default", () => {
    expect(siteUrl).toMatch(/^https:\/\/[\w.-]+$/);
  });

  it("accepts an absolute URL and strips trailing slash and path", () => {
    expect(resolveSiteUrl("https://example.com/")).toBe("https://example.com");
    expect(resolveSiteUrl("https://example.com/sub/")).toBe("https://example.com/sub");
    expect(resolveSiteUrl("http://localhost:3000")).toBe("http://localhost:3000");
  });

  it("strips repeated trailing slashes from non-root paths", () => {
    expect(resolveSiteUrl("https://example.com/sub//")).toBe("https://example.com/sub");
    expect(resolveSiteUrl("https://example.com/sub///")).toBe("https://example.com/sub");
  });

  it("falls back to the production origin on empty or whitespace input", () => {
    expect(resolveSiteUrl(undefined)).toBe("https://sebin-gg.vercel.app");
    expect(resolveSiteUrl("")).toBe("https://sebin-gg.vercel.app");
    expect(resolveSiteUrl("   ")).toBe("https://sebin-gg.vercel.app");
  });

  it("rejects relative URLs with a clear error", () => {
    expect(() => resolveSiteUrl("/blog")).toThrow(/absolute http\(s\) URL/);
    expect(() => resolveSiteUrl("ftp://example.com")).toThrow(/absolute http\(s\) URL/);
  });
});

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
    const sectionIds = ["top", "experience", "projects", "communities", "skills", "terminal"];
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

describe("communities", () => {
  it("lists real communities with a role each", () => {
    expect(communities.length).toBeGreaterThanOrEqual(3);
    for (const community of communities) {
      expect(community.name).toBeTruthy();
      expect(community.role).toBeTruthy();
    }
  });

  it("keeps one dictionary role line per community", () => {
    for (const locale of SUPPORTED_LOCALES) {
      expect(getDictionary(locale).communities.roles).toHaveLength(communities.length);
    }
  });
});

describe("recommendations", () => {
  it("ships no invented praise while the list is empty", () => {
    expect(recommendations).toEqual([]);
  });
});

describe("terminal commands", () => {
  it("answers every advertised command with output (clear resets instead)", () => {
    for (const command of terminalCommands) {
      const result = runTerminalCommand(command);
      if (command === "clear") {
        expect(result.clear).toBe(true);
        expect(result.output).toBe("");
      } else {
        expect(result.output.length).toBeGreaterThan(0);
      }
    }
  });

  it("treats empty input as help and ignores case and padding", () => {
    expect(runTerminalCommand("")).toEqual(runTerminalCommand("help"));
    expect(runTerminalCommand("  WHOAMI  ")).toEqual(runTerminalCommand("whoami"));
  });

  it("only points anchors at sections that exist on the home page", () => {
    const sectionIds = ["top", "experience", "projects", "skills"];
    for (const command of terminalCommands) {
      const { anchor } = runTerminalCommand(command);
      if (anchor) expect(sectionIds).toContain(anchor.slice(1));
    }
  });

  it("flags clear so the client can reset the transcript", () => {
    expect(runTerminalCommand("clear").clear).toBe(true);
  });

  it("reports unknown commands without throwing", () => {
    expect(runTerminalCommand("nope").output).toContain("nope");
  });

  it("treats inherited Object keys as unknown commands", () => {
    // A plain `table[command]` lookup resolves `constructor`, `toString` and
    // `__proto__` to inherited members. Those are truthy, so the command would
    // render with `output === undefined` instead of the unknown-command reply.
    for (const key of ["constructor", "toString", "__proto__", "valueOf", "hasOwnProperty"]) {
      const result = runTerminalCommand(key);
      // `runTerminalCommand` lowercases input, so the echoed token is too.
      expect(result.output, key).toContain("Unknown command");
      expect(result.output, key).toContain(key.toLowerCase());
      expect(result.anchor, key).toBeNull();
    }
  });

  it("renders every reply in the active locale", () => {
    // The terminal used to hard-code English output, so /hi and /ml showed
    // English replies under localized chrome. Each locale must now drive the
    // templates, including the unknown-command path. Asserting against the
    // dictionary's own template keeps this locale-agnostic.
    for (const locale of SUPPORTED_LOCALES) {
      const { responses } = getDictionary(locale).terminal;
      expect(runTerminalCommand("help", responses).output, locale).toBe(
        responses.help.replace("{commands}", terminalCommands.join("  ")),
      );
      expect(runTerminalCommand("nope", responses).output, locale).toBe(
        responses.unknown.replace("{command}", "nope"),
      );
      // Placeholders must all resolve; a leftover `{token}` ships to users.
      for (const command of terminalCommands) {
        const output = runTerminalCommand(command, responses).output;
        expect(output, `${locale}/${command}`).not.toMatch(/\{\w+\}/);
      }
      // A locale that silently fell back to the English source would satisfy
      // every check above, so assert the templates are genuinely translated.
      if (locale !== DEFAULT_LOCALE) {
        expect(responses.help, locale).not.toBe(terminalResponses.help);
        expect(responses.unknown, locale).not.toBe(terminalResponses.unknown);
      }
    }
  });

  it("keeps every locale's response keys in step with the English source", () => {
    const expected = Object.keys(terminalResponses).sort();
    for (const locale of SUPPORTED_LOCALES) {
      expect(Object.keys(getDictionary(locale).terminal.responses).sort(), locale).toEqual(
        expected,
      );
    }
  });
});
