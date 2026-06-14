"use client";

import * as React from "react";
import { useActionState } from "react";
import { FolderPlus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { slugify } from "@/lib/utils";
import { createCategory } from "./actions";

export function CategoryCreator() {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [state, action, pending] = useActionState(createCategory, {} as any);

  React.useEffect(() => {
    if (state?.ok) {
      setOpen(false);
      setName("");
    }
  }, [state]);

  if (!open) {
    return (
      <Button variant="outline" onClick={() => setOpen(true)}>
        <FolderPlus className="size-4" /> New category
      </Button>
    );
  }

  return (
    <form action={action} className="flex flex-wrap items-end gap-2 rounded-xl border bg-card p-3">
      <div className="space-y-1">
        <Label className="text-xs">Name</Label>
        <Input name="name" value={name} onChange={(e) => setName(e.target.value)} className="h-9 w-44" required />
      </div>
      <div className="space-y-1">
        <Label className="text-xs">Slug</Label>
        <Input name="slug" defaultValue={slugify(name)} key={slugify(name)} className="h-9 w-44" required />
      </div>
      <div className="space-y-1">
        <Label className="text-xs">Icon</Label>
        <Input name="icon" placeholder="Rocket" className="h-9 w-28" />
      </div>
      <input type="hidden" name="order" value="0" />
      <Button type="submit" size="sm" disabled={pending}>
        {pending && <Loader2 className="size-4 animate-spin" />} Add
      </Button>
      <Button type="button" size="sm" variant="ghost" onClick={() => setOpen(false)}>
        Cancel
      </Button>
      {state?.error && <p className="w-full text-xs text-destructive">{state.error}</p>}
    </form>
  );
}
