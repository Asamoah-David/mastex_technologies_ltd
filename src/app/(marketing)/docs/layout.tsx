import { DocsSidebar } from "@/components/site/docs-sidebar";
import { getDocTree } from "@/lib/queries";

export default async function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const tree = await getDocTree();

  return (
    <div className="container-page py-12">
      <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <DocsSidebar tree={tree} />
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
