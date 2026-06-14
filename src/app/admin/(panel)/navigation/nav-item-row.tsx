"use client";

import * as React from "react";
import { ArrowDown, ArrowUp, Check, ExternalLink, Loader2, Pencil, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { updateNavItem, deleteNavItem, moveNavItem } from "./actions";

export function NavItemRow({
  item,
  isFirst,
  isLast,
}: {
  item: any;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [pending, start] = React.useTransition();
  const [editing, setEditing] = React.useState(false);
  const [label, setLabel] = React.useState(item.label);
  const [href, setHref] = React.useState(item.href);
  const [isExternal, setIsExternal] = React.useState(item.isExternal);

  function save() {
    start(async () => {
      await updateNavItem(item.id, { label, href, isExternal });
      setEditing(false);
    });
  }

  if (editing) {
    return (
      <div className="flex flex-wrap items-end gap-2 rounded-lg border bg-muted/30 p-3">
        <div className="space-y-1">
          <Label className="text-xs">Label</Label>
          <Input value={label} onChange={(e) => setLabel(e.target.value)} className="h-9 w-40" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Href</Label>
          <Input value={href} onChange={(e) => setHref(e.target.value)} className="h-9 w-48" />
        </div>
        <label className="flex h-9 items-center gap-2 text-xs text-muted-foreground">
          <Switch checked={isExternal} onCheckedChange={setIsExternal} /> External
        </label>
        <Button size="icon" variant="ghost" onClick={save} disabled={pending} aria-label="Save">
          {pending ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
        </Button>
        <Button size="icon" variant="ghost" onClick={() => setEditing(false)} aria-label="Cancel">
          <X className="size-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border bg-card p-3">
      <div className="flex items-center gap-2 min-w-0">
        <span className="font-medium">{item.label}</span>
        <span className="truncate text-sm text-muted-foreground">{item.href}</span>
        {item.isExternal && <ExternalLink className="size-3.5 text-muted-foreground" />}
      </div>
      <div className="flex items-center gap-1">
        <Button
          size="icon"
          variant="ghost"
          disabled={isFirst || pending}
          onClick={() => start(() => moveNavItem(item.id, "up"))}
          aria-label="Move up"
        >
          <ArrowUp className="size-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          disabled={isLast || pending}
          onClick={() => start(() => moveNavItem(item.id, "down"))}
          aria-label="Move down"
        >
          <ArrowDown className="size-4" />
        </Button>
        <Button size="icon" variant="ghost" onClick={() => setEditing(true)} aria-label="Edit">
          <Pencil className="size-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          disabled={pending}
          onClick={() => start(() => deleteNavItem(item.id))}
          aria-label="Delete"
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    </div>
  );
}
