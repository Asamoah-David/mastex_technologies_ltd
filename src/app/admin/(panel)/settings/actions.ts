"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-auth";
import { can } from "@/lib/rbac";
import { audit } from "@/lib/audit";

export async function setBrandLogo(markUrl: string) {
  const session = await getAdminSession();
  if (!session || !can(session.role, "settings:write")) {
    return { ok: false as const, error: "Not authorised." };
  }
  try {
    await prisma.siteSetting.upsert({
      where: { key: "brand.logo" },
      update: { value: { markUrl } },
      create: { key: "brand.logo", group: "brand", value: { markUrl } },
    });
    await audit({ actorId: session.id, action: "brand.logo", entity: "SiteSetting", entityId: "brand.logo" });
    revalidatePath("/admin/settings");
    revalidatePath("/", "layout");
    return { ok: true as const };
  } catch (e) {
    console.error("[setBrandLogo]", e);
    return { ok: false as const, error: "Could not save — is the database running?" };
  }
}

export async function updateSetting(_prev: unknown, formData: FormData) {
  const session = await getAdminSession();
  if (!session || !can(session.role, "settings:write")) {
    return { error: "Not authorised to edit settings." };
  }

  const key = String(formData.get("key") ?? "");
  const raw = String(formData.get("value") ?? "");

  let value: any;
  try {
    value = JSON.parse(raw);
  } catch {
    return { error: "Value must be valid JSON." };
  }

  try {
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, group: "general", value },
    });
    await audit({ actorId: session.id, action: "setting.update", entity: "SiteSetting", entityId: key });
    revalidatePath("/admin/settings");
    revalidatePath("/", "layout");
    return { ok: true };
  } catch (e) {
    console.error(e);
    return { error: "Could not save — is the database running?" };
  }
}
