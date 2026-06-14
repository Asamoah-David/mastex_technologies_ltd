"use client";

import * as React from "react";
import { useActionState } from "react";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createNavItem } from "./actions";

export function AddNavForm({ location }: { location: "header" | "footer" }) {
  const [state, action, pending] = useActionState(createNavItem, {} as any);
  const formRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form
      ref={formRef}
      action={action}
      className="flex flex-wrap items-end gap-2 rounded-lg border border-dashed p-3"
    >
      <input type="hidden" name="location" value={location} />
      <div className="space-y-1">
        <Label className="text-xs">Label</Label>
        <Input name="label" required className="h-9 w-40" placeholder="Pricing" />
      </div>
      <div className="space-y-1">
        <Label className="text-xs">Href</Label>
        <Input name="href" required className="h-9 w-48" placeholder="/pricing" />
      </div>
      <label className="flex h-9 items-center gap-2 text-xs text-muted-foreground">
        <input type="checkbox" name="isExternal" className="accent-[hsl(var(--primary))]" /> External
      </label>
      <Button type="submit" size="sm" disabled={pending}>
        {pending ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />} Add
      </Button>
      {state?.error && <p className="w-full text-xs text-destructive">{state.error}</p>}
    </form>
  );
}
