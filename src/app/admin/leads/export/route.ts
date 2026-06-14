import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-auth";
import { can } from "@/lib/rbac";
import { audit } from "@/lib/audit";

export const dynamic = "force-dynamic";

function csvField(value: unknown): string {
  const s = value === null || value === undefined ? "" : String(value);
  // Escape quotes and wrap if it contains a comma, quote or newline.
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export async function GET() {
  const session = await getAdminSession();
  if (!session || !can(session.role, "leads:read")) {
    return new Response("Unauthorised", { status: 401 });
  }

  let leads: any[] = [];
  try {
    leads = await prisma.lead.findMany({
      include: { owner: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return new Response("Database unavailable", { status: 503 });
  }

  const headers = [
    "id", "type", "status", "name", "email", "phone", "company",
    "subject", "message", "source", "owner", "createdAt",
  ];
  const rows = leads.map((l) =>
    [
      l.id, l.type, l.status, l.name, l.email, l.phone, l.company,
      l.subject, l.message, l.source, l.owner?.email ?? "", l.createdAt.toISOString(),
    ]
      .map(csvField)
      .join(","),
  );
  const csv = [headers.join(","), ...rows].join("\n");

  await audit({ actorId: session.id, action: "leads.export", entity: "Lead", metadata: { count: leads.length } });

  const date = new Date().toISOString().slice(0, 10);
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="mastex-leads-${date}.csv"`,
    },
  });
}
