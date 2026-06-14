"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { slugify } from "@/lib/utils";
import { createJob, updateJob } from "@/app/admin/(panel)/careers/actions";
import type { JobInput } from "@/lib/validations";

const TYPES = ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP", "REMOTE"];
const STATUSES = ["DRAFT", "PUBLISHED", "ARCHIVED"];

export function JobForm({ job }: { job?: any }) {
  const router = useRouter();
  const isEdit = !!job;

  const [title, setTitle] = React.useState(job?.title ?? "");
  const [slug, setSlug] = React.useState(job?.slug ?? "");
  const [slugTouched, setSlugTouched] = React.useState(isEdit);
  const [department, setDepartment] = React.useState(job?.department ?? "");
  const [location, setLocation] = React.useState(job?.location ?? "");
  const [type, setType] = React.useState(job?.type ?? "FULL_TIME");
  const [description, setDescription] = React.useState(job?.description ?? "");
  const [requirements, setRequirements] = React.useState(job?.requirements ?? "");
  const [status, setStatus] = React.useState(job?.status ?? "PUBLISHED");

  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [issues, setIssues] = React.useState<Record<string, string[]>>({});

  function onTitle(v: string) {
    setTitle(v);
    if (!slugTouched) setSlug(slugify(v));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    setIssues({});
    const payload: JobInput = {
      title, slug, department, location, type: type as any, description, requirements, status: status as any,
    };
    const res = isEdit ? await updateJob(job.id, payload) : await createJob(payload);
    if (res.ok) {
      router.push("/admin/careers");
      router.refresh();
    } else {
      setError(res.error);
      if (res.issues) setIssues(res.issues);
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Title" error={issues.title}>
              <Input value={title} onChange={(e) => onTitle(e.target.value)} required />
            </Field>
            <Field label="Slug" error={issues.slug}>
              <Input value={slug} onChange={(e) => { setSlugTouched(true); setSlug(e.target.value); }} required />
            </Field>
            <Field label="Department" error={issues.department}>
              <Input value={department} onChange={(e) => setDepartment(e.target.value)} required />
            </Field>
            <Field label="Location" error={issues.location}>
              <Input value={location} onChange={(e) => setLocation(e.target.value)} required />
            </Field>
            <Field label="Type">
              <select value={type} onChange={(e) => setType(e.target.value)} className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm">
                {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Status">
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm">
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Description" error={issues.description}>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} required />
          </Field>
          <Field label="Requirements">
            <Textarea value={requirements} onChange={(e) => setRequirements(e.target.value)} rows={3} />
          </Field>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex gap-3">
            <Button type="submit" disabled={pending}>
              {pending && <Loader2 className="size-4 animate-spin" />}
              {isEdit ? "Save changes" : "Create posting"}
            </Button>
            <Button type="button" variant="ghost" onClick={() => router.push("/admin/careers")}>Cancel</Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}

function Field({ label, error, children }: { label: string; error?: string[]; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error[0]}</p>}
    </div>
  );
}
