import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";
import { JobForm } from "@/components/admin/job-form";
import { getAdminJob } from "@/lib/admin-queries";
import { DeleteJobButton } from "../../delete-job-button";

export default async function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = await getAdminJob(id);
  if (!job) notFound();

  return (
    <>
      <PageHeader
        title={`Edit — ${job.title}`}
        description={job.department}
        action={<DeleteJobButton id={job.id} name={job.title} />}
      />
      <JobForm job={job} />
    </>
  );
}
