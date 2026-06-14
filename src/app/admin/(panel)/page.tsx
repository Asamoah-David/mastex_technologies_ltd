import Link from "next/link";
import { icons } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { StatCard } from "@/components/admin/stat-card";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getDashboardData } from "@/lib/admin-queries";
import { getAdminSession } from "@/lib/admin-auth";
import { formatDate } from "@/lib/utils";

const LEAD_STATUS_VARIANT: Record<string, any> = {
  NEW: "default",
  CONTACTED: "warning",
  QUALIFIED: "success",
  IN_PROGRESS: "warning",
  WON: "success",
  LOST: "secondary",
  ARCHIVED: "muted",
};

export default async function AdminDashboard() {
  const [data, session] = await Promise.all([getDashboardData(), getAdminSession()]);

  return (
    <>
      <PageHeader
        title="Dashboard"
        description={`Signed in as ${session?.email ?? "admin"}${
          session?.via === "dev" ? " · dev session" : ""
        }`}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Products" value={data.products} icon="Package" hint="Across all categories" />
        <StatCard label="Blog posts" value={data.posts} icon="Newspaper" hint="Published & drafts" />
        <StatCard label="Documentation" value={data.docs} icon="BookText" hint="Articles" />
        <StatCard label="Leads" value={data.leads} icon="Inbox" hint="All time" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Recent leads */}
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Recent leads</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/leads">View all</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.recentLeads.length === 0 && (
              <p className="text-sm text-muted-foreground">No leads yet.</p>
            )}
            {data.recentLeads.map((lead: any) => (
              <div
                key={lead.id}
                className="flex items-center justify-between gap-3 rounded-lg border p-3"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">{lead.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {lead.email} · {lead.type}
                  </p>
                </div>
                <Badge variant={LEAD_STATUS_VARIANT[lead.status] ?? "muted"}>
                  {lead.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.recentAudit.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Activity will appear here as the team works.
              </p>
            )}
            {data.recentAudit.map((log: any) => {
              const Icon = icons.Activity;
              return (
                <div key={log.id} className="flex items-start gap-3 text-sm">
                  <span className="mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-md bg-muted">
                    <Icon className="size-3.5" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate">
                      <span className="font-medium">{log.actor?.name ?? "System"}</span>{" "}
                      {log.action}
                    </p>
                    <p className="text-xs text-muted-foreground">{formatDate(log.createdAt)}</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {QUICK_ACTIONS.map((a) => {
          const Icon = (icons as any)[a.icon] ?? icons.Plus;
          return (
            <Link
              key={a.href}
              href={a.href}
              className="group flex items-center gap-3 rounded-xl border bg-card p-4 transition-colors hover:border-primary/40"
            >
              <span className="inline-flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-5" />
              </span>
              <div>
                <p className="text-sm font-medium">{a.label}</p>
                <p className="text-xs text-muted-foreground">{a.desc}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}

const QUICK_ACTIONS = [
  { href: "/admin/products", label: "New product", desc: "Add to the catalogue", icon: "Package" },
  { href: "/admin/blog", label: "Write a post", desc: "Publish an update", icon: "Newspaper" },
  { href: "/admin/docs", label: "Add docs", desc: "Document a product", icon: "BookText" },
  { href: "/admin/leads", label: "Review leads", desc: "Follow up", icon: "Inbox" },
];
