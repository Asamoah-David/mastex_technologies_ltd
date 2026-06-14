import { redirect } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";
import { DataTable } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";
import { getAuditLogs } from "@/lib/admin-queries";
import { getAdminSession } from "@/lib/admin-auth";
import { can } from "@/lib/rbac";
import { formatDate } from "@/lib/utils";

const ACTION_VARIANT = (action: string): any => {
  if (action.includes("delete")) return "warning";
  if (action.includes("create") || action.includes("invite")) return "success";
  return "muted";
};

export default async function AdminAuditPage() {
  const session = await getAdminSession();
  if (!session || !can(session.role, "settings:read")) {
    redirect("/admin");
  }

  const logs = await getAuditLogs(150);

  const rows = logs.map((l: any) => [
    <span key="a" className="font-mono text-xs">{l.action}</span>,
    <Badge key="e" variant={ACTION_VARIANT(l.action)}>{l.entity ?? "—"}</Badge>,
    <div key="ac" className="text-sm">
      {l.actor?.name ?? "System"}
      {l.actor?.email && <div className="text-xs text-muted-foreground">{l.actor.email}</div>}
    </div>,
    <span key="ip" className="text-xs text-muted-foreground">{l.ip ?? "—"}</span>,
    <span key="d" className="text-xs text-muted-foreground">
      {formatDate(l.createdAt, { hour: "2-digit", minute: "2-digit" })}
    </span>,
  ]);

  return (
    <>
      <PageHeader
        title="Audit log"
        description="A tamper-evident record of sensitive actions across the platform."
      />
      <DataTable
        columns={["Action", "Entity", "Actor", "IP", "When"]}
        rows={rows}
        empty="No activity recorded yet."
      />
    </>
  );
}
