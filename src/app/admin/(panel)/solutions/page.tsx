import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { DataTable } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAdminSolutions } from "@/lib/admin-queries";
import { fallback } from "@/lib/fallback-data";

const STATUS_VARIANT: Record<string, any> = {
  PUBLISHED: "success",
  DRAFT: "muted",
  SCHEDULED: "warning",
  ARCHIVED: "secondary",
};

export default async function AdminSolutionsPage() {
  let solutions = await getAdminSolutions();
  if (!solutions.length) solutions = fallback.solutions.map((s: any) => ({ ...s, status: "PUBLISHED" })) as any;

  const rows = solutions.map((s: any) => [
    <div key="t" className="font-medium">
      {s.title}
      <div className="text-xs text-muted-foreground">/{s.slug}</div>
    </div>,
    s.industry?.name ?? "—",
    <Badge key="s" variant={STATUS_VARIANT[s.status] ?? "muted"}>{s.status ?? "PUBLISHED"}</Badge>,
    <div key="a" className="flex gap-2">
      {s.id && !String(s.id).startsWith("s") && (
        <Button asChild variant="outline" size="sm">
          <Link href={`/admin/solutions/${s.id}/edit`}>Edit</Link>
        </Button>
      )}
      <Button asChild variant="ghost" size="sm">
        <Link href={`/solutions/${s.slug}`}>View</Link>
      </Button>
    </div>,
  ]);

  return (
    <>
      <PageHeader
        title="Solutions"
        description="Industry solutions shown on the public site."
        action={
          <Button asChild>
            <Link href="/admin/solutions/new"><Plus className="size-4" /> New solution</Link>
          </Button>
        }
      />
      <DataTable columns={["Solution", "Industry", "Status", "Actions"]} rows={rows} />
    </>
  );
}
