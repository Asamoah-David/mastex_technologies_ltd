import { PageHeader } from "@/components/admin/page-header";
import { ChangelogForm } from "@/components/admin/changelog-form";
import { getChangelogForm } from "@/lib/admin-queries";

export default async function NewChangelogPage() {
  const { products } = await getChangelogForm();
  return (
    <>
      <PageHeader title="New changelog entry" description="Document a product release." />
      {products.length === 0 ? (
        <p className="rounded-xl border border-dashed p-10 text-center text-muted-foreground">
          Create a product first, then add release notes for it.
        </p>
      ) : (
        <ChangelogForm products={products as any} />
      )}
    </>
  );
}
