"use client";

import * as React from "react";
import { Eye, Pencil } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Markdown } from "@/components/markdown";
import { cn } from "@/lib/utils";

export function MarkdownEditor({
  value,
  onChange,
  rows = 16,
}: {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  const [tab, setTab] = React.useState<"write" | "preview">("write");

  return (
    <div className="rounded-lg border">
      <div className="flex items-center gap-1 border-b bg-muted/40 p-1">
        <TabBtn active={tab === "write"} onClick={() => setTab("write")} icon={<Pencil className="size-3.5" />}>
          Write
        </TabBtn>
        <TabBtn active={tab === "preview"} onClick={() => setTab("preview")} icon={<Eye className="size-3.5" />}>
          Preview
        </TabBtn>
        <span className="ml-auto px-2 text-xs text-muted-foreground">Markdown supported</span>
      </div>
      {tab === "write" ? (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          className="rounded-none border-0 font-mono text-sm focus-visible:ring-0"
          placeholder="# Heading&#10;&#10;Write in **markdown**…"
        />
      ) : (
        <div className="min-h-[200px] p-4">
          {value.trim() ? (
            <Markdown content={value} />
          ) : (
            <p className="text-sm text-muted-foreground">Nothing to preview yet.</p>
          )}
        </div>
      )}
    </div>
  );
}

function TabBtn({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
        active ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground",
      )}
    >
      {icon}
      {children}
    </button>
  );
}
