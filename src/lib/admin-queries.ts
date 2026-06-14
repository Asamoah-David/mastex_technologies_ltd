import "server-only";
import { prisma } from "@/lib/prisma";

async function safe<T>(fn: () => Promise<T>, fb: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fb;
  }
}

export function getDashboardData() {
  return safe(
    async () => {
      const [products, posts, docs, leads, recentLeads, recentAudit, leadsByStatus] =
        await Promise.all([
          prisma.product.count(),
          prisma.blogPost.count(),
          prisma.docArticle.count(),
          prisma.lead.count(),
          prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
          prisma.auditLog.findMany({
            orderBy: { createdAt: "desc" },
            take: 6,
            include: { actor: true },
          }),
          prisma.lead.groupBy({ by: ["status"], _count: true }),
        ]);
      return { products, posts, docs, leads, recentLeads, recentAudit, leadsByStatus };
    },
    {
      products: 4,
      posts: 2,
      docs: 2,
      leads: 1,
      recentLeads: [] as any[],
      recentAudit: [] as any[],
      leadsByStatus: [] as any[],
    },
  );
}

export function getAdminProducts() {
  return safe(
    () =>
      prisma.product.findMany({
        include: { category: true },
        orderBy: [{ featured: "desc" }, { order: "asc" }],
      }),
    [],
  );
}

export function getProductFormData(id?: string) {
  return safe(
    async () => {
      const [categories, industries, product] = await Promise.all([
        prisma.category.findMany({ orderBy: { name: "asc" } }),
        prisma.industry.findMany({ orderBy: { name: "asc" } }),
        id
          ? prisma.product.findUnique({
              where: { id },
              include: {
                features: { orderBy: { order: "asc" } },
                industries: true,
                media: { orderBy: { order: "asc" } },
              },
            })
          : Promise.resolve(null),
      ]);
      return { categories, industries, product };
    },
    { categories: [], industries: [], product: null },
  );
}

export function getBlogFormData(id?: string) {
  return safe(
    async () => {
      const [categories, post] = await Promise.all([
        prisma.blogCategory.findMany({ orderBy: { name: "asc" } }),
        id
          ? prisma.blogPost.findUnique({ where: { id }, include: { tags: { include: { tag: true } } } })
          : Promise.resolve(null),
      ]);
      return { categories, post };
    },
    { categories: [], post: null },
  );
}

export function getDocFormData(id?: string) {
  return safe(
    async () => {
      const [categories, article, allArticles] = await Promise.all([
        prisma.docCategory.findMany({ orderBy: { order: "asc" } }),
        id ? prisma.docArticle.findUnique({ where: { id } }) : Promise.resolve(null),
        prisma.docArticle.findMany({ select: { id: true, title: true }, orderBy: { title: "asc" } }),
      ]);
      return { categories, article, allArticles };
    },
    { categories: [], article: null, allArticles: [] },
  );
}

export function getAdminPosts() {
  return safe(
    () => prisma.blogPost.findMany({ include: { category: true, author: true }, orderBy: { updatedAt: "desc" } }),
    [],
  );
}

export function getAdminLeads() {
  return safe(
    () => prisma.lead.findMany({ include: { owner: true }, orderBy: { createdAt: "desc" } }),
    [],
  );
}

export function getAdminDocs() {
  return safe(
    () =>
      prisma.docCategory.findMany({
        include: { articles: { orderBy: { order: "asc" } } },
        orderBy: { order: "asc" },
      }),
    [],
  );
}

export function getAdminMedia() {
  return safe(() => prisma.media.findMany({ orderBy: { createdAt: "desc" } }), []);
}

export function getMediaLibrary(opts?: { folderId?: string; q?: string }) {
  return safe(
    async () => {
      const [folders, media] = await Promise.all([
        prisma.mediaFolder.findMany({
          include: { _count: { select: { media: true } } },
          orderBy: { name: "asc" },
        }),
        prisma.media.findMany({
          where: {
            folderId: opts?.folderId || undefined,
            ...(opts?.q
              ? {
                  OR: [
                    { name: { contains: opts.q, mode: "insensitive" } },
                    { tags: { has: opts.q } },
                  ],
                }
              : {}),
          },
          orderBy: { createdAt: "desc" },
        }),
      ]);
      return { folders, media };
    },
    { folders: [], media: [] },
  );
}

export function getAdminUsers() {
  return safe(() => prisma.user.findMany({ orderBy: { createdAt: "desc" } }), []);
}

export function getAdminSolutions() {
  return safe(
    () => prisma.solution.findMany({ include: { industry: true }, orderBy: { order: "asc" } }),
    [],
  );
}

export function getSolutionFormData(id?: string) {
  return safe(
    async () => {
      const [industries, solution] = await Promise.all([
        prisma.industry.findMany({ orderBy: { name: "asc" } }),
        id ? prisma.solution.findUnique({ where: { id } }) : Promise.resolve(null),
      ]);
      return { industries, solution };
    },
    { industries: [], solution: null },
  );
}

export function getChangelogForm(id?: string) {
  return safe(
    async () => {
      const [products, entry] = await Promise.all([
        prisma.product.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
        id ? prisma.changelogEntry.findUnique({ where: { id } }) : Promise.resolve(null),
      ]);
      return { products, entry };
    },
    { products: [], entry: null },
  );
}

export function getAdminChangelog() {
  return safe(
    () =>
      prisma.changelogEntry.findMany({
        include: { product: { select: { name: true, slug: true } } },
        orderBy: { releasedAt: "desc" },
      }),
    [],
  );
}

export function getAdminTaxonomy() {
  return safe(
    async () => {
      const [categories, industries] = await Promise.all([
        prisma.category.findMany({ include: { _count: { select: { products: true } } }, orderBy: { name: "asc" } }),
        prisma.industry.findMany({ orderBy: { name: "asc" } }),
      ]);
      return { categories, industries };
    },
    { categories: [], industries: [] },
  );
}

export function getAdminJobs() {
  return safe(
    () => prisma.jobPosting.findMany({ include: { _count: { select: { applications: true } } }, orderBy: { createdAt: "desc" } }),
    [],
  );
}

export function getAdminJob(id: string) {
  return safe(() => prisma.jobPosting.findUnique({ where: { id } }), null);
}

export function getAdminSettings() {
  return safe(() => prisma.siteSetting.findMany({ orderBy: { key: "asc" } }), []);
}

export function getAuditLogs(take = 100) {
  return safe(
    () =>
      prisma.auditLog.findMany({
        include: { actor: { select: { name: true, email: true } } },
        orderBy: { createdAt: "desc" },
        take,
      }),
    [],
  );
}
