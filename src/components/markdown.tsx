import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn, slugify } from "@/lib/utils";

function textOf(node: any): string {
  if (typeof node === "string") return node;
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (node?.props?.children) return textOf(node.props.children);
  return "";
}

export function Markdown({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "prose prose-zinc max-w-none dark:prose-invert prose-headings:scroll-mt-24 prose-headings:font-semibold prose-a:text-primary prose-pre:rounded-xl prose-pre:border prose-pre:bg-muted",
        className,
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ children }) => <h2 id={slugify(textOf(children))}>{children}</h2>,
          h3: ({ children }) => <h3 id={slugify(textOf(children))}>{children}</h3>,
          h4: ({ children }) => <h4 id={slugify(textOf(children))}>{children}</h4>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

export interface TocHeading {
  level: number;
  text: string;
  slug: string;
}

/** Extract h2/h3 headings from markdown for a table of contents. */
export function extractToc(content: string): TocHeading[] {
  const lines = content.split("\n");
  const out: TocHeading[] = [];
  let inFence = false;
  for (const line of lines) {
    if (line.trim().startsWith("```")) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const m = /^(#{2,3})\s+(.+?)\s*#*$/.exec(line);
    if (m) {
      const text = m[2].replace(/[*_`]/g, "").trim();
      out.push({ level: m[1].length, text, slug: slugify(text) });
    }
  }
  return out;
}
