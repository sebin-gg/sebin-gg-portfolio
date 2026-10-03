import { describe, expect, it } from "vitest";
import { buildAgentSnapshot, buildLlmsText } from "@/lib/agent";

describe("agent snapshot", () => {
  it("exposes name, links, projects without phone number", () => {
    const snap = buildAgentSnapshot();
    expect(snap.name).toBe("Sebin Mathew");
    expect(snap.links.github).toContain("github.com/sebin-gg");
    expect(snap.projects.length).toBeGreaterThanOrEqual(6);
    expect(JSON.stringify(snap)).not.toMatch(/\+?91?\s?\d{10}/);
  });

  it("builds llms text pointing at agent.json", () => {
    expect(buildLlmsText()).toContain("/agent.json");
  });
});
