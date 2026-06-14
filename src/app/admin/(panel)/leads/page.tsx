import Link from "next/link";
import { Download } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { getAdminLeads } from "@/lib/admin-queries";
import { LeadRow } from "./lead-row";

export default async function AdminLeadsPage() {
  const leads = await getAdminLeads();

  return (
    <>
      <PageHeader
        title="Leads"
        description="Contact, sales, partnership and job-application submissions."
        action={
          leads.length > 0 ? (
            <Button asChild variant="outline">
              <Link href="/admin/leads/export" prefetch={false}>
                <Download className="size-4" /> Export CSV
              </Link>
            </Button>
          ) : undefined
        }
      />

      {leads.length === 0 ? (
        <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
          No leads yet. Submissions from the contact and careers forms will appear here.
        </div>
      ) : (
        <div className="space-y-3">
          {leads.map((lead: any) => (
            <LeadRow key={lead.id} lead={lead} />
          ))}
        </div>
      )}
    </>
  );
}
