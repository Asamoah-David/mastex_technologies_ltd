import { PageHeader } from "@/components/admin/page-header";
import { SolutionForm } from "@/components/admin/solution-form";
import { getSolutionFormData } from "@/lib/admin-queries";

export default async function NewSolutionPage() {
  const { industries } = await getSolutionFormData();
  return (
    <>
      <PageHeader title="New solution" description="Add an industry solution." />
      <SolutionForm industries={industries as any} />
    </>
  );
}
