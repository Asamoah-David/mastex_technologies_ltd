import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";
import { SolutionForm } from "@/components/admin/solution-form";
import { getSolutionFormData } from "@/lib/admin-queries";
import { DeleteSolutionButton } from "../../delete-solution-button";

export default async function EditSolutionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { industries, solution } = await getSolutionFormData(id);
  if (!solution) notFound();

  return (
    <>
      <PageHeader
        title={`Edit — ${solution.title}`}
        description={`/solutions/${solution.slug}`}
        action={<DeleteSolutionButton id={solution.id} name={solution.title} />}
      />
      <SolutionForm solution={solution} industries={industries as any} />
    </>
  );
}
