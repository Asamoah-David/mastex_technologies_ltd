import { logoutAction } from "@/app/admin/actions";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut } from "lucide-react";
import type { AdminSession } from "@/lib/admin-auth";

const ROLE_LABEL: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  EDITOR: "Editor",
  SUPPORT: "Support",
  VIEWER: "Viewer",
};

export function AdminTopbar({ session }: { session: AdminSession }) {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-card/50 px-6 backdrop-blur">
      <div>
        <p className="text-sm text-muted-foreground">Welcome back</p>
        <p className="font-medium leading-tight">{session.name ?? session.email}</p>
      </div>
      <div className="flex items-center gap-3">
        <Badge variant="default">{ROLE_LABEL[session.role] ?? session.role}</Badge>
        <ThemeToggle />
        <form action={logoutAction}>
          <Button variant="ghost" size="sm" type="submit">
            <LogOut className="size-4" /> Sign out
          </Button>
        </form>
      </div>
    </header>
  );
}
