import { PageHeader } from "@/components/admin/page-header";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-auth";
import { ALL_PERMISSIONS, permissionsForRole } from "@/lib/rbac";
import { InviteForm } from "./invite-form";
import { UserRow } from "./user-row";

async function getUsers() {
  try {
    return await prisma.user.findMany({
      include: { permissions: { include: { permission: true } } },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}

export default async function AdminUsersPage() {
  const [users, session] = await Promise.all([getUsers(), getAdminSession()]);

  const rolePermissions: Record<string, string[]> = {
    VIEWER: permissionsForRole("VIEWER"),
    SUPPORT: permissionsForRole("SUPPORT"),
    EDITOR: permissionsForRole("EDITOR"),
    ADMIN: permissionsForRole("ADMIN"),
    SUPER_ADMIN: [...ALL_PERMISSIONS],
  };

  return (
    <>
      <PageHeader
        title="Users & roles"
        description="Role-based access control with optional per-user permission grants."
        action={<InviteForm />}
      />

      {users.length === 0 ? (
        <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
          No users found. Run <code>pnpm db:seed</code> to create the super admin, or invite one above.
        </div>
      ) : (
        <div className="space-y-3">
          {users.map((u: any) => (
            <UserRow
              key={u.id}
              user={u}
              allPermissions={ALL_PERMISSIONS}
              rolePermissions={rolePermissions}
              isSelf={session?.id === u.id || session?.email === u.email}
            />
          ))}
        </div>
      )}
    </>
  );
}
