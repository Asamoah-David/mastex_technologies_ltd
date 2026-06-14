"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-auth";
import { can, type Permission } from "@/lib/rbac";
import { audit } from "@/lib/audit";
import { userSchema } from "@/lib/validations";
import { createAdminClient } from "@/lib/supabase/admin";

async function authorize() {
  const session = await getAdminSession();
  if (!session || !can(session.role, "users:write")) {
    throw new Error("Not authorised to manage users.");
  }
  return session;
}

type Result = { ok: true } | { ok: false; error: string; issues?: any };

export async function inviteUser(_prev: unknown, formData: FormData): Promise<Result> {
  const session = await authorize();
  const parsed = userSchema.safeParse({
    email: formData.get("email"),
    name: formData.get("name"),
    role: formData.get("role"),
  });
  if (!parsed.success) {
    return { ok: false, error: "Check the fields.", issues: parsed.error.flatten().fieldErrors };
  }
  const data = parsed.data;

  try {
    if (await prisma.user.findUnique({ where: { email: data.email } })) {
      return { ok: false, error: "A user with that email already exists." };
    }

    // If Supabase is configured, send a real invite and link the auth id.
    let supabaseId: string | undefined;
    const supabase = createAdminClient();
    if (supabase) {
      const { data: invited, error } = await supabase.auth.admin.inviteUserByEmail(data.email);
      if (error) console.error("[inviteUser] supabase invite", error.message);
      supabaseId = invited?.user?.id;
    }

    await prisma.user.create({
      data: {
        email: data.email,
        name: data.name || null,
        role: data.role,
        supabaseId,
        isActive: true,
      },
    });
    await audit({ actorId: session.id, action: "user.invite", entity: "User", metadata: { email: data.email, role: data.role } });
    revalidatePath("/admin/users");
    return { ok: true };
  } catch (e) {
    console.error("[inviteUser]", e);
    return { ok: false, error: "Could not create user — is the database running?" };
  }
}

export async function changeRole(id: string, role: string) {
  const session = await authorize();
  try {
    await prisma.user.update({ where: { id }, data: { role: role as any } });
    await audit({ actorId: session.id, action: "user.role", entity: "User", entityId: id, metadata: { role } });
    revalidatePath("/admin/users");
  } catch (e) {
    console.error("[changeRole]", e);
  }
}

export async function toggleActive(id: string, isActive: boolean) {
  const session = await authorize();
  try {
    await prisma.user.update({ where: { id }, data: { isActive } });
    await audit({ actorId: session.id, action: "user.active", entity: "User", entityId: id, metadata: { isActive } });
    revalidatePath("/admin/users");
  } catch (e) {
    console.error("[toggleActive]", e);
  }
}

export async function setUserPermissions(id: string, permissionKeys: string[]) {
  const session = await authorize();
  try {
    // Ensure the Permission rows exist, then replace this user's grants.
    const perms = await Promise.all(
      permissionKeys.map((key) =>
        prisma.permission.upsert({ where: { key }, update: {}, create: { key } }),
      ),
    );
    await prisma.permissionOnUser.deleteMany({ where: { userId: id } });
    await prisma.permissionOnUser.createMany({
      data: perms.map((p) => ({ userId: id, permissionId: p.id })),
      skipDuplicates: true,
    });
    await audit({ actorId: session.id, action: "user.permissions", entity: "User", entityId: id });
    revalidatePath("/admin/users");
    return { ok: true as const };
  } catch (e) {
    console.error("[setUserPermissions]", e);
    return { ok: false as const, error: "Could not update permissions." };
  }
}

export async function deleteUser(id: string) {
  const session = await authorize();
  if (session.id === id) return; // never delete yourself
  try {
    await prisma.user.delete({ where: { id } });
    await audit({ actorId: session.id, action: "user.delete", entity: "User", entityId: id });
    revalidatePath("/admin/users");
  } catch (e) {
    console.error("[deleteUser]", e);
  }
}
