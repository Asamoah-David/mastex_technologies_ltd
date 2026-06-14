import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Markdown, extractToc } from "@/components/markdown";
import { TableOfContents } from "@/components/site/table-of-contents";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { ReadingProgress } from "@/components/site/reading-progress";
import { getPostBySlug, getPublishedPosts } from "@/lib/queries";
import { buildMetadata, articleJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { formatDate } from "@/lib/utils";

export const revalidate = 600;

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return buildMetadata({ title: "Post not found", noIndex: true });
  return buildMetadata({
    title: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.excerpt ?? undefined,
    path: `/blog/${post.slug}`,
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [post, allPosts] = await Promise.all([getPostBySlug(slug), getPublishedPosts()]);
  if (!post) notFound();

  const toc = extractToc(post.content);
  const related = allPosts.filter((p: any) => p.slug !== post.slug).slice(0, 3);

  return (
    <article className="container-page py-16">
      <ReadingProgress />
      <JsonLd
        data={[
          articleJsonLd(post),
          breadcrumbJsonLd([
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
        ]}
      />
      <div className="mx-auto grid max-w-5xl gap-10 xl:grid-cols-[minmax(0,1fr)_200px]">
        <div className="mx-auto w-full max-w-3xl">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Blog", href: "/blog" },
            { name: post.title },
          ]}
        />

        <header className="mt-6">
          {post.category && <Badge variant="muted">{post.category.name}</Badge>}
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-balance">{post.title}</h1>
          <div className="mt-4 text-sm text-muted-foreground">
            {post.author?.name ?? "Mastex"} ·{" "}
            {post.publishedAt ? formatDate(post.publishedAt) : ""} · {post.readingMinutes} min
            read
          </div>
        </header>

        <div className="relative mt-8 aspect-[16/8] overflow-hidden rounded-2xl">
          <Image
            src={post.coverUrl || "/images/hero-data.jpg"}
            alt={post.title}
            fill
            sizes="(max-width: 1024px) 100vw, 768px"
            className="object-cover"
          />
        </div>

        <div className="mt-10">
          <Markdown content={post.content} />
        </div>
      </div>
      {toc.length >= 2 && (
        <aside className="hidden xl:block">
          <div className="sticky top-24">
            <TableOfContents headings={toc} />
          </div>
        </aside>
      )}
      </div>

      {related.length > 0 && (
        <div className="mx-auto mt-16 max-w-5xl border-t pt-12">
          <h2 className="text-xl font-bold tracking-tight">Keep reading</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {related.map((p: any) => (
              <Link
                key={p.id ?? p.slug}
                href={`/blog/${p.slug}`}
                className="group flex flex-col rounded-2xl border bg-card p-6 transition-colors hover:border-primary/40"
              >
                {p.category && (
                  <Badge variant="muted" className="w-fit">
                    {p.category.name}
                  </Badge>
                )}
                <h3 className="mt-3 font-semibold leading-snug group-hover:text-primary">
                  {p.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{p.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
