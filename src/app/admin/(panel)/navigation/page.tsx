import { PageHeader } from "@/components/admin/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { NavItemRow } from "./nav-item-row";
import { AddNavForm } from "./add-nav-form";
import { SeedNavButton } from "./seed-nav-button";

async function getItems(location: string) {
  try {
    return await prisma.navigationItem.findMany({
      where: { location, parentId: null },
      orderBy: { order: "asc" },
    });
  } catch {
    return [];
  }
}

export default async function AdminNavigationPage() {
  const [header, footer] = await Promise.all([getItems("header"), getItems("footer")]);

  return (
    <>
      <PageHeader
        title="Navigation"
        description="Manage the public header menu and extra footer links. Changes go live immediately."
        action={header.length === 0 ? <SeedNavButton /> : undefined}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Header menu</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {header.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No items yet — the site uses the built-in default menu. Add items below (or load the
                default) to manage it here.
              </p>
            )}
            {header.map((item, i) => (
              <NavItemRow
                key={item.id}
                item={item}
                isFirst={i === 0}
                isLast={i === header.length - 1}
              />
            ))}
            <AddNavForm location="header" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Footer links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {footer.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Extra footer links appear in a row above the copyright line.
              </p>
            )}
            {footer.map((item, i) => (
              <NavItemRow
                key={item.id}
                item={item}
                isFirst={i === 0}
                isLast={i === footer.length - 1}
              />
            ))}
            <AddNavForm location="footer" />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
