"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-auth";
import { can } from "@/lib/rbac";
import { audit } from "@/lib/audit";
import { solutionSchema, type SolutionInput } from "@/lib/validations";

async function authorize() {
  const session = await getAdminSession();
  // Solutions are marketing content — gated under settings:write.
  if (!session || !can(session.role, "settings:write")) {
    throw new Error("Not authorised to manage solutions.");
  }
  return session;
}

type Result = { ok: true; id: string } | { ok: false; error: string; issues?: any };

function data(input: SolutionInput) {
  return {
    title: input.title,
    slug: input.slug,
    summary: input.summary,
    body: input.body || null,
    icon: input.icon || null,
    coverUrl: input.coverUrl || null,
    order: input.order,
    status: input.status,
    industryId: input.industryId || null,
  };
}

export async function createSolution(raw: SolutionInput): Promise<Result> {
  const session = await authorize();
  const parsed = solutionSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "Validation failed", issues: parsed.error.flatten().fieldErrors };
  }
  try {
    if (await prisma.solution.findUnique({ where: { slug: parsed.data.slug } })) {
      return { ok: false, error: "A solution with that slug already exists." };
    }
    const s = await prisma.solution.create({ data: data(parsed.data) });
    await audit({ actorId: session.id, action: "solution.create", entity: "Solution", entityId: s.id });
    revalidatePath("/admin/solutions");
    revalidatePath("/solutions");
    return { ok: true, id: s.id };
  } catch (e) {
    console.error("[createSolution]", e);
    return { ok: false, error: "Could not save — is the database running?" };
  }
}

export async function updateSolution(id: string, raw: SolutionInput): Promise<Result> {
  const session = await authorize();
  const parsed = solutionSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "Validation failed", issues: parsed.error.flatten().fieldErrors };
  }
  try {
    const clash = await prisma.solution.findFirst({ where: { slug: parsed.data.slug, NOT: { id } } });
    if (clash) return { ok: false, error: "Another solution already uses that slug." };
    const s = await prisma.solution.update({ where: { id }, data: data(parsed.data) });
    await audit({ actorId: session.id, action: "solution.update", entity: "Solution", entityId: id });
    revalidatePath("/admin/solutions");
    revalidatePath("/solutions");
    revalidatePath(`/solutions/${parsed.data.slug}`);
    return { ok: true, id: s.id };
  } catch (e) {
    console.error("[updateSolution]", e);
    return { ok: false, error: "Could not save — is the database running?" };
  }
}

export async function deleteSolution(id: string) {
  const session = await authorize();
  try {
    await prisma.solution.delete({ where: { id } });
    await audit({ actorId: session.id, action: "solution.delete", entity: "Solution", entityId: id });
    revalidatePath("/admin/solutions");
    revalidatePath("/solutions");
  } catch (e) {
    console.error("[deleteSolution]", e);
  }
  redirect("/admin/solutions");
}
