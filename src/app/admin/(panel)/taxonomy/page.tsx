import { PageHeader } from "@/components/admin/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminTaxonomy } from "@/lib/admin-queries";
import { TaxonomyManager } from "./taxonomy-manager";

export default async function AdminTaxonomyPage() {
  const { categories, industries } = await getAdminTaxonomy();

  return (
    <>
      <PageHeader
        title="Taxonomy"
        description="Product categories and industries used across the site. Add these before setting up products."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Categories</CardTitle></CardHeader>
          <CardContent>
            <TaxonomyManager kind="category" items={categories as any} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Industries</CardTitle></CardHeader>
          <CardContent>
            <TaxonomyManager kind="industry" items={industries as any} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
