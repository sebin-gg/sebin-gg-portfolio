"use client";

import { useRef, useState } from "react";
import { MOTION_ATTRIBUTE, resolveMotionParam } from "@/lib/motion";
import { runTerminalCommand, terminalCommands, terminalFacts } from "@/lib/site";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { DEFAULT_LOCALE, type Locale } from "@/lib/locale";
import { SectionHeading } from "@/components/section-heading";

// DeepSource's JS-0067 flags every module-scope declaration as a global one,
// but this is an ES module, so `export`/`import` keeps these module-scoped and
// they cannot leak into a global scope. Each declaration below carries a
// `skipcq` because the analyzer's exclude_patterns does not take effect on this
// repository. Drop them if DeepSource ever fixes the rule.

/**
 * Monotonic id per entry. Index-based keys collide once the transcript
 * scrolls (the list is capped, so indices shift down), which would remount
 * rows and re-fire their fade on every unrelated command.
 */
// skipcq: JS-0067
type Entry = { id: number; command: string; output: string };

/** Per-line stagger for the run fade, in ms. */
const FADE_STAGGER_MS = 45;

// skipcq: JS-0067
const fadeStyle = (index: number): React.CSSProperties =>
  ({ "--fade-delay": `${index * FADE_STAGGER_MS}ms` }) as React.CSSProperties;

// skipcq: JS-0067
function motionAllowed() {
  const override = resolveMotionParam(document.documentElement.getAttribute(MOTION_ATTRIBUTE));
  if (override) return override === "on";
  return !(window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false);
}

// skipcq: JS-0067
function scrollTargetIntoView(target: Element) {
  target.scrollIntoView({ behavior: motionAllowed() ? "smooth" : "auto" });
}

// skipcq: JS-0067
function scrollToAnchor(anchor: string | null) {
  const target = anchor ? document.querySelector(anchor) : null;
  if (target) scrollTargetIntoView(target);
}

/**
 * Playground terminal. Tiny client island: commands resolve from a static
 * table in site.ts, no network, no parsing.
 */
// skipcq: JS-0067
export function Terminal({ locale = DEFAULT_LOCALE }: { readonly locale?: Locale }) {
  const dict = getDictionary(locale);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [value, setValue] = useState("");
  const lastId = useRef(0);

  function run(command: string) {
    const { output, anchor, clear } = runTerminalCommand(
      command,
      dict.terminal.responses,
      terminalFacts(dict),
    );
    if (clear) setEntries([]);
    else {
      lastId.current += 1;
      const entry = { id: lastId.current, command: command.trim() || "help", output };
      setEntries((prev) => [...prev.slice(-7), entry]);
      scrollToAnchor(anchor);
    }
    setValue("");
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    run(value);
  }

  return (
    <section
      id="terminal"
      aria-labelledby="terminal-title"
      className="mx-auto w-full max-w-7xl scroll-mt-20 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 2xl:max-w-[90rem]"
    >
      <SectionHeading id="terminal-title" title={dict.terminal.title} lede={dict.terminal.lede} />
      <div
        data-terminal-panel
        data-clarity-mask="true"
        className="border-line/80 bg-panel/90 shadow-glow/10 mx-auto max-w-4xl overflow-hidden rounded-2xl border font-mono text-base shadow-lg backdrop-blur-xs"
      >
        <div className="border-line/70 bg-panel-2/40 flex items-center justify-between border-b px-4 py-3 sm:px-5">
          <div aria-hidden="true" className="flex items-center gap-1.5">
            <span className="bg-ink-faint/50 size-2 rounded-full" />
            <span className="bg-accent-soft size-2 rounded-full" />
            <span className="bg-accent/80 size-2 rounded-full" />
          </div>
          <span className="text-ink-faint text-xs tracking-wide">{dict.terminal.title}</span>
          <span aria-hidden="true" className="text-accent/80 text-xs">
            $_
          </span>
        </div>

        <div className="bg-panel/60 p-3 sm:p-4">
          <div className="border-line/60 bg-canvas/80 min-h-48 overflow-y-auto rounded-xl border p-4 shadow-inner sm:min-h-56 sm:p-5">
            <div aria-live="polite" className="space-y-2 leading-relaxed">
              {entries.length === 0 ? (
                <p className="text-ink-faint flex items-center gap-2">
                  <span aria-hidden="true" className="text-accent font-semibold">
                    $
                  </span>
                  <span>{dict.terminal.hint}</span>
                </p>
              ) : null}
              {entries.map((entry, index) => (
                <div
                  key={entry.id}
                  style={fadeStyle(index)}
                  className="motion-allowed:animate-[terminal-fade_320ms_ease-out_both] motion-allowed:[animation-delay:var(--fade-delay)]"
                >
                  <p className="text-ink">
                    <span aria-hidden="true" className="text-accent mr-2">
                      $
                    </span>
                    {entry.command}
                  </p>
                  <p className="text-ink-soft mt-0.5 pl-5">{entry.output}</p>
                </div>
              ))}
            </div>
          </div>
          <form
            onSubmit={submit}
            className="border-line/80 bg-panel-2/50 focus-within:border-accent focus-within:ring-accent/20 mt-3 flex items-center gap-2 rounded-xl border px-3 py-2 transition-colors focus-within:ring-2"
          >
            <label htmlFor="terminal-input" className="sr-only">
              {dict.terminal.label}
            </label>
            <span aria-hidden="true" className="text-accent font-semibold">
              $
            </span>
            <input
              id="terminal-input"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder={dict.terminal.placeholder}
              autoComplete="off"
              spellCheck={false}
              className="text-ink placeholder:text-ink-faint caret-accent min-w-0 flex-1 bg-transparent px-1 py-2 outline-none focus-visible:outline-none"
            />
            <button
              type="submit"
              className="bg-accent text-accent-ink hover:bg-accent-strong shrink-0 rounded-lg px-4 py-2 text-sm font-semibold transition-colors"
            >
              {dict.terminal.run}
            </button>
          </form>
          <div className="border-line/60 text-ink-faint mt-4 flex items-center justify-between border-t pt-3 text-xs">
            <span className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="bg-accent motion-allowed:animate-pulse size-1.5 rounded-full"
              />
              {dict.terminal.commands}
            </span>
            <output aria-label={dict.terminal.commands} className="text-ink-soft tabular-nums">
              {terminalCommands.length.toString().padStart(2, "0")}
            </output>
          </div>
          {/*
            The command list lives here as wrapping chips rather than inside the
            input's placeholder: a nine-command placeholder string overflows the
            single-line input and gets clipped after "resume", so the commands
            past it were unreadable. Chips wrap, stay legible at any width, and
            double as click-to-run.
          */}
          <div
            role="group"
            aria-label={dict.terminal.commands}
            className="mt-2 flex flex-wrap gap-1.5"
          >
            {terminalCommands.map((command) => (
              <button
                key={command}
                type="button"
                onClick={() => run(command)}
                aria-label={`${dict.terminal.runCommand}: ${command}`}
                className="border-line/80 bg-panel-2/70 text-ink-soft hover:border-accent hover:text-accent rounded-md border px-2 py-1 font-mono text-xs transition-colors"
              >
                {command}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
