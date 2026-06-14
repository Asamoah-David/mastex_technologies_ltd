import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getAllProducts, getPublishedPosts, getDocTree } from "@/lib/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;
  const staticPaths = [
    "",
    "/about",
    "/products",
    "/solutions",
    "/docs",
    "/blog",
    "/careers",
    "/contact",
  ];

  const [products, posts, docTree] = await Promise.all([
    getAllProducts(),
    getPublishedPosts(),
    getDocTree(),
  ]);

  const now = new Date();

  const entries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  for (const p of products) {
    entries.push({ url: `${base}/products/${p.slug}`, lastModified: now, priority: 0.8 });
  }
  for (const post of posts) {
    entries.push({ url: `${base}/blog/${post.slug}`, lastModified: now, priority: 0.6 });
  }
  for (const cat of docTree) {
    for (const a of cat.articles ?? []) {
      entries.push({ url: `${base}/docs/${a.slug}`, lastModified: now, priority: 0.5 });
    }
  }

  return entries;
}
