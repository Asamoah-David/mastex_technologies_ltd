"use client";

import * as React from "react";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { seedDefaultNav } from "./actions";

export function SeedNavButton() {
  const [pending, start] = React.useTransition();
  return (
    <Button variant="outline" disabled={pending} onClick={() => start(() => void seedDefaultNav())}>
      {pending ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
      Load default menu
    </Button>
  );
}
