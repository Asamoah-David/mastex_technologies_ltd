"use client";

import * as React from "react";
import { useActionState } from "react";
import { Loader2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { inviteUser } from "./actions";

const ROLES = ["VIEWER", "SUPPORT", "EDITOR", "ADMIN", "SUPER_ADMIN"];

export function InviteForm() {
  const [open, setOpen] = React.useState(false);
  const [state, action, pending] = useActionState(inviteUser, {} as any);

  React.useEffect(() => {
    if (state?.ok) setOpen(false);
  }, [state]);

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)}>
        <UserPlus className="size-4" /> Invite user
      </Button>
    );
  }

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <form action={action} className="grid items-end gap-3 sm:grid-cols-[1fr_1fr_160px_auto]">
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input name="email" type="email" required placeholder="person@mastex.tech" />
          </div>
          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input name="name" placeholder="Optional" />
          </div>
          <div className="space-y-1.5">
            <Label>Role</Label>
            <select
              name="role"
              defaultValue="EDITOR"
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={pending}>
              {pending && <Loader2 className="size-4 animate-spin" />} Invite
            </Button>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
          {state?.error && <p className="text-sm text-destructive sm:col-span-4">{state.error}</p>}
        </form>
      </CardContent>
    </Card>
  );
}
