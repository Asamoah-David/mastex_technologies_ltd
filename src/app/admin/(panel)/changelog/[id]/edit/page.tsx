import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";
import { ChangelogForm } from "@/components/admin/changelog-form";
import { getChangelogForm } from "@/lib/admin-queries";
import { DeleteChangelogButton } from "../../delete-changelog-button";

export default async function EditChangelogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { products, entry } = await getChangelogForm(id);
  if (!entry) notFound();

  return (
    <>
      <PageHeader
        title={`Edit — v${entry.version}`}
        description={entry.title}
        action={<DeleteChangelogButton id={entry.id} name={`v${entry.version}`} />}
      />
      <ChangelogForm entry={entry} products={products as any} />
    </>
  );
}
