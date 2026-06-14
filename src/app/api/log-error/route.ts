import { NextRequest, NextResponse } from "next/server";
import { reportError } from "@/lib/observability";
import { rateLimit, clientIp } from "@/lib/rate-limit";

/** Receives client-side error reports from React error boundaries. */
export async function POST(req: NextRequest) {
  const ip = clientIp(req.headers);
  if (!rateLimit(`logerr:${ip}`, 20, 60_000).ok) {
    return NextResponse.json({ ok: false }, { status: 429 });
  }

  let body: any = {};
  try {
    body = await req.json();
  } catch {
    /* ignore */
  }

  await reportError(body?.message ?? "Client error", {
    source: "client",
    path: typeof body?.path === "string" ? body.path.slice(0, 512) : undefined,
    digest: typeof body?.digest === "string" ? body.digest.slice(0, 120) : undefined,
    userAgent: req.headers.get("user-agent"),
    stack: typeof body?.stack === "string" ? body.stack.slice(0, 4000) : undefined,
  });

  return NextResponse.json({ ok: true });
}
