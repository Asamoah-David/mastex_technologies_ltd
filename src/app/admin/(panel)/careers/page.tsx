import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { DataTable } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAdminJobs } from "@/lib/admin-queries";
import { fallback } from "@/lib/fallback-data";

const STATUS_VARIANT: Record<string, any> = {
  PUBLISHED: "success",
  DRAFT: "muted",
  ARCHIVED: "secondary",
};

export default async function AdminCareersPage() {
  let jobs = await getAdminJobs();
  if (!jobs.length) jobs = fallback.jobs.map((j: any) => ({ ...j, status: "PUBLISHED", _count: { applications: 0 } })) as any;

  const rows = jobs.map((j: any) => [
    <div key="t" className="font-medium">{j.title}</div>,
    j.department,
    j.location,
    <Badge key="ty" variant="muted">{j.type}</Badge>,
    <Badge key="st" variant={STATUS_VARIANT[j.status] ?? "muted"}>{j.status ?? "PUBLISHED"}</Badge>,
    <Badge key="ap" variant="default">{j._count?.applications ?? 0}</Badge>,
    <div key="a" className="flex gap-2">
      {j.id && !String(j.id).startsWith("j") && (
        <Button asChild variant="outline" size="sm">
          <Link href={`/admin/careers/${j.id}/edit`}>Edit</Link>
        </Button>
      )}
      <Button asChild variant="ghost" size="sm">
        <Link href="/careers">View</Link>
      </Button>
    </div>,
  ]);

  return (
    <>
      <PageHeader
        title="Careers"
        description="Manage job postings. Applications arrive as leads."
        action={
          <Button asChild>
            <Link href="/admin/careers/new"><Plus className="size-4" /> New posting</Link>
          </Button>
        }
      />
      <DataTable
        columns={["Role", "Department", "Location", "Type", "Status", "Applications", "Actions"]}
        rows={rows}
      />
    </>
  );
}
