"use client";

import { useRef, useState } from "react";
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
function prefersReducedMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

// skipcq: JS-0067
function scrollTargetIntoView(target: Element) {
  target.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
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
        className="border-line/80 bg-panel/90 mx-auto max-w-2xl rounded-xl border p-4 font-mono text-sm shadow-sm backdrop-blur-xs sm:p-5"
      >
        <div aria-live="polite" className="space-y-2">
          {entries.length === 0 ? <p className="text-ink-faint">$ {dict.terminal.hint}</p> : null}
          {entries.map((entry, index) => (
            <div
              key={entry.id}
              style={fadeStyle(index)}
              className="motion-safe:animate-[terminal-fade_320ms_ease-out_both] motion-safe:[animation-delay:var(--fade-delay)]"
            >
              <p className="text-ink">
                <span aria-hidden="true" className="text-accent mr-2">
                  $
                </span>
                {entry.command}
              </p>
              <p className="text-ink-soft mt-0.5">{entry.output}</p>
            </div>
          ))}
        </div>
        <form onSubmit={submit} className="mt-4 flex items-center gap-2">
          <label htmlFor="terminal-input" className="sr-only">
            {dict.terminal.label}
          </label>
          <span aria-hidden="true" className="text-accent">
            $
          </span>
          <input
            id="terminal-input"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder={dict.terminal.placeholder}
            autoComplete="off"
            spellCheck={false}
            className="bg-canvas border-line/80 text-ink placeholder:text-ink-faint focus:border-accent min-w-0 flex-1 rounded-lg border px-3 py-2 outline-none"
          />
          <button
            type="submit"
            className="bg-accent text-accent-ink hover:bg-accent-strong shrink-0 rounded-lg px-4 py-2 text-sm font-semibold transition-colors"
          >
            {dict.terminal.run}
          </button>
        </form>
        {/*
          The command list lives here as wrapping chips rather than inside the
          input's placeholder: a nine-command placeholder string overflows the
          single-line input and gets clipped after "resume", so the commands
          past it were unreadable. Chips wrap, stay legible at any width, and
          double as click-to-run.
        */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span className="text-ink-faint mr-0.5 text-xs">{dict.terminal.commands}</span>
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
    </section>
  );
}
