"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-auth";
import { can } from "@/lib/rbac";
import { audit } from "@/lib/audit";
import { productSchema, type ProductInput } from "@/lib/validations";

async function authorize() {
  const session = await getAdminSession();
  if (!session || !can(session.role, "products:write")) {
    throw new Error("Not authorised to manage products.");
  }
  return session;
}

type Result = { ok: true; id: string } | { ok: false; error: string; issues?: any };

function normalise(input: ProductInput) {
  return {
    name: input.name,
    slug: input.slug,
    tagline: input.tagline || null,
    description: input.description,
    longDescription: input.longDescription || null,
    status: input.status,
    featured: input.featured,
    order: input.order,
    demoUrl: input.demoUrl || null,
    repoUrl: input.repoUrl || null,
    docsUrl: input.docsUrl || null,
    coverUrl: input.coverUrl || null,
    pricing: input.pricing.length ? (input.pricing as any) : undefined,
    seoTitle: input.seoTitle || null,
    seoDescription: input.seoDescription || null,
  };
}

export async function createProduct(raw: ProductInput): Promise<Result> {
  const session = await authorize();
  const parsed = productSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "Validation failed", issues: parsed.error.flatten().fieldErrors };
  }
  const data = parsed.data;

  try {
    const exists = await prisma.product.findUnique({ where: { slug: data.slug } });
    if (exists) return { ok: false, error: "A product with that slug already exists." };

    const product = await prisma.product.create({
      data: {
        ...normalise(data),
        categoryId: data.categoryId || undefined,
        industries: { connect: data.industryIds.map((id) => ({ id })) },
        features: {
          create: data.features.map((f, i) => ({
            title: f.title,
            description: f.description || null,
            icon: f.icon || null,
            isBenefit: f.isBenefit,
            order: i,
          })),
        },
        media: {
          create: data.media
            .filter((m) => m.url.trim())
            .map((m, i) => ({ type: "IMAGE" as const, url: m.url.trim(), caption: m.caption || null, order: i })),
        },
      },
    });

    await audit({ actorId: session.id, action: "product.create", entity: "Product", entityId: product.id });
    revalidatePath("/admin/products");
    revalidatePath("/products");
    return { ok: true, id: product.id };
  } catch (e: any) {
    console.error("[createProduct]", e);
    return { ok: false, error: "Could not save — is the database running?" };
  }
}

export async function updateProduct(id: string, raw: ProductInput): Promise<Result> {
  const session = await authorize();
  const parsed = productSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "Validation failed", issues: parsed.error.flatten().fieldErrors };
  }
  const data = parsed.data;

  try {
    const clash = await prisma.product.findFirst({
      where: { slug: data.slug, NOT: { id } },
    });
    if (clash) return { ok: false, error: "Another product already uses that slug." };

    // Replace features + media wholesale for simplicity.
    await prisma.productFeature.deleteMany({ where: { productId: id } });
    await prisma.productMedia.deleteMany({ where: { productId: id } });

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...normalise(data),
        categoryId: data.categoryId || null,
        industries: { set: data.industryIds.map((iid) => ({ id: iid })) },
        features: {
          create: data.features.map((f, i) => ({
            title: f.title,
            description: f.description || null,
            icon: f.icon || null,
            isBenefit: f.isBenefit,
            order: i,
          })),
        },
        media: {
          create: data.media
            .filter((m) => m.url.trim())
            .map((m, i) => ({ type: "IMAGE" as const, url: m.url.trim(), caption: m.caption || null, order: i })),
        },
      },
    });

    await audit({ actorId: session.id, action: "product.update", entity: "Product", entityId: id });
    revalidatePath("/admin/products");
    revalidatePath("/products");
    revalidatePath(`/products/${data.slug}`);
    return { ok: true, id: product.id };
  } catch (e: any) {
    console.error("[updateProduct]", e);
    return { ok: false, error: "Could not save — is the database running?" };
  }
}

export async function deleteProduct(id: string) {
  const session = await authorize();
  try {
    await prisma.product.delete({ where: { id } });
    await audit({ actorId: session.id, action: "product.delete", entity: "Product", entityId: id });
    revalidatePath("/admin/products");
    revalidatePath("/products");
  } catch (e) {
    console.error("[deleteProduct]", e);
  }
  redirect("/admin/products");
}

export async function toggleFeatured(id: string, featured: boolean) {
  const session = await authorize();
  try {
    await prisma.product.update({ where: { id }, data: { featured } });
    await audit({ actorId: session.id, action: "product.feature", entity: "Product", entityId: id, metadata: { featured } });
    revalidatePath("/admin/products");
    revalidatePath("/products");
  } catch (e) {
    console.error("[toggleFeatured]", e);
  }
}
