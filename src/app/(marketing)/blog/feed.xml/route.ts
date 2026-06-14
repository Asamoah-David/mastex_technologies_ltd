import { getPublishedPosts } from "@/lib/queries";
import { siteConfig } from "@/config/site";

export const dynamic = "force-dynamic";

function escape(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function GET() {
  const posts = await getPublishedPosts();
  const base = siteConfig.url;

  const items = posts
    .map((p: any) => {
      const url = `${base}/blog/${p.slug}`;
      const date = p.publishedAt ? new Date(p.publishedAt).toUTCString() : new Date().toUTCString();
      return `    <item>
      <title>${escape(p.title)}</title>
      <link>${url}</link>
      <guid>${url}</guid>
      <pubDate>${date}</pubDate>
      <description>${escape(p.excerpt ?? "")}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(siteConfig.name)} — Blog</title>
    <link>${base}/blog</link>
    <description>${escape(siteConfig.description)}</description>
    <language>en</language>
    <atom:link href="${base}/blog/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
