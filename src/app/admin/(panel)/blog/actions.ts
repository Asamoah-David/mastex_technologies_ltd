"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-auth";
import { can } from "@/lib/rbac";
import { audit } from "@/lib/audit";
import { blogPostSchema, type BlogPostInput } from "@/lib/validations";
import { readingTime, slugify } from "@/lib/utils";

async function authorize() {
  const session = await getAdminSession();
  if (!session || !can(session.role, "blog:write")) {
    throw new Error("Not authorised to manage the blog.");
  }
  return session;
}

type Result = { ok: true; id: string } | { ok: false; error: string; issues?: any };

async function upsertTags(names: string[]) {
  const ids: string[] = [];
  for (const name of names.map((n) => n.trim()).filter(Boolean)) {
    const slug = slugify(name);
    const tag = await prisma.tag.upsert({
      where: { slug },
      update: {},
      create: { name, slug },
    });
    ids.push(tag.id);
  }
  return ids;
}

function baseData(data: BlogPostInput) {
  const publishedAt =
    data.status === "PUBLISHED"
      ? data.publishedAt
        ? new Date(data.publishedAt)
        : new Date()
      : data.status === "SCHEDULED" && data.publishedAt
        ? new Date(data.publishedAt)
        : null;

  return {
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt || null,
    content: data.content,
    coverUrl: data.coverUrl || null,
    status: data.status,
    publishedAt,
    readingMinutes: data.readingMinutes || readingTime(data.content),
    categoryId: data.categoryId || null,
    seoTitle: data.seoTitle || null,
    seoDescription: data.seoDescription || null,
  };
}

export async function createPost(raw: BlogPostInput): Promise<Result> {
  const session = await authorize();
  const parsed = blogPostSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "Validation failed", issues: parsed.error.flatten().fieldErrors };
  }
  const data = parsed.data;

  try {
    if (await prisma.blogPost.findUnique({ where: { slug: data.slug } })) {
      return { ok: false, error: "A post with that slug already exists." };
    }
    const tagIds = await upsertTags(data.tags);
    const post = await prisma.blogPost.create({
      data: {
        ...baseData(data),
        authorId: session.id.startsWith("dev-") ? undefined : session.id,
        tags: { create: tagIds.map((tagId) => ({ tagId })) },
      },
    });
    await audit({ actorId: session.id, action: "post.create", entity: "BlogPost", entityId: post.id });
    revalidatePath("/admin/blog");
    revalidatePath("/blog");
    return { ok: true, id: post.id };
  } catch (e) {
    console.error("[createPost]", e);
    return { ok: false, error: "Could not save — is the database running?" };
  }
}

export async function updatePost(id: string, raw: BlogPostInput): Promise<Result> {
  const session = await authorize();
  const parsed = blogPostSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "Validation failed", issues: parsed.error.flatten().fieldErrors };
  }
  const data = parsed.data;

  try {
    const clash = await prisma.blogPost.findFirst({ where: { slug: data.slug, NOT: { id } } });
    if (clash) return { ok: false, error: "Another post already uses that slug." };

    const tagIds = await upsertTags(data.tags);
    await prisma.tagsOnPosts.deleteMany({ where: { postId: id } });

    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        ...baseData(data),
        tags: { create: tagIds.map((tagId) => ({ tagId })) },
      },
    });
    await audit({ actorId: session.id, action: "post.update", entity: "BlogPost", entityId: id });
    revalidatePath("/admin/blog");
    revalidatePath("/blog");
    revalidatePath(`/blog/${data.slug}`);
    return { ok: true, id: post.id };
  } catch (e) {
    console.error("[updatePost]", e);
    return { ok: false, error: "Could not save — is the database running?" };
  }
}

export async function deletePost(id: string) {
  const session = await authorize();
  try {
    await prisma.blogPost.delete({ where: { id } });
    await audit({ actorId: session.id, action: "post.delete", entity: "BlogPost", entityId: id });
    revalidatePath("/admin/blog");
    revalidatePath("/blog");
  } catch (e) {
    console.error("[deletePost]", e);
  }
  redirect("/admin/blog");
}
