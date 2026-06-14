"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-auth";
import { can } from "@/lib/rbac";
import { audit } from "@/lib/audit";

async function authorize() {
  const session = await getAdminSession();
  if (!session || !can(session.role, "leads:write")) {
    throw new Error("Not authorised");
  }
  return session;
}

export async function updateLeadStatus(id: string, status: string) {
  const session = await authorize();
  await prisma.lead.update({ where: { id }, data: { status: status as any } });
  await audit({ actorId: session.id, action: "lead.status", entity: "Lead", entityId: id, metadata: { status } });
  revalidatePath("/admin/leads");
}

export async function archiveLead(id: string) {
  const session = await authorize();
  await prisma.lead.update({ where: { id }, data: { status: "ARCHIVED" } });
  await audit({ actorId: session.id, action: "lead.archive", entity: "Lead", entityId: id });
  revalidatePath("/admin/leads");
}
