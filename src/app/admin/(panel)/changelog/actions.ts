"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-auth";
import { can } from "@/lib/rbac";
import { audit } from "@/lib/audit";
import { changelogSchema, type ChangelogInput } from "@/lib/validations";

async function authorize() {
  const session = await getAdminSession();
  if (!session || !can(session.role, "products:write")) {
    throw new Error("Not authorised to manage the changelog.");
  }
  return session;
}

type Result = { ok: true; id: string } | { ok: false; error: string; issues?: any };

function data(input: ChangelogInput) {
  return {
    productId: input.productId,
    version: input.version,
    title: input.title,
    body: input.body,
    status: input.status,
    releasedAt: input.releasedAt ? new Date(input.releasedAt) : new Date(),
  };
}

export async function createChangelog(raw: ChangelogInput): Promise<Result> {
  const session = await authorize();
  const parsed = changelogSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "Validation failed", issues: parsed.error.flatten().fieldErrors };
  }
  try {
    const e = await prisma.changelogEntry.create({ data: data(parsed.data) });
    await audit({ actorId: session.id, action: "changelog.create", entity: "ChangelogEntry", entityId: e.id });
    revalidatePath("/admin/changelog");
    revalidatePath("/changelog");
    return { ok: true, id: e.id };
  } catch (e) {
    console.error("[createChangelog]", e);
    return { ok: false, error: "Could not save — is the database running?" };
  }
}

export async function updateChangelog(id: string, raw: ChangelogInput): Promise<Result> {
  const session = await authorize();
  const parsed = changelogSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "Validation failed", issues: parsed.error.flatten().fieldErrors };
  }
  try {
    const e = await prisma.changelogEntry.update({ where: { id }, data: data(parsed.data) });
    await audit({ actorId: session.id, action: "changelog.update", entity: "ChangelogEntry", entityId: id });
    revalidatePath("/admin/changelog");
    revalidatePath("/changelog");
    return { ok: true, id: e.id };
  } catch (e) {
    console.error("[updateChangelog]", e);
    return { ok: false, error: "Could not save — is the database running?" };
  }
}

export async function deleteChangelog(id: string) {
  const session = await authorize();
  try {
    await prisma.changelogEntry.delete({ where: { id } });
    await audit({ actorId: session.id, action: "changelog.delete", entity: "ChangelogEntry", entityId: id });
    revalidatePath("/admin/changelog");
    revalidatePath("/changelog");
  } catch (e) {
    console.error("[deleteChangelog]", e);
  }
  redirect("/admin/changelog");
}
