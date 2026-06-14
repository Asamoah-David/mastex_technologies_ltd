import { PageHeader } from "@/components/admin/page-header";
import { DocForm } from "@/components/admin/doc-form";
import { getDocFormData } from "@/lib/admin-queries";
import { CategoryCreator } from "../category-creator";

export default async function NewDocPage() {
  const { categories, allArticles } = await getDocFormData();

  return (
    <>
      <PageHeader
        title="New article"
        description="Write a documentation article in markdown."
        action={<CategoryCreator />}
      />
      {categories.length === 0 ? (
        <div className="rounded-xl border border-dashed p-10 text-center text-muted-foreground">
          Create a documentation category first (button above), then add articles to it.
        </div>
      ) : (
        <DocForm categories={categories as any} allArticles={allArticles as any} />
      )}
    </>
  );
}
