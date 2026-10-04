import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render } from "@testing-library/react";
import { ActiveSection, pickActiveSection } from "@/components/active-section";

function spyLink(id: string): HTMLAnchorElement {
  return document.querySelector(`a[data-spy="${id}"]`) as HTMLAnchorElement;
}

function expectLinkActive(id: string, active: boolean): void {
  const link = spyLink(id);
  expect(link.classList.contains("text-accent")).toBe(active);
  expect(link.getAttribute("aria-current")).toBe(active ? "true" : null);
}

const LINE = 300;

describe("pickActiveSection", () => {
  it("highlights nothing before the first section is reached", () => {
    expect(
      pickActiveSection(
        [
          { id: "projects", top: 900 },
          { id: "experience", top: 1400 },
          { id: "skills", top: 1900 },
        ],
        LINE,
        false,
      ),
    ).toBeNull();
  });

  it("highlights the last section that scrolled past the reading line", () => {
    expect(
      pickActiveSection(
        [
          { id: "projects", top: -100 },
          { id: "experience", top: -50 },
          { id: "skills", top: 900 },
        ],
        LINE,
        false,
      ),
    ).toBe("experience");
  });

  it("keeps the highlight latched instead of jumping back to an earlier section", () => {
    // A tall section is still far below while the previous one leaves the line:
    // the answer must stay on the most recently reached section.
    const later = [
      { id: "projects", top: -400 },
      { id: "experience", top: 800 },
      { id: "skills", top: 1600 },
    ];
    expect(pickActiveSection(later, LINE, false)).toBe("projects");
  });

  it("pins the last section at the very bottom of the page", () => {
    // A short trailing section never scrolls above the reading line.
    expect(
      pickActiveSection(
        [
          { id: "projects", top: -900 },
          { id: "experience", top: -100 },
          { id: "skills", top: 700 },
        ],
        LINE,
        true,
      ),
    ).toBe("skills");
  });
});

describe("ActiveSection", () => {
  /**
   * Emulates requestAnimationFrame faithfully: callbacks are queued and only run
   * on an explicit flush. Calling the callback synchronously instead would leave
   * the component's "frame pending" guard stuck, hiding the coalescing logic.
   */
  let frames: FrameRequestCallback[] = [];
  let nextFrameId = 1;

  function flushFrames() {
    act(() => {
      const pending = frames;
      frames = [];
      for (const callback of pending) callback(0);
    });
  }

  /**
   * Positions the watched sections and scrolls the page. jsdom has no layout, so
   * both the document height and each rect are stubbed explicitly.
   */
  function setTops(tops: Record<string, number>) {
    for (const [id, top] of Object.entries(tops)) {
      const element = document.getElementById(id) as HTMLElement;
      element.getBoundingClientRect = () => ({ top }) as DOMRect;
    }
  }

  function scrollTo(tops: Record<string, number>, scrollY: number, scrollHeight = 4000) {
    setTops(tops);
    Object.defineProperty(document.documentElement, "scrollHeight", {
      configurable: true,
      value: scrollHeight,
    });
    window.scrollY = scrollY;
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    flushFrames();
  }
  beforeEach(() => {
    document.body.innerHTML = `
      <nav>
        <a href="#projects" data-spy="projects" class="text-ink-soft">Projects</a>
        <a href="#experience" data-spy="experience" class="text-ink-soft">Experience</a>
        <a href="#skills" data-spy="skills" class="text-ink-soft">Skills</a>
        <a href="/blog">Blog</a>
      </nav>
      <section id="projects"></section>
      <section id="experience"></section>
      <section id="skills"></section>
    `;
    // Queue frames instead of running them inline, matching the real API.
    frames = [];
    nextFrameId = 1;
    vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
      frames.push(cb);
      return nextFrameId++;
    });
    vi.stubGlobal("cancelAnimationFrame", () => {});
    window.scrollY = 0;
    window.innerHeight = 1000;
    // Reading line is 30% of 1000px = 300. Start with every section below it,
    // i.e. the reader is still in the hero.
    setTops({ projects: 900, experience: 1400, skills: 1900 });
    Object.defineProperty(document.documentElement, "scrollHeight", {
      configurable: true,
      value: 4000,
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    document.body.innerHTML = "";
  });

  it("leaves every link plain while the hero is still on screen", () => {
    render(<ActiveSection ids={["projects", "experience", "skills"]} />);
    flushFrames();
    expectLinkActive("projects", false);
    expectLinkActive("experience", false);
    expectLinkActive("skills", false);
  });

  it("highlights the section the reader last arrived at", () => {
    render(<ActiveSection ids={["projects", "experience", "skills"]} />);
    scrollTo({ projects: 400, experience: 1200, skills: 2000 }, 0);
    expectLinkActive("projects", false);
    scrollTo({ projects: -50, experience: 1200, skills: 2000 }, 450);
    expectLinkActive("projects", true);
    // Experience only becomes the highlighted entry once its own top has
    // crossed the 300px reading line, not while it is still further down.
    scrollTo({ projects: -450, experience: 100, skills: 2000 }, 850);
    expectLinkActive("experience", true);
    expectLinkActive("projects", false);
  });

  it("pins the last nav entry at the bottom of the page", () => {
    render(<ActiveSection ids={["projects", "experience", "skills"]} />);
    scrollTo({ projects: -2600, experience: -600, skills: 700 }, 3200, 4000);
    expectLinkActive("skills", true);
    expectLinkActive("projects", false);
  });

  it("detaches its listeners on unmount", () => {
    const remove = vi.spyOn(window, "removeEventListener");
    const { unmount } = render(<ActiveSection ids={["projects", "experience", "skills"]} />);
    unmount();
    expect(remove).toHaveBeenCalledWith("scroll", expect.any(Function));
    expect(remove).toHaveBeenCalledWith("resize", expect.any(Function));
  });
});
