import { PageHeader } from "@/components/admin/page-header";
import { getAdminSettings } from "@/lib/admin-queries";
import { getBrandLogo } from "@/lib/queries";
import { fallback } from "@/lib/fallback-data";
import { SettingEditor } from "./setting-editor";
import { BrandLogoEditor } from "./brand-logo-editor";

export default async function AdminSettingsPage() {
  let settings = await getAdminSettings();
  const logo = await getBrandLogo();

  // Fall back to the curated defaults if the DB is empty/unavailable.
  if (!settings.length) {
    settings = Object.entries(fallback.settings).map(([key, value]) => ({
      id: key,
      key,
      group: "general",
      value,
    })) as any;
  }

  // The brand logo has its own dedicated editor — hide it from the raw JSON list.
  settings = settings.filter((s: any) => s.key !== "brand.logo");

  return (
    <>
      <PageHeader
        title="Site settings"
        description="Editable content blocks for the public site — homepage, company details, footer and more. Stored as JSON; changes go live immediately."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <BrandLogoEditor current={logo === "/logo-mark.png" ? "" : logo} />
        {settings.map((s: any) => (
          <SettingEditor key={s.key} setting={s} />
        ))}
      </div>
    </>
  );
}
