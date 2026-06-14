"use client";

import * as React from "react";
import { Archive, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { updateLeadStatus, archiveLead } from "./actions";

const STATUSES = ["NEW", "CONTACTED", "QUALIFIED", "IN_PROGRESS", "WON", "LOST", "ARCHIVED"];

const VARIANT: Record<string, any> = {
  NEW: "default",
  CONTACTED: "warning",
  QUALIFIED: "success",
  IN_PROGRESS: "warning",
  WON: "success",
  LOST: "secondary",
  ARCHIVED: "muted",
};

export function LeadRow({ lead }: { lead: any }) {
  const [pending, startTransition] = React.useTransition();
  const [open, setOpen] = React.useState(false);

  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-medium">{lead.name}</p>
            <Badge variant="muted">{lead.type}</Badge>
            <Badge variant={VARIANT[lead.status] ?? "muted"}>{lead.status}</Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {lead.email}
            {lead.company ? ` · ${lead.company}` : ""}
            {lead.phone ? ` · ${lead.phone}` : ""}
          </p>
          {lead.subject && <p className="mt-1 text-sm font-medium">{lead.subject}</p>}
          <p className="mt-1 text-xs text-muted-foreground">
            {formatDate(lead.createdAt, { hour: "2-digit", minute: "2-digit" })} · via{" "}
            {lead.source ?? "site"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            defaultValue={lead.status}
            disabled={pending}
            onChange={(e) =>
              startTransition(() => updateLeadStatus(lead.id, e.target.value))
            }
            className="h-9 rounded-lg border border-input bg-background px-2 text-sm"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <Button
            variant="ghost"
            size="icon"
            disabled={pending}
            onClick={() => startTransition(() => archiveLead(lead.id))}
            aria-label="Archive"
          >
            {pending ? <Loader2 className="size-4 animate-spin" /> : <Archive className="size-4" />}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setOpen((v) => !v)}>
            {open ? "Hide" : "View"}
          </Button>
        </div>
      </div>

      {open && (
        <div className="mt-3 rounded-lg border bg-muted/40 p-3 text-sm">
          <p className="whitespace-pre-wrap">{lead.message}</p>
        </div>
      )}
    </div>
  );
}
