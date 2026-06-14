import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { DataTable } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAdminProducts } from "@/lib/admin-queries";
import { fallback } from "@/lib/fallback-data";

const STATUS_VARIANT: Record<string, any> = {
  LIVE: "success",
  BETA: "warning",
  IN_DEVELOPMENT: "muted",
  CONCEPT: "muted",
  DEPRECATED: "secondary",
};

export default async function AdminProductsPage() {
  let products = await getAdminProducts();
  if (!products.length) products = fallback.products as any;

  const rows = products.map((p: any) => [
    <div key="n" className="font-medium">
      {p.name}
      <div className="text-xs text-muted-foreground">/{p.slug}</div>
    </div>,
    p.category?.name ?? "—",
    <Badge key="s" variant={STATUS_VARIANT[p.status] ?? "muted"}>
      {p.status}
    </Badge>,
    p.featured ? <Badge key="f" variant="default">Featured</Badge> : "—",
    <div key="a" className="flex gap-2">
      <Button asChild variant="outline" size="sm">
        <Link href={`/admin/products/${p.id}/edit`}>Edit</Link>
      </Button>
      <Button asChild variant="ghost" size="sm">
        <Link href={`/products/${p.slug}`}>View</Link>
      </Button>
    </div>,
  ]);

  return (
    <>
      <PageHeader
        title="Products"
        description="Manage the product catalogue shown across the public site."
        action={
          <Button asChild>
            <Link href="/admin/products/new">
              <Plus className="size-4" /> New product
            </Link>
          </Button>
        }
      />
      <DataTable
        columns={["Product", "Category", "Status", "Featured", "Actions"]}
        rows={rows}
        empty="No products yet."
      />
    </>
  );
}
