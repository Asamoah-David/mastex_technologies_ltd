import { PageHeader } from "@/components/admin/page-header";
import { JobForm } from "@/components/admin/job-form";

export default function NewJobPage() {
  return (
    <>
      <PageHeader title="New job posting" description="Publish an open role." />
      <JobForm />
    </>
  );
}
