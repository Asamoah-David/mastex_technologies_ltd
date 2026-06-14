import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import { Section, SectionHeader } from "@/components/site/section";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { getPublishedPosts } from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

export const metadata = buildMetadata({
  title: "Blog",
  description: "Engineering, product and company updates from Mastex Technologies Ltd.",
  path: "/blog",
});

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const all = await getPublishedPosts();
  const term = (q ?? "").trim().toLowerCase();
  const posts = term
    ? all.filter((p: any) =>
        `${p.title} ${p.excerpt ?? ""} ${p.category?.name ?? ""}`.toLowerCase().includes(term),
      )
    : all;
  const [featured, ...rest] = posts;

  return (
    <Section>
      <Reveal>
        <SectionHeader
          eyebrow="Blog"
          title="Insights from the team"
          description="What we're learning as we build software at scale."
        />
      </Reveal>

      <form action="/blog" className="mx-auto mt-8 flex max-w-md items-center">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            name="q"
            defaultValue={q ?? ""}
            placeholder="Search posts…"
            className="h-11 pl-9"
          />
        </div>
      </form>

      {term && (
        <p className="mt-4 text-center text-sm text-muted-foreground">
          {posts.length} result{posts.length === 1 ? "" : "s"} for “{q}”
        </p>
      )}

      {featured && (
        <Reveal delay={0.05}>
          <Link
            href={`/blog/${featured.slug}`}
            className="group mt-12 grid gap-8 rounded-3xl border bg-card p-8 transition-colors hover:border-primary/40 md:grid-cols-2 md:items-center"
          >
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl">
              <Image
                src={featured.coverUrl || "/images/hero-data.jpg"}
                alt={featured.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div>
              {featured.category && <Badge variant="muted">{featured.category.name}</Badge>}
              <h2 className="mt-4 text-2xl font-bold leading-tight group-hover:text-primary">
                {featured.title}
              </h2>
              <p className="mt-3 text-muted-foreground">{featured.excerpt}</p>
              <div className="mt-5 text-sm text-muted-foreground">
                {featured.author?.name ?? "Mastex"} ·{" "}
                {featured.publishedAt ? formatDate(featured.publishedAt) : ""} ·{" "}
                {featured.readingMinutes} min read
              </div>
            </div>
          </Link>
        </Reveal>
      )}

      <Stagger className="mt-8 grid gap-6 md:grid-cols-3">
        {rest.map((post) => (
          <StaggerItem key={post.id}>
            <Link
              href={`/blog/${post.slug}`}
              className="group flex h-full flex-col rounded-2xl border bg-card p-6 transition-colors hover:border-primary/40"
            >
              {post.category && (
                <Badge variant="muted" className="w-fit">
                  {post.category.name}
                </Badge>
              )}
              <h3 className="mt-4 text-lg font-semibold leading-snug group-hover:text-primary">
                {post.title}
              </h3>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{post.excerpt}</p>
              <div className="mt-5 text-xs text-muted-foreground">
                {post.publishedAt ? formatDate(post.publishedAt) : "Draft"} ·{" "}
                {post.readingMinutes} min read
              </div>
            </Link>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
