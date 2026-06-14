import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { DataTable } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAdminPosts } from "@/lib/admin-queries";
import { fallback } from "@/lib/fallback-data";
import { formatDate } from "@/lib/utils";

const STATUS_VARIANT: Record<string, any> = {
  PUBLISHED: "success",
  DRAFT: "muted",
  SCHEDULED: "warning",
  ARCHIVED: "secondary",
};

export default async function AdminBlogPage() {
  let posts = await getAdminPosts();
  if (!posts.length) posts = fallback.posts.map((p: any) => ({ ...p, status: "PUBLISHED" })) as any;

  const rows = posts.map((p: any) => [
    <div key="t" className="font-medium">
      {p.title}
      <div className="text-xs text-muted-foreground">/{p.slug}</div>
    </div>,
    p.category?.name ?? "—",
    p.author?.name ?? "—",
    <Badge key="s" variant={STATUS_VARIANT[p.status] ?? "muted"}>
      {p.status ?? "PUBLISHED"}
    </Badge>,
    p.publishedAt ? formatDate(p.publishedAt) : "—",
    <div key="a" className="flex gap-2">
      <Button asChild variant="outline" size="sm">
        <Link href={`/admin/blog/${p.id}/edit`}>Edit</Link>
      </Button>
      <Button asChild variant="ghost" size="sm">
        <Link href={`/blog/${p.slug}`}>View</Link>
      </Button>
    </div>,
  ]);

  return (
    <>
      <PageHeader
        title="Blog"
        description="Create and manage posts with categories, tags, scheduling and SEO."
        action={
          <Button asChild>
            <Link href="/admin/blog/new">
              <Plus className="size-4" /> New post
            </Link>
          </Button>
        }
      />
      <DataTable
        columns={["Title", "Category", "Author", "Status", "Published", "Actions"]}
        rows={rows}
      />
    </>
  );
}
