import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit, clientIp } from "@/lib/rate-limit";

/**
 * Lightweight first-party page-view ingestion. No cookies, no PII — a random
 * session id is generated client-side per browsing session. Honours DNT and
 * never tracks /admin or /api.
 */
export async function POST(req: NextRequest) {
  const ip = clientIp(req.headers);
  const limit = rateLimit(`track:${ip}`, 120, 60_000);
  if (!limit.ok) return NextResponse.json({ ok: false }, { status: 429 });

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const path = typeof body.path === "string" ? body.path.slice(0, 512) : null;
  if (!path || path.startsWith("/admin") || path.startsWith("/api")) {
    return NextResponse.json({ ok: true });
  }

  try {
    await prisma.pageView.create({
      data: {
        path,
        referrer: typeof body.referrer === "string" ? body.referrer.slice(0, 512) : null,
        device: typeof body.device === "string" ? body.device.slice(0, 40) : null,
        country: req.headers.get("x-vercel-ip-country") ?? null,
        sessionId: typeof body.sessionId === "string" ? body.sessionId.slice(0, 64) : null,
      },
    });
  } catch {
    // Analytics must never break the page — swallow (e.g. DB down in dev).
  }

  return NextResponse.json({ ok: true });
}
