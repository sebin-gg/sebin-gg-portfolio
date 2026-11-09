import { describe, expect, it } from "vitest";
import { buildAgentSnapshot, buildLlmsText } from "@/lib/agent";
import { links, profile } from "@/lib/site";

describe("agent snapshot", () => {
  it("exposes name, links, projects without phone number", () => {
    const snap = buildAgentSnapshot();
    expect(snap.name).toBe("Sebin Mathew");
    expect(snap.links.github).toBe("https://github.com/sebin-gg");
    expect(snap.experience[0]?.href).toBe("https://foces.ceconline.edu/#execom");
    expect(snap.email).toBe(profile.email);
    expect(snap.links.email).toBe(links.email.href);
    expect(snap.projects.length).toBeGreaterThanOrEqual(6);
    expect(JSON.stringify(snap)).not.toMatch(/\+?91?\s?\d{10}/);
  });

  it("builds llms text pointing at agent.json", () => {
    const text = buildLlmsText();
    expect(text).toContain("/agent.json");
    expect(text).toContain("https://github.com/sebin-gg");
    expect(text).toContain("https://foces.ceconline.edu/#execom");
    expect(text).toContain(`- Email: ${profile.email}`);
    expect(text).toContain("## Blog");
    expect(text).toContain("/blog/slowlang-a-language-that-punishes-fast-typing");
  });
});
