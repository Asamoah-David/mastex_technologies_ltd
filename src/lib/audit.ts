import { prisma } from "@/lib/prisma";

interface AuditInput {
  actorId?: string | null;
  action: string;
  entity?: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
  ip?: string;
  userAgent?: string;
}

/** Record an audit-log entry. Never throws — auditing must not break a request. */
export async function audit(input: AuditInput) {
  try {
    await prisma.auditLog.create({
      data: {
        actorId: input.actorId ?? undefined,
        action: input.action,
        entity: input.entity,
        entityId: input.entityId,
        metadata: input.metadata as any,
        ip: input.ip,
        userAgent: input.userAgent,
      },
    });
  } catch (e) {
    console.error("[audit] failed", e);
  }
}
