import Link from "next/link";
import { ArrowRight, BookText } from "lucide-react";
import { getDocTree } from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Documentation",
  description: "Guides and reference for every Mastex product.",
  path: "/docs",
});

export default async function DocsIndexPage() {
  const tree = await getDocTree();
  const first = tree[0]?.articles?.[0];

  return (
    <div className="max-w-2xl">
      <div className="inline-flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <BookText className="size-6" />
      </div>
      <h1 className="mt-5 text-4xl font-bold tracking-tight">Documentation</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Everything you need to get the most out of the Mastex platform — guides, references and
        best practices for each product.
      </p>
      {first && (
        <Link
          href={`/docs/${first.slug}`}
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Start with {first.title} <ArrowRight className="size-4" />
        </Link>
      )}

      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        {tree.map((cat) => (
          <div key={cat.id} className="rounded-xl border bg-card p-5">
            <h2 className="font-semibold">{cat.name}</h2>
            <ul className="mt-3 space-y-1.5">
              {(cat.articles ?? []).map((a: any) => (
                <li key={a.id}>
                  <Link
                    href={`/docs/${a.slug}`}
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    {a.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
