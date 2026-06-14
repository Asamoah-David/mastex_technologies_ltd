/**
 * Lightweight, provider-agnostic error reporting.
 *
 * - Always logs to the server console.
 * - If ERROR_WEBHOOK_URL is set, POSTs a structured payload to it. Point this at
 *   a Slack/Discord incoming webhook, your own collector, or a Sentry-compatible
 *   endpoint. Swapping in the Sentry SDK later only means replacing this file.
 *
 * Never throws — observability must not break the request.
 */
export interface ErrorContext {
  source?: string;
  path?: string;
  userAgent?: string | null;
  digest?: string;
  [key: string]: unknown;
}

export async function reportError(error: unknown, context: ErrorContext = {}) {
  const err =
    error instanceof Error
      ? { name: error.name, message: error.message, stack: error.stack }
      : { message: String(error) };

  // Structured console log (picked up by Railway / any log drain).
  console.error("[error]", JSON.stringify({ ...err, ...context }));

  const webhook = process.env.ERROR_WEBHOOK_URL;
  if (!webhook) return;

  try {
    await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service: "mastex-platform",
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString(),
        error: err,
        context,
      }),
      cache: "no-store",
    });
  } catch {
    /* swallow — reporting must never throw */
  }
}
