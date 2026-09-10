import { afterEach, describe, expect, it, vi } from "vitest";
import { act, render, screen, within } from "@testing-library/react";
import { Hero } from "@/components/hero";
import { About } from "@/components/about";
import { Experience } from "@/components/experience";
import { Projects } from "@/components/projects";
import { Skills } from "@/components/skills";
import { BlogEmptyState } from "@/components/blog-empty-state";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { links, profile, projects, timeline } from "@/lib/site";

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
    expect(within(card).queryByText(/open to internships/i)).not.toBeInTheDocument();
  });
});

describe("About", () => {
  it("renders the bio and the quick-facts card", () => {
    render(<About />);
    expect(screen.getByRole("heading", { name: "Who I am" })).toBeInTheDocument();
    expect(screen.getByText(profile.degree)).toBeInTheDocument();
    expect(screen.queryByText(/Open to work/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Kottayam, Kerala, India/)).not.toBeInTheDocument();
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
