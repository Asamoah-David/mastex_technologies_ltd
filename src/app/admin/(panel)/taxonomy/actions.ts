"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-auth";
import { can } from "@/lib/rbac";
import { audit } from "@/lib/audit";
import { taxonomySchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

async function authorize() {
  const session = await getAdminSession();
  if (!session || !can(session.role, "settings:write")) {
    throw new Error("Not authorised to manage taxonomy.");
  }
  return session;
}

function revalidate() {
  revalidatePath("/admin/taxonomy");
  revalidatePath("/", "layout");
  revalidatePath("/products");
  revalidatePath("/solutions");
}

// ── Categories ──────────────────────────────────────────────────────────────

export async function createCategory(_prev: unknown, formData: FormData) {
  const session = await authorize();
  const name = String(formData.get("name") ?? "");
  const parsed = taxonomySchema.safeParse({
    name,
    slug: String(formData.get("slug") ?? "") || slugify(name),
    description: formData.get("description"),
  });
  if (!parsed.success) return { error: "Check the category fields." };
  try {
    await prisma.category.create({
      data: { name: parsed.data.name, slug: parsed.data.slug, description: parsed.data.description || null },
    });
    await audit({ actorId: session.id, action: "category.create", entity: "Category" });
    revalidate();
    return { ok: true };
  } catch {
    return { error: "Could not create — slug may already exist." };
  }
}

export async function updateCategory(id: string, name: string, description: string) {
  const session = await authorize();
  try {
    await prisma.category.update({ where: { id }, data: { name, description: description || null } });
    await audit({ actorId: session.id, action: "category.update", entity: "Category", entityId: id });
    revalidate();
    return { ok: true as const };
  } catch {
    return { ok: false as const, error: "Could not save." };
  }
}

export async function deleteCategory(id: string) {
  const session = await authorize();
  try {
    await prisma.category.delete({ where: { id } });
    await audit({ actorId: session.id, action: "category.delete", entity: "Category", entityId: id });
    revalidate();
  } catch (e) {
    console.error("[deleteCategory]", e);
  }
}

// ── Industries ──────────────────────────────────────────────────────────────

export async function createIndustry(_prev: unknown, formData: FormData) {
  const session = await authorize();
  const name = String(formData.get("name") ?? "");
  const parsed = taxonomySchema.safeParse({
    name,
    slug: String(formData.get("slug") ?? "") || slugify(name),
    description: formData.get("description"),
    icon: formData.get("icon"),
  });
  if (!parsed.success) return { error: "Check the industry fields." };
  try {
    await prisma.industry.create({
      data: {
        name: parsed.data.name,
        slug: parsed.data.slug,
        description: parsed.data.description || null,
        icon: parsed.data.icon || null,
      },
    });
    await audit({ actorId: session.id, action: "industry.create", entity: "Industry" });
    revalidate();
    return { ok: true };
  } catch {
    return { error: "Could not create — slug may already exist." };
  }
}

export async function updateIndustry(id: string, name: string, icon: string, description: string) {
  const session = await authorize();
  try {
    await prisma.industry.update({
      where: { id },
      data: { name, icon: icon || null, description: description || null },
    });
    await audit({ actorId: session.id, action: "industry.update", entity: "Industry", entityId: id });
    revalidate();
    return { ok: true as const };
  } catch {
    return { ok: false as const, error: "Could not save." };
  }
}

export async function deleteIndustry(id: string) {
  const session = await authorize();
  try {
    await prisma.industry.delete({ where: { id } });
    await audit({ actorId: session.id, action: "industry.delete", entity: "Industry", entityId: id });
    revalidate();
  } catch (e) {
    console.error("[deleteIndustry]", e);
  }
}
