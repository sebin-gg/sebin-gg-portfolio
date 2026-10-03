import { afterEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { Hero } from "@/components/hero";
import { Experience } from "@/components/experience";
import { Projects } from "@/components/projects";
import { Communities } from "@/components/communities";
import { Recommendations } from "@/components/recommendations";
import { Skills } from "@/components/skills";
import { Terminal } from "@/components/terminal";
import { BlogEmptyState } from "@/components/blog-empty-state";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { communities, links, profile, projects, timeline } from "@/lib/site";

describe("Hero", () => {
  it("shows the name, role and primary actions", () => {
    render(<Hero />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(profile.name);
    expect(screen.getByRole("link", { name: "View projects" })).toHaveAttribute(
      "href",
      "#projects",
    );
    expect(screen.getByRole("link", { name: /download résumé/i })).toHaveAttribute(
      "href",
      "/resume.pdf",
    );
  });

  it("links to the social profiles", () => {
    render(<Hero />);
    expect(screen.getByRole("link", { name: "GitHub profile" })).toHaveAttribute(
      "href",
      links.github.href,
    );
    expect(screen.getByRole("link", { name: "LinkedIn profile" })).toHaveAttribute(
      "href",
      links.linkedin.href,
    );
    expect(screen.getByRole("link", { name: "X profile" })).toHaveAttribute("href", links.x.href);
  });

  it("renders profile highlights with the monogram and key facts", () => {
    render(<Hero />);
    const card = screen.getByRole("complementary", { name: "Profile highlights" });
    expect(within(card).getByText("SM")).toBeInTheDocument();
    expect(within(card).queryByText(/Education/i)).not.toBeInTheDocument();
    expect(within(card).getByText(profile.email)).toBeInTheDocument();
    expect(within(card).getByText(profile.college)).toBeInTheDocument();
    expect(within(card).getByText(profile.degree)).toBeInTheDocument();
    expect(within(card).getByText(String(profile.cgpa))).toBeInTheDocument();
    expect(within(card).queryByText(/open to internships/i)).not.toBeInTheDocument();
  });
});

describe("Experience", () => {
  it("lists every timeline entry with its org", () => {
    render(<Experience />);
    for (const item of timeline) {
      expect(screen.getByText(item.title)).toBeInTheDocument();
      expect(
        screen.getAllByText(new RegExp(item.org.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))).length,
      ).toBeGreaterThanOrEqual(1);
    }
  });
});

describe("Projects", () => {
  it("renders a card per project with a repo link", () => {
    render(<Projects />);
    for (const project of projects) {
      expect(screen.getByRole("link", { name: `${project.name} on GitHub` })).toHaveAttribute(
        "href",
        project.href,
      );
    }
  });

  it("shows the live demo link only for projects that have one", () => {
    render(<Projects />);
    const demoCount = projects.filter((p) => p.demo).length;
    const plainCount = projects.filter((p) => !p.demo).length;
    expect(screen.getAllByRole("link", { name: "Live demo" })).toHaveLength(demoCount);
    expect(plainCount).toBeGreaterThan(0);
  });
});

describe("Skills", () => {
  it("groups skills with a heading per group", () => {
    render(<Skills />);
    expect(screen.getByRole("heading", { name: "Toolbox" })).toBeInTheDocument();
    expect(screen.getByText("Languages")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
  });

  it("lists performance, soft skills and spoken languages", () => {
    render(<Skills />);
    expect(screen.getByText("Performance")).toBeInTheDocument();
    expect(screen.getByText("Core Web Vitals")).toBeInTheDocument();
    expect(screen.getByText("Soft skills")).toBeInTheDocument();
    expect(screen.getByText("Project coordination")).toBeInTheDocument();
    expect(screen.getByText("Spoken languages")).toBeInTheDocument();
    expect(screen.getByText("Malayalam")).toBeInTheDocument();
  });
});

describe("Communities", () => {
  it("renders one card per community with its translated role", () => {
    render(<Communities />);
    expect(screen.getByRole("heading", { name: "Where I show up" })).toBeInTheDocument();
    for (const community of communities) {
      expect(screen.getByText(community.name)).toBeInTheDocument();
    }
    expect(screen.getAllByText(/Project Coordinator/i).length).toBeGreaterThan(0);
  });
});

describe("Recommendations", () => {
  it("renders nothing while there is no real praise to show", () => {
    const { container } = render(<Recommendations />);
    expect(container).toBeEmptyDOMElement();
  });
});

describe("Terminal", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    document.querySelector("#top")?.remove();
  });

  function runWhoamiWithMotionPreference(reducedMotion: boolean) {
    const target = document.createElement("div");
    target.id = "top";
    target.scrollIntoView = vi.fn();
    document.body.append(target);
    vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({ matches: reducedMotion }));
    render(<Terminal />);
    fireEvent.change(screen.getByLabelText("Terminal command"), { target: { value: "whoami" } });
    fireEvent.click(screen.getByRole("button", { name: "Run" }));
    return target.scrollIntoView as ReturnType<typeof vi.fn>;
  }

  it("runs a command and prints its output", async () => {
    render(<Terminal />);
    expect(screen.getByText(/type help and press Enter/i)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Terminal command"), { target: { value: "whoami" } });
    fireEvent.click(screen.getByRole("button", { name: "Run" }));
    expect(screen.getByText(new RegExp(profile.name))).toBeInTheDocument();
  });

  it("uses immediate scrolling when reduced motion is enabled", () => {
    const scrollIntoView = runWhoamiWithMotionPreference(true);
    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: "auto" });
  });

  it("uses smooth scrolling when reduced motion is not enabled", () => {
    const scrollIntoView = runWhoamiWithMotionPreference(false);
    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth" });
  });

  it("clears the transcript on clear", async () => {
    render(<Terminal />);
    const input = screen.getByLabelText("Terminal command");
    fireEvent.change(input, { target: { value: "whoami" } });
    fireEvent.click(screen.getByRole("button", { name: "Run" }));
    fireEvent.change(input, { target: { value: "clear" } });
    fireEvent.click(screen.getByRole("button", { name: "Run" }));
    expect(screen.getByText(/type help and press Enter/i)).toBeInTheDocument();
  });
});

