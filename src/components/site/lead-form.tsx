"use client";

import * as React from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type LeadType = "CONTACT" | "SALES" | "PARTNERSHIP" | "JOB_APPLICATION" | "DEMO_REQUEST";

export function LeadForm({
  type = "CONTACT",
  source,
  jobSlug,
  compact,
}: {
  type?: LeadType;
  source?: string;
  jobSlug?: string;
  compact?: boolean;
}) {
  const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = React.useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError(null);

    const form = new FormData(e.currentTarget);
    const payload = {
      type,
      source,
      jobSlug,
      name: form.get("name"),
      email: form.get("email"),
      phone: form.get("phone"),
      company: form.get("company"),
      subject: form.get("subject"),
      message: form.get("message"),
      website: form.get("website"), // honeypot
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok && res.status !== 202) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Something went wrong.");
      }
      setStatus("success");
    } catch (err: any) {
      setStatus("error");
      setError(err.message ?? "Something went wrong.");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border bg-card p-10 text-center">
        <CheckCircle2 className="size-12 text-primary" />
        <h3 className="text-lg font-semibold">Thank you — message received.</h3>
        <p className="text-sm text-muted-foreground">
          Our team will get back to you within one business day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Honeypot field — hidden from users */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden
      />

      <div className={compact ? "space-y-4" : "grid gap-4 sm:grid-cols-2"}>
        <Field label="Full name" name="name" required placeholder="Ama Mensah" />
        <Field label="Email" name="email" type="email" required placeholder="you@company.com" />
      </div>
      <div className={compact ? "space-y-4" : "grid gap-4 sm:grid-cols-2"}>
        <Field label="Phone" name="phone" placeholder="+233 …" />
        <Field label="Company" name="company" placeholder="Your organisation" />
      </div>
      {type !== "JOB_APPLICATION" && (
        <Field label="Subject" name="subject" placeholder="How can we help?" />
      )}
      <div className="space-y-1.5">
        <Label htmlFor="message">
          {type === "JOB_APPLICATION" ? "Cover note" : "Message"}
        </Label>
        <Textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="Tell us a little about what you need…"
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" size="lg" disabled={status === "loading"} className="w-full sm:w-auto">
        {status === "loading" && <Loader2 className="size-4 animate-spin" />}
        {type === "JOB_APPLICATION" ? "Submit application" : "Send message"}
      </Button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={name}>
        {label}
        {required && <span className="text-destructive"> *</span>}
      </Label>
      <Input id={name} name={name} type={type} required={required} placeholder={placeholder} />
    </div>
  );
}
