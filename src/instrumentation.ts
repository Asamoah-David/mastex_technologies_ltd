import type { Instrumentation } from "next";

/**
 * Captures uncaught server-side errors (Server Components, Route Handlers,
 * Server Actions) and forwards them to the observability layer.
 */
export const onRequestError: Instrumentation.onRequestError = async (
  error,
  request,
  context,
) => {
  const { reportError } = await import("@/lib/observability");
  await reportError(error, {
    source: "server",
    path: request.path,
    method: request.method,
    routeType: context.routeType,
  });
};
