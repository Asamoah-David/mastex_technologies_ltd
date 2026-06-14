"use client";

import * as React from "react";
import type { TocHeading } from "@/components/markdown";
import { cn } from "@/lib/utils";

export function TableOfContents({ headings }: { headings: TocHeading[] }) {
  const [activeId, setActiveId] = React.useState<string>("");

  React.useEffect(() => {
    if (!headings.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "0px 0px -75% 0px", threshold: 0.1 },
    );
    headings.forEach((h) => {
      const el = document.getElementById(h.slug);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 2) return null;

  return (
    <nav className="text-sm">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        On this page
      </p>
      <ul className="space-y-1.5 border-l border-border">
        {headings.map((h) => (
          <li key={h.slug} style={{ paddingLeft: h.level === 3 ? 16 : 0 }}>
            <a
              href={`#${h.slug}`}
              className={cn(
                "-ml-px block border-l-2 py-0.5 pl-3 transition-colors",
                activeId === h.slug
                  ? "border-primary font-medium text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
