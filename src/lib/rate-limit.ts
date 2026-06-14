/**
 * Lightweight in-memory rate limiter for Route Handlers. For multi-instance
 * production, swap the store for Upstash Redis (env vars already scaffolded).
 */
const buckets = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string, limit = 5, windowMs = 60_000) {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1 };
  }

  if (bucket.count >= limit) {
    return { ok: false, remaining: 0, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) };
  }

  bucket.count += 1;
  return { ok: true, remaining: limit - bucket.count };
}

export function clientIp(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headers.get("x-real-ip") ??
    "unknown"
  );
}

/**
 * Distributed rate limiter. Uses Upstash Redis (REST) when configured so limits
 * hold across multiple instances on Railway; otherwise falls back to the
 * in-memory limiter above. Never throws.
 */
export async function rateLimitAsync(key: string, limit = 5, windowMs = 60_000) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) return rateLimit(key, limit, windowMs);

  try {
    const windowSec = Math.ceil(windowMs / 1000);
    // INCR then set TTL on first hit (pipeline).
    const res = await fetch(`${url}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify([
        ["INCR", `rl:${key}`],
        ["EXPIRE", `rl:${key}`, String(windowSec), "NX"],
      ]),
      cache: "no-store",
    });
    if (!res.ok) return rateLimit(key, limit, windowMs);
    const data = (await res.json()) as { result: any }[];
    const count = Number(data?.[0]?.result ?? 0);
    if (count > limit) return { ok: false, remaining: 0, retryAfter: windowSec };
    return { ok: true, remaining: Math.max(0, limit - count) };
  } catch {
    return rateLimit(key, limit, windowMs);
  }
}
