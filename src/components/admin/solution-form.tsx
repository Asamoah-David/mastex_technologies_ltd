"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MarkdownEditor } from "@/components/admin/markdown-editor";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { slugify } from "@/lib/utils";
import { createSolution, updateSolution } from "@/app/admin/(panel)/solutions/actions";
import type { SolutionInput } from "@/lib/validations";

const STATUSES = ["DRAFT", "PUBLISHED", "ARCHIVED"];

export function SolutionForm({
  solution,
  industries,
}: {
  solution?: any;
  industries: { id: string; name: string }[];
}) {
  const router = useRouter();
  const isEdit = !!solution;

  const [title, setTitle] = React.useState(solution?.title ?? "");
  const [slug, setSlug] = React.useState(solution?.slug ?? "");
  const [slugTouched, setSlugTouched] = React.useState(isEdit);
  const [summary, setSummary] = React.useState(solution?.summary ?? "");
  const [body, setBody] = React.useState(solution?.body ?? "");
  const [icon, setIcon] = React.useState(solution?.icon ?? "");
  const [coverUrl, setCoverUrl] = React.useState(solution?.coverUrl ?? "");
  const [order, setOrder] = React.useState(String(solution?.order ?? 0));
  const [status, setStatus] = React.useState(solution?.status ?? "PUBLISHED");
  const [industryId, setIndustryId] = React.useState(solution?.industryId ?? "");

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
    const payload: SolutionInput = {
      title, slug, summary, body, icon, coverUrl,
      order: Number(order) || 0,
      status: status as any,
      industryId,
    };
    const res = isEdit ? await updateSolution(solution.id, payload) : await createSolution(payload);
    if (res.ok) {
      router.push("/admin/solutions");
      router.refresh();
    } else {
      setError(res.error);
      if (res.issues) setIssues(res.issues);
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[1fr_300px]">
      <div className="space-y-6">
        <Card>
          <CardContent className="space-y-4 pt-6">
            <Field label="Title" error={issues.title}>
              <Input value={title} onChange={(e) => onTitle(e.target.value)} required />
            </Field>
            <Field label="Slug" error={issues.slug}>
              <Input value={slug} onChange={(e) => { setSlugTouched(true); setSlug(e.target.value); }} required />
            </Field>
            <Field label="Summary" error={issues.summary}>
              <Textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={2} required />
            </Field>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Body</CardTitle></CardHeader>
          <CardContent>
            <MarkdownEditor value={body} onChange={setBody} />
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Settings</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Field label="Industry">
              <select value={industryId} onChange={(e) => setIndustryId(e.target.value)} className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm">
                <option value="">— None —</option>
                {industries.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}
              </select>
            </Field>
            <Field label="Icon (lucide name)">
              <Input value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="ShoppingBag" />
            </Field>
            <Field label="Cover image">
              <ImageUploadField value={coverUrl} onChange={setCoverUrl} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Order"><Input type="number" value={order} onChange={(e) => setOrder(e.target.value)} /></Field>
              <Field label="Status">
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm">
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
            </div>
            <Button type="submit" className="w-full" disabled={pending}>
              {pending && <Loader2 className="size-4 animate-spin" />}
              {isEdit ? "Save changes" : "Create solution"}
            </Button>
            {error && <p className="text-xs text-destructive">{error}</p>}
          </CardContent>
        </Card>
      </div>
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
