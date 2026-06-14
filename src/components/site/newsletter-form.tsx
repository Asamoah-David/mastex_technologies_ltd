"use client";

import * as React from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function NewsletterForm() {
  const [status, setStatus] = React.useState<"idle" | "loading" | "done" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "");
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "CONTACT",
          name: "Newsletter subscriber",
          email,
          subject: "Newsletter signup",
          message: "Requested to subscribe to the Mastex newsletter.",
          source: "/newsletter",
        }),
      });
      setStatus(res.ok || res.status === 202 ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <p className="inline-flex items-center gap-2 text-sm text-primary">
        <CheckCircle2 className="size-4" /> You&apos;re subscribed — thank you!
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full max-w-sm items-center gap-2">
      <Input
        name="email"
        type="email"
        required
        placeholder="you@company.com"
        aria-label="Email address"
      />
      <Button type="submit" disabled={status === "loading"}>
        {status === "loading" ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
        <span className="hidden sm:inline">Subscribe</span>
      </Button>
    </form>
  );
}