describe("BlogEmptyState", () => {
  it("says the blog is coming soon and lists planned posts", () => {
    render(<BlogEmptyState />);
    expect(screen.getByText(/no posts yet/i)).toBeInTheDocument();
    expect(screen.getByText(/in the pipeline/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Follow on GitHub" })).toHaveAttribute(
      "href",
      "https://github.com/sebin-gg",
    );
  });

  it("links the RSS feed from the dictionary string", () => {
    render(<BlogEmptyState />);
    expect(screen.getByRole("link", { name: "Subscribe via RSS" })).toHaveAttribute(
      "href",
      "/rss.xml",
    );
  });
});

describe("SiteHeader", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("exposes navigation, theme toggle and résumé", async () => {
    // The theme toggle hydrates after the main thread goes idle.
    vi.useFakeTimers();
    render(<SiteHeader />);
    expect(screen.getByRole("navigation", { name: "Primary" })).toBeInTheDocument();
    const resumeLinks = screen.getAllByRole("link", { name: /résumé/i });
    expect(resumeLinks.length).toBeGreaterThan(0);
    for (const link of resumeLinks) {
      expect(link).toHaveAttribute("href", "/resume.pdf");
    }

    await act(async () => {
      vi.advanceTimersByTime(400);
    });
    vi.useRealTimers();
    expect(await screen.findByRole("button", { name: /switch to/i })).toBeInTheDocument();
  });
});

describe("SiteFooter", () => {
  it("credits the owner and repeats the social links", () => {
    render(<SiteFooter />);
    expect(screen.getByText(new RegExp(`© \\d{4} ${profile.name}`))).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "GitHub profile" }).length).toBeGreaterThan(0);
    expect(screen.getByText(/Kottayam, Kerala, India/)).toBeInTheDocument();
  });
});
