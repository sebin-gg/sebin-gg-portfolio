import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { describe, it, expect } from "vitest";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

/**
 * AGENTS.md is the repo's prompt layer: agents follow it literally. These tests
 * keep its highest-stakes invariants from drifting (see AGENTS.md rule 10 —
 * prompt files are maintained like code).
 */
describe("AGENTS.md invariants", () => {
  const agents = readFileSync(join(repoRoot, "AGENTS.md"), "utf8");

  it("keeps the PR lifecycle in exactly one rule (no 9/10 duplication)", () => {
    const prRuleCount = (agents.match(/PR lifecycle/g) ?? []).length;
    expect(prRuleCount).toBe(1);
    expect(agents).not.toMatch(/rule 9\b|rule-9\b|per rule 9/);
  });

  it("states the review-bot policy unambiguously (explicit reviewer list, no bare 'supported bots')", () => {
    expect(agents).toMatch(/CodeRabbit, SonarCloud, Sourcery, Greptile, DeepSource/);
    expect(agents).not.toMatch(/supported reviewer bots|enabled reviewer\(s\)\b/);
    expect(agents).toMatch(/unavailable bots never block/);
  });

  it("keeps the re-trigger policy stated once (no contradiction between 'sparingly' and 'push and re-trigger')", () => {
    const triggerMentions = (agents.match(/re-trigger/gi) ?? []).length;
    expect(triggerMentions).toBeLessThanOrEqual(2); // rule statement + (optional) skills note
    expect(agents).not.toMatch(/Push fixes and\s+re-trigger/);
    expect(agents).toMatch(/at most once per round/);
  });

  it("defines the 'valid finding' rubric", () => {
    expect(agents).toMatch(/valid = reproducible in this repo or a real future bug/);
  });

  it("names the deletion gate for prompt-file additions", () => {
    expect(agents).toMatch(/without naming the rule it replaces/);
  });

  it("keeps inner-loop section from duplicating the Commands table", () => {
    expect(agents).toMatch(/this section only adds what the table\s+does not say/);
    expect(agents).not.toMatch(/Iterate with `pnpm verify:fast` only/);
  });

  it("anchors dark-mode sync mechanism to theme.ts as single source of truth", () => {
    expect(agents).toMatch(/single source of\s+truth for this logic/);
    expect(agents).not.toMatch(/must stay in sync with it/);
  });

  it("anchors the human-voice standard to the unslop core contract", () => {
    expect(agents).toMatch(/references\/core-contract\.md/);
  });

  it("anchors skill summaries to skills-lock.json hashes", () => {
    const lock = JSON.parse(readFileSync(join(repoRoot, "skills-lock.json"), "utf8")) as {
      skills: Record<string, { computedHash: string }>;
    };
    expect(lock.skills.caveman.computedHash).toMatch(/^[0-9a-f]{64}$/);
    expect(lock.skills.unslop.computedHash).toMatch(/^[0-9a-f]{64}$/);
    for (const hash of [lock.skills.caveman.computedHash, lock.skills.unslop.computedHash]) {
      expect(agents).toContain(hash.slice(0, 8));
    }
  });
});
