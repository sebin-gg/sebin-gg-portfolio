import { profile } from "@/lib/site";

export function TerminalCard() {
  const { prompt, lines } = profile.terminal;
  const maxCmd = Math.max(...lines.map((line) => line.cmd.length));

  return (
    <div
      aria-label="Terminal demo"
      role="group"
      className="border-line bg-panel overflow-hidden rounded-lg border shadow-sm dark:shadow-[0_0_70px_-20px_var(--glow)]"
    >
      <div className="border-line bg-panel-2 flex items-center gap-1.5 border-b px-4 py-2.5">
        <span className="bg-terminal-dot h-3 w-3 rounded-full opacity-90" />
        <span className="bg-line-strong h-3 w-3 rounded-full" />
        <span className="bg-line h-3 w-3 rounded-full" />
        <span className="text-ink-faint ml-3 font-mono text-xs">sebin — zsh</span>
      </div>
      <div className="space-y-3 p-4 font-mono text-[13px] leading-relaxed sm:p-5 sm:text-sm">
        {lines.map((line) => (
          <p key={line.cmd}>
            <span className="text-accent">{prompt}</span>
            <span className="text-ink-faint">:~$ </span>
            <span className="text-ink">{line.cmd.padEnd(maxCmd, " ")}</span>
            <br />
            <span className="text-ink-soft">{line.out}</span>
          </p>
        ))}
        <p className="caret">
          <span className="text-accent">{prompt}</span>
          <span className="text-ink-faint">:~$ </span>
        </p>
      </div>
    </div>
  );
}
