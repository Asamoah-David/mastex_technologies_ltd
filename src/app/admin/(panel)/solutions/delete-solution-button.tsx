"use client";

import * as React from "react";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteSolution } from "./actions";

export function DeleteSolutionButton({ id, name }: { id: string; name: string }) {
  const [pending, start] = React.useTransition();
  const [confirming, setConfirming] = React.useState(false);
  if (!confirming) {
    return (
      <Button variant="outline" size="sm" onClick={() => setConfirming(true)}>
        <Trash2 className="size-4" /> Delete
      </Button>
    );
  }
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Delete “{name}”?</span>
      <Button variant="destructive" size="sm" disabled={pending} onClick={() => start(() => deleteSolution(id))}>
        {pending ? <Loader2 className="size-4 animate-spin" /> : "Confirm"}
      </Button>
      <Button variant="ghost" size="sm" onClick={() => setConfirming(false)}>Cancel</Button>
    </div>
  );
}
