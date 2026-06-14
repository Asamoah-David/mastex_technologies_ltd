import { prisma } from "@/lib/prisma";
import { fallback } from "@/lib/fallback-data";

/**
 * Data-access layer for the public site. Every query degrades gracefully:
 * if the database is unreachable (e.g. before `pnpm db:push`), it returns
 * curated fallback content so the site always renders.
 */

async function safe<T>(fn: () => Promise<T>, fb: T): Promise<T> {
  try {
    const result = await fn();
    if (Array.isArray(result) && result.length === 0) return fb;
    return result ?? fb;
  } catch {
    return fb;
  }
}

export function getFeaturedProducts() {
  return safe(
    () =>
      prisma.product.findMany({
        where: { featured: true },
        include: { category: true, industries: true, features: { take: 4, orderBy: { order: "asc" } } },
        orderBy: { order: "asc" },
        take: 6,
      }),
    fallback.products.filter((p) => p.featured),
  );
}

export function getAllProducts() {
  return safe(
    () =>
      prisma.product.findMany({
        include: { category: true, industries: true },
        orderBy: [{ featured: "desc" }, { order: "asc" }],
      }),
    fallback.products,
  );
}

export function getProductBySlug(slug: string) {
  return safe(
    () =>
      prisma.product.findUnique({
        where: { slug },
        include: {
          category: true,
          industries: true,
          features: { orderBy: { order: "asc" } },
          media: { orderBy: { order: "asc" } },
          changelog: { orderBy: { releasedAt: "desc" } },
        },
      }),
    fallback.products.find((p) => p.slug === slug) ?? null,
  );
}

export function getCategories() {
  return safe(() => prisma.category.findMany({ orderBy: { name: "asc" } }), fallback.categories);
}

export function getIndustries() {
  return safe(() => prisma.industry.findMany({ orderBy: { name: "asc" } }), fallback.industries);
}

export function getSolutions() {
  return safe(
    () =>
      prisma.solution.findMany({
        where: { status: "PUBLISHED" },
        include: { industry: true },
        orderBy: { order: "asc" },
      }),
    fallback.solutions,
  );
}

export function getSolutionBySlug(slug: string) {
  return safe(
    () =>
      prisma.solution.findFirst({
        where: { slug, status: "PUBLISHED" },
        include: { industry: true },
      }),
    fallback.solutions.find((s) => s.slug === slug) ?? null,
  );
}

export function getPublishedPosts() {
  return safe(
    () =>
      prisma.blogPost.findMany({
        where: { status: "PUBLISHED" },
        include: { author: true, category: true },
        orderBy: { publishedAt: "desc" },
      }),
    fallback.posts,
  );
}

export function getPostBySlug(slug: string) {
  return safe(
    () =>
      prisma.blogPost.findFirst({
        where: { slug, status: "PUBLISHED" },
        include: { author: true, category: true },
      }),
    fallback.posts.find((p) => p.slug === slug) ?? null,
  );
}

export function getDocTree() {
  return safe(
    () =>
      prisma.docCategory.findMany({
        include: {
          articles: { where: { status: "PUBLISHED" }, orderBy: { order: "asc" } },
        },
        orderBy: { order: "asc" },
      }),
    fallback.docCategories,
  );
}

export function getDocArticle(slug: string) {
  return safe(
    () => prisma.docArticle.findUnique({ where: { slug }, include: { category: true } }),
    fallback.docCategories.flatMap((c) => c.articles).find((a) => a.slug === slug) ?? null,
  );
}

export function getChangelog() {
  return safe(
    () =>
      prisma.changelogEntry.findMany({
        where: { status: "PUBLISHED" },
        include: { product: { select: { name: true, slug: true } } },
        orderBy: { releasedAt: "desc" },
        take: 50,
      }),
    [],
  );
}

export function getJobs() {
  return safe(
    () => prisma.jobPosting.findMany({ where: { status: "PUBLISHED" }, orderBy: { createdAt: "desc" } }),
    fallback.jobs,
  );
}

export function getSetting<T = any>(key: string): Promise<T | null> {
  return safe(
    async () => {
      const s = await prisma.siteSetting.findUnique({ where: { key } });
      return (s?.value as T) ?? null;
    },
    (fallback.settings[key] as T) ?? null,
  );
}

export async function getBrandLogo(): Promise<string> {
  return safe(
    async () => {
      const s = await prisma.siteSetting.findUnique({ where: { key: "brand.logo" } });
      const url = (s?.value as any)?.markUrl;
      return typeof url === "string" && url.trim() ? url : "/logo-mark.png";
    },
    "/logo-mark.png",
  );
}

export async function getNavigation() {
  return safe(
    async () => {
      const items = await prisma.navigationItem.findMany({
        where: { parentId: null },
        orderBy: { order: "asc" },
      });
      const header = items
        .filter((i) => i.location === "header")
        .map((i) => ({ label: i.label, href: i.href, isExternal: i.isExternal }));
      const footer = items
        .filter((i) => i.location === "footer")
        .map((i) => ({ label: i.label, href: i.href, isExternal: i.isExternal }));
      return { header, footer };
    },
    {
      header: [
        { label: "Products", href: "/products", isExternal: false },
        { label: "Solutions", href: "/solutions", isExternal: false },
        { label: "Docs", href: "/docs", isExternal: false },
        { label: "Blog", href: "/blog", isExternal: false },
        { label: "Careers", href: "/careers", isExternal: false },
        { label: "About", href: "/about", isExternal: false },
      ],
      footer: [],
    },
  );
}

export function getStats() {
  return safe(
    async () => {
      const [products, posts, docs, leads] = await Promise.all([
        prisma.product.count(),
        prisma.blogPost.count(),
        prisma.docArticle.count(),
        prisma.lead.count(),
      ]);
      return { products, posts, docs, leads };
    },
    { products: 4, posts: 2, docs: 2, leads: 1 },
  );
}
