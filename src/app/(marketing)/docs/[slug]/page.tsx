import { notFound } from "next/navigation";
import { Markdown, extractToc } from "@/components/markdown";
import { TableOfContents } from "@/components/site/table-of-contents";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { getDocArticle, getDocTree } from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  const tree = await getDocTree();
  return tree.flatMap((c: any) => (c.articles ?? []).map((a: any) => ({ slug: a.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getDocArticle(slug);
  if (!article) return buildMetadata({ title: "Doc not found", noIndex: true });
  return buildMetadata({
    title: `${article.title} — Docs`,
    path: `/docs/${article.slug}`,
  });
}

export default async function DocArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getDocArticle(slug);
  if (!article) notFound();

  const toc = extractToc(article.content);

  return (
    <div className="grid min-w-0 gap-10 xl:grid-cols-[1fr_200px]">
      <div className="min-w-0">
        <Breadcrumbs
          className="mb-6"
          items={[
            { name: "Docs", href: "/docs" },
            ...(article.category ? [{ name: article.category.name }] : []),
            { name: article.title },
          ]}
        />
        {article.category && (
          <div className="text-sm font-medium text-primary">{article.category.name}</div>
        )}
        <Markdown content={article.content} className="mt-4" />
      </div>
      {toc.length >= 2 && (
        <aside className="hidden xl:block">
          <div className="sticky top-24">
            <TableOfContents headings={toc} />
          </div>
        </aside>
      )}
    </div>
  );
}
