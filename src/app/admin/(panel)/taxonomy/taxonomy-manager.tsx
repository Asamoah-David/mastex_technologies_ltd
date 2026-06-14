"use client";

import * as React from "react";
import { useActionState } from "react";
import { Check, Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { slugify } from "@/lib/utils";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  createIndustry,
  updateIndustry,
  deleteIndustry,
} from "./actions";

type Kind = "category" | "industry";

export function TaxonomyManager({ kind, items }: { kind: Kind; items: any[] }) {
  const createAction = kind === "category" ? createCategory : createIndustry;
  const [state, action, pending] = useActionState(createAction, {} as any);
  const formRef = React.useRef<HTMLFormElement>(null);
  const [name, setName] = React.useState("");

  React.useEffect(() => {
    if (state?.ok) {
      formRef.current?.reset();
      setName("");
    }
  }, [state]);

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <Row key={item.id} kind={kind} item={item} />
      ))}
      {items.length === 0 && <p className="text-sm text-muted-foreground">None yet.</p>}

      <form ref={formRef} action={action} className="flex flex-wrap items-end gap-2 rounded-lg border border-dashed p-3">
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Name</label>
          <Input name="name" value={name} onChange={(e) => setName(e.target.value)} className="h-9 w-40" required />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Slug</label>
          <Input name="slug" key={slugify(name)} defaultValue={slugify(name)} className="h-9 w-36" />
        </div>
        {kind === "industry" && (
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Icon</label>
            <Input name="icon" placeholder="ShoppingBag" className="h-9 w-32" />
          </div>
        )}
        <Button type="submit" size="sm" disabled={pending}>
          {pending ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />} Add
        </Button>
        {state?.error && <p className="w-full text-xs text-destructive">{state.error}</p>}
      </form>
    </div>
  );
}

function Row({ kind, item }: { kind: Kind; item: any }) {
  const [pending, start] = React.useTransition();
  const [editing, setEditing] = React.useState(false);
  const [name, setName] = React.useState(item.name);
  const [icon, setIcon] = React.useState(item.icon ?? "");
  const [description, setDescription] = React.useState(item.description ?? "");

  function save() {
    start(async () => {
      if (kind === "category") await updateCategory(item.id, name, description);
      else await updateIndustry(item.id, name, icon, description);
      setEditing(false);
    });
  }
  function remove() {
    start(async () => {
      if (kind === "category") await deleteCategory(item.id);
      else await deleteIndustry(item.id);
    });
  }

  if (editing) {
    return (
      <div className="flex flex-wrap items-end gap-2 rounded-lg border bg-muted/30 p-3">
        <Input value={name} onChange={(e) => setName(e.target.value)} className="h-9 w-36" />
        {kind === "industry" && (
          <Input value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="Icon" className="h-9 w-28" />
        )}
        <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="h-9 w-44" />
        <Button size="icon" variant="ghost" onClick={save} disabled={pending}>
          {pending ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
        </Button>
        <Button size="icon" variant="ghost" onClick={() => setEditing(false)}><X className="size-4" /></Button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border bg-card p-3">
      <div className="min-w-0">
        <span className="font-medium">{item.name}</span>
        <span className="ml-2 text-xs text-muted-foreground">/{item.slug}</span>
        {typeof item._count?.products === "number" && (
          <Badge variant="muted" className="ml-2">{item._count.products} products</Badge>
        )}
      </div>
      <div className="flex gap-1">
        <Button size="icon" variant="ghost" onClick={() => setEditing(true)}><Pencil className="size-4" /></Button>
        <Button size="icon" variant="ghost" disabled={pending} onClick={remove}>
          {pending ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
        </Button>
      </div>
    </div>
  );
}
