"use client";

import * as React from "react";
import { FileText, Film, File as FileIcon, Loader2, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { deleteMedia } from "./actions";

export function MediaGrid({ media }: { media: any[] }) {
  if (media.length === 0) {
    return (
      <div className="rounded-xl border border-dashed p-16 text-center text-muted-foreground">
        No media here yet. Upload a file or add one by URL.
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {media.map((m) => (
        <MediaItem key={m.id} m={m} />
      ))}
    </div>
  );
}

function MediaItem({ m }: { m: any }) {
  const [pending, start] = React.useTransition();

  return (
    <div className="group overflow-hidden rounded-xl border bg-card">
      <div className="relative flex aspect-square items-center justify-center bg-muted">
        {m.type === "IMAGE" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={m.url} alt={m.alt ?? m.name} className="size-full object-cover" />
        ) : m.type === "VIDEO" ? (
          <Film className="size-10 text-muted-foreground" />
        ) : m.type === "PDF" ? (
          <FileText className="size-10 text-muted-foreground" />
        ) : (
          <FileIcon className="size-10 text-muted-foreground" />
        )}
        <button
          onClick={() => start(() => deleteMedia(m.id))}
          disabled={pending}
          className="absolute right-2 top-2 inline-flex size-8 items-center justify-center rounded-lg bg-background/90 text-destructive opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
          aria-label="Delete"
        >
          {pending ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
        </button>
      </div>
      <div className="space-y-1 p-3">
        <p className="truncate text-sm font-medium" title={m.name}>
          {m.name}
        </p>
        <div className="flex items-center justify-between">
          <Badge variant="muted">{m.type}</Badge>
          <span className="text-xs text-muted-foreground">{formatDate(m.createdAt)}</span>
        </div>
        {m.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {m.tags.slice(0, 3).map((t: string) => (
              <span key={t} className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                {t}
              </span>
            ))}
          </div>
        )}
        <a
          href={m.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block truncate pt-1 text-xs text-primary hover:underline"
        >
          Open
        </a>
      </div>
    </div>
  );
}
