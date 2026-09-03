import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render } from "@testing-library/react";
import { ActiveSection } from "@/components/active-section";

function entry(id: string, isIntersecting: boolean, top: number): IntersectionObserverEntry {
  return {
    isIntersecting,
    target: { id },
    boundingClientRect: { top },
  } as unknown as IntersectionObserverEntry;
}

function spyLink(id: string): HTMLAnchorElement {
  return document.querySelector(`a[data-spy="${id}"]`) as HTMLAnchorElement;
}

function expectLinkActive(id: string, active: boolean): void {
  const link = spyLink(id);
  expect(link.classList.contains("text-accent")).toBe(active);
  expect(link.getAttribute("aria-current")).toBe(active ? "true" : null);
}

describe("ActiveSection", () => {
  let callback: IntersectionObserverCallback;
  let observed: Element[];

  beforeEach(() => {
    document.body.innerHTML = `
      <nav>
        <a href="#about" data-spy="about" class="text-ink-soft">About</a>
        <a href="#skills" data-spy="skills" class="text-ink-soft">Skills</a>
        <a href="/blog">Blog</a>
      </nav>
      <section id="about"></section>
      <section id="skills"></section>
    `;
    observed = [];

    class FakeIntersectionObserver {
      constructor(cb: IntersectionObserverCallback) {
        callback = cb;
      }
      observe(el: Element) {
        observed.push(el);
      }
      disconnect() {
        /* noop */
      }
    }

    vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    document.body.innerHTML = "";
  });

  it("observes every watched section", () => {
    render(<ActiveSection ids={["about", "skills"]} />);
    expect(observed.map((el) => el.id).sort()).toEqual(["about", "skills"]);
  });

  it("marks the topmost intersecting section's link as active", () => {
    render(<ActiveSection ids={["about", "skills"]} />);
    const noObserver = {} as IntersectionObserver;
    act(() => {
      callback([entry("about", true, 120), entry("skills", true, 400)], noObserver);
    });
    expectLinkActive("about", true);
    expectLinkActive("skills", false);
  });

  it("clears the active state when no section intersects", () => {
    render(<ActiveSection ids={["about", "skills"]} />);
    const noObserver = {} as IntersectionObserver;
    act(() => {
      callback([entry("about", true, 120)], noObserver);
      callback([entry("about", false, 120), entry("skills", false, 400)], noObserver);
    });
    expectLinkActive("about", false);
  });
});
