"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-auth";
import { can } from "@/lib/rbac";
import { audit } from "@/lib/audit";

async function authorize() {
  const session = await getAdminSession();
  if (!session || !can(session.role, "settings:write")) {
    throw new Error("Not authorised to manage navigation.");
  }
  return session;
}

function revalidate() {
  revalidatePath("/admin/navigation");
  revalidatePath("/", "layout");
}

export async function createNavItem(_prev: unknown, formData: FormData) {
  const session = await authorize();
  const label = String(formData.get("label") ?? "").trim();
  const href = String(formData.get("href") ?? "").trim();
  const location = String(formData.get("location") ?? "header");
  const isExternal = formData.get("isExternal") === "on";

  if (!label || !href) return { error: "Label and href are required." };

  try {
    const count = await prisma.navigationItem.count({ where: { location } });
    await prisma.navigationItem.create({
      data: { label, href, location, isExternal, order: count },
    });
    await audit({ actorId: session.id, action: "nav.create", entity: "NavigationItem" });
    revalidate();
    return { ok: true };
  } catch (e) {
    console.error("[createNavItem]", e);
    return { error: "Could not create — is the database running?" };
  }
}

export async function updateNavItem(
  id: string,
  data: { label: string; href: string; isExternal: boolean },
) {
  const session = await authorize();
  try {
    await prisma.navigationItem.update({
      where: { id },
      data: { label: data.label, href: data.href, isExternal: data.isExternal },
    });
    await audit({ actorId: session.id, action: "nav.update", entity: "NavigationItem", entityId: id });
    revalidate();
    return { ok: true as const };
  } catch (e) {
    console.error("[updateNavItem]", e);
    return { ok: false as const, error: "Could not save." };
  }
}

export async function deleteNavItem(id: string) {
  const session = await authorize();
  try {
    await prisma.navigationItem.delete({ where: { id } });
    await audit({ actorId: session.id, action: "nav.delete", entity: "NavigationItem", entityId: id });
    revalidate();
  } catch (e) {
    console.error("[deleteNavItem]", e);
  }
}

export async function moveNavItem(id: string, direction: "up" | "down") {
  const session = await authorize();
  try {
    const item = await prisma.navigationItem.findUnique({ where: { id } });
    if (!item) return;
    const siblings = await prisma.navigationItem.findMany({
      where: { location: item.location, parentId: item.parentId ?? null },
      orderBy: { order: "asc" },
    });
    const idx = siblings.findIndex((s) => s.id === id);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= siblings.length) return;

    const a = siblings[idx];
    const b = siblings[swapIdx];
    await prisma.$transaction([
      prisma.navigationItem.update({ where: { id: a.id }, data: { order: b.order } }),
      prisma.navigationItem.update({ where: { id: b.id }, data: { order: a.order } }),
    ]);
    await audit({ actorId: session.id, action: "nav.reorder", entity: "NavigationItem", entityId: id });
    revalidate();
  } catch (e) {
    console.error("[moveNavItem]", e);
  }
}

export async function seedDefaultNav() {
  const session = await authorize();
  const defaults = [
    { label: "Products", href: "/products" },
    { label: "Solutions", href: "/solutions" },
    { label: "Docs", href: "/docs" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
    { label: "About", href: "/about" },
  ];
  try {
    for (let i = 0; i < defaults.length; i++) {
      const d = defaults[i];
      const exists = await prisma.navigationItem.findFirst({
        where: { href: d.href, location: "header" },
      });
      if (!exists) {
        await prisma.navigationItem.create({
          data: { ...d, location: "header", order: i },
        });
      }
    }
    await audit({ actorId: session.id, action: "nav.seed", entity: "NavigationItem" });
    revalidate();
    return { ok: true };
  } catch (e) {
    console.error("[seedDefaultNav]", e);
    return { error: "Could not seed navigation." };
  }
}
