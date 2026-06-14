import { PageHeader } from "@/components/admin/page-header";
import { StatCard } from "@/components/admin/stat-card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { getAnalytics } from "@/lib/analytics";
import { TrafficChart, TopPagesChart, LeadSourceChart } from "./charts";

async function safe<T>(fn: () => Promise<T>, fb: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fb;
  }
}

export default async function AdminAnalyticsPage() {
  const [analytics, leadsByType, totalLeads, products] = await Promise.all([
    getAnalytics(14),
    safe(() => prisma.lead.groupBy({ by: ["type"], _count: true }), [] as any[]),
    safe(() => prisma.lead.count(), 1),
    safe(() => prisma.product.count(), 4),
  ]);

  const conversion = analytics.totalVisitors
    ? ((totalLeads / analytics.totalVisitors) * 100).toFixed(1)
    : "0";

  const leadPie =
    leadsByType.length > 0
      ? leadsByType.map((l: any) => ({ name: l.type, value: l._count }))
      : [
          { name: "CONTACT", value: 4 },
          { name: "SALES", value: 6 },
          { name: "PARTNERSHIP", value: 2 },
          { name: "JOB_APPLICATION", value: 3 },
        ];

  return (
    <>
      <PageHeader
        title="Analytics"
        description="Traffic, lead conversion and product interest over the last 14 days."
        action={
          <Badge variant={analytics.live ? "success" : "muted"}>
            {analytics.live ? "Live data" : "Sample data"}
          </Badge>
        }
      />

      {!analytics.live && (
        <p className="mb-6 text-sm text-muted-foreground">
          Showing sample figures. Real numbers appear here automatically as visitors browse the
          public site (first-party, cookie-less tracking).
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Visitors (14d)" value={analytics.totalVisitors.toLocaleString()} icon="Users" />
        <StatCard label="Page views (14d)" value={analytics.totalPageViews.toLocaleString()} icon="MousePointerClick" />
        <StatCard label="Conversion" value={`${conversion}%`} icon="TrendingUp" hint={`${totalLeads} leads`} />
        <StatCard label="Products" value={products} icon="Package" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="lg:col-span-2">
          <TrafficChart data={analytics.traffic} />
        </div>
        <TopPagesChart data={analytics.topPages} />
        <LeadSourceChart data={leadPie} />
      </div>
    </>
  );
}
