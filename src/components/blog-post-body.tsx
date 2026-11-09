import type { ReactNode } from "react";
import type { BlogPostBlock } from "@/lib/blog";

/**
 * Renders the minimal inline marks post bodies use: `[label](https://url)`
 * external links and `**strong**` spans. Everything else passes through as
 * plain text — the catalogue is data, not a markdown document.
 */
const INLINE_PATTERN = /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)|\*\*([^*]+)\*\*/g;

// skipcq: JS-0067 — module-scoped function, not a global declaration
function inlinePart(match: RegExpExecArray, key: number): ReactNode {
  if (match[1] !== undefined && match[2] !== undefined) {
    return (
      <a
        key={key}
        href={match[2]}
        target="_blank"
        rel="noopener noreferrer"
        className="text-accent decoration-accent/40 hover:decoration-accent underline underline-offset-2 transition-colors"
      >
        {match[1]}
      </a>
    );
  }
  return <strong key={key}>{match[3]}</strong>;
}

// skipcq: JS-0067 — module-scoped function, not a global declaration
export function renderInlineText(text: string): ReactNode {
  const parts: ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(INLINE_PATTERN)) {
    if (match.index > last) {
      parts.push(text.slice(last, match.index));
    }
    parts.push(inlinePart(match, parts.length));
    last = match.index + match[0].length;
  }
  if (last < text.length) {
    parts.push(text.slice(last));
  }
  return parts;
}

// skipcq: JS-0067 — module-scoped component export, not a global declaration
export function BlogPostBody({ blocks }: { readonly blocks: readonly BlogPostBlock[] }) {
  return (
    <div className="text-ink-soft space-y-5 leading-relaxed">
      {blocks.map((block, index) => {
        const key = index;
        if (block.kind === "h2") {
          return (
            <h2 key={key} className="text-ink pt-4 text-xl font-bold tracking-tight">
              {block.text}
            </h2>
          );
        }
        if (block.kind === "list") {
          return (
            <ul key={key} className="list-disc space-y-2 pl-6">
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex}>{renderInlineText(item)}</li>
              ))}
            </ul>
          );
        }
        return <p key={key}>{renderInlineText(block.text)}</p>;
      })}
    </div>
  );
}
