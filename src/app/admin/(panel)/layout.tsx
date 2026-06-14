import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import { canAccessAdmin } from "@/lib/rbac";
import { getBrandLogo } from "@/lib/queries";
import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminTopbar } from "@/components/admin/topbar";

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  if (!canAccessAdmin(session.role)) redirect("/admin/login?error=forbidden");

  const logoSrc = await getBrandLogo();

  return (
    <div className="flex min-h-dvh bg-muted/20">
      <AdminSidebar logoSrc={logoSrc} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar session={session} />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
