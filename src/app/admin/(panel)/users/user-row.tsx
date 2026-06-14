"use client";

import * as React from "react";
import { Loader2, ShieldCheck, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { changeRole, toggleActive, setUserPermissions, deleteUser } from "./actions";

const ROLES = ["VIEWER", "SUPPORT", "EDITOR", "ADMIN", "SUPER_ADMIN"];

export function UserRow({
  user,
  allPermissions,
  rolePermissions,
  isSelf,
}: {
  user: any;
  allPermissions: string[];
  rolePermissions: Record<string, string[]>;
  isSelf: boolean;
}) {
  const [pending, start] = React.useTransition();
  const [expanded, setExpanded] = React.useState(false);
  const [confirming, setConfirming] = React.useState(false);
  const [grants, setGrants] = React.useState<string[]>(
    user.permissions?.map((p: any) => p.permission.key) ?? [],
  );
  const [savedMsg, setSavedMsg] = React.useState<string | null>(null);

  const inheritedFromRole = rolePermissions[user.role] ?? [];

  function toggleGrant(key: string) {
    setGrants((g) => (g.includes(key) ? g.filter((k) => k !== key) : [...g, key]));
  }

  function savePermissions() {
    start(async () => {
      await setUserPermissions(user.id, grants);
      setSavedMsg("Saved");
      setTimeout(() => setSavedMsg(null), 2000);
    });
  }

  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-medium">{user.name ?? "—"}</p>
            {isSelf && <Badge variant="muted">You</Badge>}
            {user.role === "SUPER_ADMIN" && <ShieldCheck className="size-4 text-primary" />}
          </div>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            defaultValue={user.role}
            disabled={pending || isSelf}
            onChange={(e) => start(() => changeRole(user.id, e.target.value))}
            className="h-9 rounded-lg border border-input bg-background px-2 text-sm disabled:opacity-60"
            title={isSelf ? "You can't change your own role" : undefined}
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>

          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <Switch
              checked={user.isActive}
              disabled={pending || isSelf}
              onCheckedChange={(v) => start(() => toggleActive(user.id, v))}
            />
            Active
          </label>

          <Button variant="ghost" size="sm" onClick={() => setExpanded((v) => !v)}>
            {expanded ? "Hide" : "Permissions"}
          </Button>

          {!isSelf &&
            (confirming ? (
              <div className="flex items-center gap-1">
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={pending}
                  onClick={() => start(() => deleteUser(user.id))}
                >
                  {pending ? <Loader2 className="size-4 animate-spin" /> : "Confirm"}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setConfirming(false)}>
                  Cancel
                </Button>
              </div>
            ) : (
              <Button variant="ghost" size="icon" onClick={() => setConfirming(true)} aria-label="Delete">
                <Trash2 className="size-4" />
              </Button>
            ))}
        </div>
      </div>

      {expanded && (
        <div className="mt-4 rounded-lg border bg-muted/30 p-4">
          <p className="mb-3 text-sm text-muted-foreground">
            Role <span className="font-medium text-foreground">{user.role}</span> already grants{" "}
            {user.role === "SUPER_ADMIN" ? "all permissions" : `${inheritedFromRole.length} permissions`}.
            Add extra explicit grants below.
          </p>
          <div className="grid gap-2 sm:grid-cols-3">
            {allPermissions.map((key) => {
              const inherited = user.role === "SUPER_ADMIN" || inheritedFromRole.includes(key);
              const checked = inherited || grants.includes(key);
              return (
                <label
                  key={key}
                  className={`flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-xs ${
                    inherited ? "opacity-60" : "cursor-pointer"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={inherited}
                    onChange={() => toggleGrant(key)}
                    className="accent-[hsl(var(--primary))]"
                  />
                  <span className="font-mono">{key}</span>
                </label>
              );
            })}
          </div>
          <div className="mt-4 flex items-center gap-3">
            <Button size="sm" disabled={pending} onClick={savePermissions}>
              {pending && <Loader2 className="size-4 animate-spin" />} Save grants
            </Button>
            {savedMsg && <span className="text-sm text-primary">{savedMsg}</span>}
          </div>
        </div>
      )}
    </div>
  );
}
