"use client";

import { useEffect } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MarketingError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
    fetch("/api/log-error", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: error.message,
        digest: error.digest,
        stack: error.stack,
        path: typeof window !== "undefined" ? window.location.pathname : undefined,
      }),
      keepalive: true,
    }).catch(() => {});
  }, [error]);

  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center gap-5 text-center">
      <p className="text-sm font-semibold uppercase tracking-wider text-primary">
        Something went wrong
      </p>
      <h1 className="text-3xl font-bold tracking-tight">We hit an unexpected error</h1>
      <p className="max-w-md text-muted-foreground">
        Our team has been notified. Please try again — if it persists, contact us.
      </p>
      <Button onClick={reset}>
        <RotateCcw className="size-4" /> Try again
      </Button>
    </div>
  );
}
