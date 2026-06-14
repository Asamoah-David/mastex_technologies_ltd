import "server-only";
import { prisma } from "@/lib/prisma";

export interface AnalyticsData {
  traffic: { date: string; visitors: number; pageViews: number }[];
  topPages: { path: string; views: number }[];
  totalVisitors: number;
  totalPageViews: number;
  live: boolean; // true when derived from real PageView data
}

function dayKey(d: Date) {
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

// Deterministic sample series for empty/local mode.
function sampleTraffic() {
  const base = [120, 145, 138, 160, 175, 168, 190, 210, 198, 230, 245, 260, 248, 290];
  return base.map((v, i) => ({ date: `D${i + 1}`, visitors: v, pageViews: Math.round(v * 2.6) }));
}

export async function getAnalytics(days = 14): Promise<AnalyticsData> {
  const since = new Date();
  since.setDate(since.getDate() - (days - 1));
  since.setHours(0, 0, 0, 0);

  try {
    const views = await prisma.pageView.findMany({
      where: { createdAt: { gte: since } },
      select: { path: true, sessionId: true, createdAt: true },
    });

    if (views.length === 0) {
      const traffic = sampleTraffic();
      return {
        traffic,
        topPages: [
          { path: "/", views: 1240 },
          { path: "/products", views: 860 },
          { path: "/products/mastex-bms", views: 540 },
          { path: "/solutions", views: 410 },
          { path: "/contact", views: 320 },
        ],
        totalVisitors: traffic.reduce((s, d) => s + d.visitors, 0),
        totalPageViews: traffic.reduce((s, d) => s + d.pageViews, 0),
        live: false,
      };
    }

    // Build per-day buckets.
    const buckets = new Map<string, { views: number; sessions: Set<string> }>();
    for (let i = 0; i < days; i++) {
      const d = new Date(since);
      d.setDate(since.getDate() + i);
      buckets.set(dayKey(d), { views: 0, sessions: new Set() });
    }

    const pageCounts = new Map<string, number>();
    const allSessions = new Set<string>();

    for (const v of views) {
      const key = dayKey(new Date(v.createdAt));
      const bucket = buckets.get(key);
      if (bucket) {
        bucket.views += 1;
        if (v.sessionId) bucket.sessions.add(v.sessionId);
      }
      pageCounts.set(v.path, (pageCounts.get(v.path) ?? 0) + 1);
      if (v.sessionId) allSessions.add(v.sessionId);
    }

    const traffic = Array.from(buckets.entries()).map(([date, b]) => ({
      date,
      visitors: b.sessions.size,
      pageViews: b.views,
    }));

    const topPages = Array.from(pageCounts.entries())
      .map(([path, views]) => ({ path, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 6);

    return {
      traffic,
      topPages,
      totalVisitors: allSessions.size,
      totalPageViews: views.length,
      live: true,
    };
  } catch {
    const traffic = sampleTraffic();
    return {
      traffic,
      topPages: [
        { path: "/", views: 1240 },
        { path: "/products", views: 860 },
        { path: "/contact", views: 320 },
      ],
      totalVisitors: traffic.reduce((s, d) => s + d.visitors, 0),
      totalPageViews: traffic.reduce((s, d) => s + d.pageViews, 0),
      live: false,
    };
  }
}
