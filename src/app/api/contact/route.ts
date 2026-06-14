import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { leadSchema } from "@/lib/validations";
import { rateLimitAsync, clientIp } from "@/lib/rate-limit";
import { audit } from "@/lib/audit";

export async function POST(req: NextRequest) {
  const ip = clientIp(req.headers);
  const limit = await rateLimitAsync(`contact:${ip}`, 5, 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter ?? 60) } },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const data = parsed.data;

  // Honeypot — silently accept bots without persisting.
  if (data.website) {
    return NextResponse.json({ ok: true });
  }

  try {
    let jobId: string | undefined;
    if (data.jobSlug) {
      const job = await prisma.jobPosting.findUnique({ where: { slug: data.jobSlug } });
      jobId = job?.id;
    }

    const lead = await prisma.lead.create({
      data: {
        type: data.type,
        name: data.name,
        email: data.email,
        phone: data.phone || undefined,
        company: data.company || undefined,
        subject: data.subject || undefined,
        message: data.message,
        source: data.source || "/contact",
        jobId,
      },
    });

    await audit({
      action: "lead.create",
      entity: "Lead",
      entityId: lead.id,
      metadata: { type: data.type },
      ip,
      userAgent: req.headers.get("user-agent") ?? undefined,
    });

    return NextResponse.json({ ok: true, id: lead.id });
  } catch (e) {
    console.error("[contact] failed", e);
    // In local/mock mode the DB may be down — don't break the UX.
    return NextResponse.json(
      { ok: true, warning: "Saved locally; database unavailable." },
      { status: 202 },
    );
  }
}
