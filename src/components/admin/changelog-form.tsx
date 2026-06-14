"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { MarkdownEditor } from "@/components/admin/markdown-editor";
import { createChangelog, updateChangelog } from "@/app/admin/(panel)/changelog/actions";
import type { ChangelogInput } from "@/lib/validations";

const STATUSES = ["DRAFT", "PUBLISHED", "ARCHIVED"];

export function ChangelogForm({
  entry,
  products,
}: {
  entry?: any;
  products: { id: string; name: string }[];
}) {
  const router = useRouter();
  const isEdit = !!entry;

  const [productId, setProductId] = React.useState(entry?.productId ?? products[0]?.id ?? "");
  const [version, setVersion] = React.useState(entry?.version ?? "");
  const [title, setTitle] = React.useState(entry?.title ?? "");
  const [body, setBody] = React.useState(entry?.body ?? "");
  const [status, setStatus] = React.useState(entry?.status ?? "PUBLISHED");
  const [releasedAt, setReleasedAt] = React.useState(
    entry?.releasedAt ? new Date(entry.releasedAt).toISOString().slice(0, 10) : "",
  );

  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [issues, setIssues] = React.useState<Record<string, string[]>>({});

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    setIssues({});
    const payload: ChangelogInput = { productId, version, title, body, status: status as any, releasedAt };
    const res = isEdit ? await updateChangelog(entry.id, payload) : await createChangelog(payload);
    if (res.ok) {
      router.push("/admin/changelog");
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
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Product" error={issues.productId}>
              <select value={productId} onChange={(e) => setProductId(e.target.value)} className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm">
                {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </Field>
            <Field label="Version" error={issues.version}>
              <Input value={version} onChange={(e) => setVersion(e.target.value)} placeholder="2.4" required />
            </Field>
            <Field label="Released">
              <Input type="date" value={releasedAt} onChange={(e) => setReleasedAt(e.target.value)} />
            </Field>
          </div>
          <Field label="Title" error={issues.title}>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </Field>
          <div className="space-y-1.5">
            <Label>Release notes</Label>
            <MarkdownEditor value={body} onChange={setBody} rows={8} />
            {issues.body && <p className="text-xs text-destructive">{issues.body[0]}</p>}
          </div>
          <Field label="Status">
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-10 w-44 rounded-lg border border-input bg-background px-3 text-sm">
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex gap-3">
            <Button type="submit" disabled={pending}>
              {pending && <Loader2 className="size-4 animate-spin" />}
              {isEdit ? "Save changes" : "Create entry"}
            </Button>
            <Button type="button" variant="ghost" onClick={() => router.push("/admin/changelog")}>Cancel</Button>
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
