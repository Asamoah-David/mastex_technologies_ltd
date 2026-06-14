"use client";

import { useEffect } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminError({
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
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-2xl font-bold tracking-tight">Admin error</h1>
      <p className="max-w-md text-muted-foreground">
        {error.message || "An unexpected error occurred in the dashboard."}
      </p>
      <Button onClick={reset}>
        <RotateCcw className="size-4" /> Retry
      </Button>
    </div>
  );
}
