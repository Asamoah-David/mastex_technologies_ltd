"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-auth";
import { can } from "@/lib/rbac";
import { audit } from "@/lib/audit";
import { jobSchema, type JobInput } from "@/lib/validations";

async function authorize() {
  const session = await getAdminSession();
  if (!session || !can(session.role, "settings:write")) {
    throw new Error("Not authorised to manage careers.");
  }
  return session;
}

type Result = { ok: true; id: string } | { ok: false; error: string; issues?: any };

function data(input: JobInput) {
  return {
    title: input.title,
    slug: input.slug,
    department: input.department,
    location: input.location,
    type: input.type,
    description: input.description,
    requirements: input.requirements || null,
    status: input.status,
  };
}

export async function createJob(raw: JobInput): Promise<Result> {
  const session = await authorize();
  const parsed = jobSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "Validation failed", issues: parsed.error.flatten().fieldErrors };
  }
  try {
    if (await prisma.jobPosting.findUnique({ where: { slug: parsed.data.slug } })) {
      return { ok: false, error: "A posting with that slug already exists." };
    }
    const j = await prisma.jobPosting.create({ data: data(parsed.data) });
    await audit({ actorId: session.id, action: "job.create", entity: "JobPosting", entityId: j.id });
    revalidatePath("/admin/careers");
    revalidatePath("/careers");
    return { ok: true, id: j.id };
  } catch (e) {
    console.error("[createJob]", e);
    return { ok: false, error: "Could not save — is the database running?" };
  }
}

export async function updateJob(id: string, raw: JobInput): Promise<Result> {
  const session = await authorize();
  const parsed = jobSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "Validation failed", issues: parsed.error.flatten().fieldErrors };
  }
  try {
    const clash = await prisma.jobPosting.findFirst({ where: { slug: parsed.data.slug, NOT: { id } } });
    if (clash) return { ok: false, error: "Another posting already uses that slug." };
    const j = await prisma.jobPosting.update({ where: { id }, data: data(parsed.data) });
    await audit({ actorId: session.id, action: "job.update", entity: "JobPosting", entityId: id });
    revalidatePath("/admin/careers");
    revalidatePath("/careers");
    return { ok: true, id: j.id };
  } catch (e) {
    console.error("[updateJob]", e);
    return { ok: false, error: "Could not save — is the database running?" };
  }
}

export async function deleteJob(id: string) {
  const session = await authorize();
  try {
    await prisma.jobPosting.delete({ where: { id } });
    await audit({ actorId: session.id, action: "job.delete", entity: "JobPosting", entityId: id });
    revalidatePath("/admin/careers");
    revalidatePath("/careers");
  } catch (e) {
    console.error("[deleteJob]", e);
  }
  redirect("/admin/careers");
}
