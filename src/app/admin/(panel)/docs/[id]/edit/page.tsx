import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";
import { DocForm } from "@/components/admin/doc-form";
import { getDocFormData } from "@/lib/admin-queries";
import { DeleteDocButton } from "../../delete-doc-button";

export default async function EditDocPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { categories, article, allArticles } = await getDocFormData(id);
  if (!article) notFound();

  return (
    <>
      <PageHeader
        title={`Edit — ${article.title}`}
        description={`/docs/${article.slug}`}
        action={<DeleteDocButton id={article.id} name={article.title} />}
      />
      <DocForm article={article} categories={categories as any} allArticles={allArticles as any} />
    </>
  );
}
