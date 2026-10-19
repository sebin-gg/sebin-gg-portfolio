import { describe, expect, it } from "vitest";
import { buildAgentSnapshot, buildLlmsText } from "@/lib/agent";

describe("agent snapshot", () => {
  it("exposes name, links, projects without phone number", () => {
    const snap = buildAgentSnapshot();
    expect(snap.name).toBe("Sebin Mathew");
    expect(snap.links.github).toBe("https://github.com/sebin-gg");
    expect(snap.experience[0]?.href).toBe("https://foces.ceconline.edu/#execom");
    expect(snap).not.toHaveProperty("email");
    expect(snap.links).not.toHaveProperty("email");
    expect(snap.projects.length).toBeGreaterThanOrEqual(6);
    expect(JSON.stringify(snap)).not.toMatch(/\+?91?\s?\d{10}/);
  });

  it("builds llms text pointing at agent.json", () => {
    const text = buildLlmsText();
    expect(text).toContain("/agent.json");
    expect(text).toContain("https://github.com/sebin-gg");
    expect(text).toContain("https://foces.ceconline.edu/#execom");
    expect(text).not.toMatch(/email|mailto:/i);
  });
});
