"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-auth";
import { can } from "@/lib/rbac";
import { audit } from "@/lib/audit";
import {
  docArticleSchema,
  docCategorySchema,
  type DocArticleInput,
  type DocCategoryInput,
} from "@/lib/validations";

async function authorize() {
  const session = await getAdminSession();
  if (!session || !can(session.role, "docs:write")) {
    throw new Error("Not authorised to manage documentation.");
  }
  return session;
}

type Result = { ok: true; id: string } | { ok: false; error: string; issues?: any };

function articleData(data: DocArticleInput) {
  return {
    title: data.title,
    slug: data.slug,
    content: data.content,
    categoryId: data.categoryId,
    status: data.status,
    version: data.version,
    order: data.order,
    parentId: data.parentId || null,
  };
}

export async function createArticle(raw: DocArticleInput): Promise<Result> {
  const session = await authorize();
  const parsed = docArticleSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "Validation failed", issues: parsed.error.flatten().fieldErrors };
  }
  const data = parsed.data;
  try {
    if (await prisma.docArticle.findUnique({ where: { slug: data.slug } })) {
      return { ok: false, error: "An article with that slug already exists." };
    }
    const article = await prisma.docArticle.create({
      data: { ...articleData(data), authorId: session.id.startsWith("dev-") ? undefined : session.id },
    });
    await audit({ actorId: session.id, action: "doc.create", entity: "DocArticle", entityId: article.id });
    revalidatePath("/admin/docs");
    revalidatePath("/docs");
    return { ok: true, id: article.id };
  } catch (e) {
    console.error("[createArticle]", e);
    return { ok: false, error: "Could not save — is the database running?" };
  }
}

export async function updateArticle(id: string, raw: DocArticleInput): Promise<Result> {
  const session = await authorize();
  const parsed = docArticleSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "Validation failed", issues: parsed.error.flatten().fieldErrors };
  }
  const data = parsed.data;
  try {
    const clash = await prisma.docArticle.findFirst({ where: { slug: data.slug, NOT: { id } } });
    if (clash) return { ok: false, error: "Another article already uses that slug." };
    // Guard against an article being its own parent.
    const patch = articleData(data);
    if (patch.parentId === id) patch.parentId = null;

    const article = await prisma.docArticle.update({ where: { id }, data: patch });
    await audit({ actorId: session.id, action: "doc.update", entity: "DocArticle", entityId: id });
    revalidatePath("/admin/docs");
    revalidatePath("/docs");
    revalidatePath(`/docs/${data.slug}`);
    return { ok: true, id: article.id };
  } catch (e) {
    console.error("[updateArticle]", e);
    return { ok: false, error: "Could not save — is the database running?" };
  }
}

export async function deleteArticle(id: string) {
  const session = await authorize();
  try {
    await prisma.docArticle.delete({ where: { id } });
    await audit({ actorId: session.id, action: "doc.delete", entity: "DocArticle", entityId: id });
    revalidatePath("/admin/docs");
    revalidatePath("/docs");
  } catch (e) {
    console.error("[deleteArticle]", e);
  }
  redirect("/admin/docs");
}

export async function createCategory(_prev: unknown, formData: FormData): Promise<any> {
  const session = await authorize();
  const parsed = docCategorySchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    icon: formData.get("icon"),
    order: formData.get("order") ?? 0,
  } as DocCategoryInput);
  if (!parsed.success) {
    return { error: "Check the category fields.", issues: parsed.error.flatten().fieldErrors };
  }
  try {
    await prisma.docCategory.create({ data: parsed.data });
    await audit({ actorId: session.id, action: "docCategory.create", entity: "DocCategory" });
    revalidatePath("/admin/docs");
    revalidatePath("/docs");
    return { ok: true };
  } catch (e) {
    console.error("[createCategory]", e);
    return { error: "Could not create category." };
  }
}
