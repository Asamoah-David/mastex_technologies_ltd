import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { DataTable } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAdminChangelog } from "@/lib/admin-queries";
import { formatDate } from "@/lib/utils";

export default async function AdminChangelogPage() {
  const entries = await getAdminChangelog();

  const rows = entries.map((e: any) => [
    <Badge key="v" variant="outline">v{e.version}</Badge>,
    <span key="p" className="text-sm">{e.product?.name ?? "—"}</span>,
    <span key="t" className="font-medium">{e.title}</span>,
    <Badge key="s" variant={e.status === "PUBLISHED" ? "success" : "muted"}>{e.status}</Badge>,
    <span key="d" className="text-xs text-muted-foreground">{formatDate(e.releasedAt)}</span>,
    <Button key="a" asChild variant="outline" size="sm">
      <Link href={`/admin/changelog/${e.id}/edit`}>Edit</Link>
    </Button>,
  ]);

  return (
    <>
      <PageHeader
        title="Changelog"
        description="Release notes shown on the public /changelog page and product pages."
        action={
          <Button asChild>
            <Link href="/admin/changelog/new"><Plus className="size-4" /> New entry</Link>
          </Button>
        }
      />
      <DataTable
        columns={["Version", "Product", "Title", "Status", "Released", "Actions"]}
        rows={rows}
        empty="No release notes yet."
      />
    </>
  );
}
