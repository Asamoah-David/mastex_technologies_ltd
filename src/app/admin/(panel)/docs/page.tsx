import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminDocs } from "@/lib/admin-queries";
import { fallback } from "@/lib/fallback-data";
import { CategoryCreator } from "./category-creator";

export default async function AdminDocsPage() {
  let cats = await getAdminDocs();
  if (!cats.length) cats = fallback.docCategories as any;

  return (
    <>
      <PageHeader
        title="Documentation"
        description="Organise categories and markdown articles with versioning."
        action={
          <div className="flex gap-2">
            <CategoryCreator />
            <Button asChild>
              <Link href="/admin/docs/new">
                <Plus className="size-4" /> New article
              </Link>
            </Button>
          </div>
        }
      />
      <div className="grid gap-4 md:grid-cols-2">
        {cats.map((cat: any) => (
          <Card key={cat.id}>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>{cat.name}</CardTitle>
              <Badge variant="muted">{cat.articles?.length ?? 0} articles</Badge>
            </CardHeader>
            <CardContent className="space-y-1.5">
              {(cat.articles ?? []).length === 0 && (
                <p className="text-sm text-muted-foreground">No articles yet.</p>
              )}
              {(cat.articles ?? []).map((a: any) => (
                <div
                  key={a.id}
                  className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm"
                >
                  <span>{a.title}</span>
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/admin/docs/${a.id}/edit`}
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      edit
                    </Link>
                    <Link href={`/docs/${a.slug}`} className="text-xs text-muted-foreground hover:underline">
                      view
                    </Link>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
