"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MarkdownEditor } from "@/components/admin/markdown-editor";
import { slugify } from "@/lib/utils";
import { createArticle, updateArticle } from "@/app/admin/(panel)/docs/actions";
import type { DocArticleInput } from "@/lib/validations";

const STATUSES = ["DRAFT", "PUBLISHED", "ARCHIVED"];

export function DocForm({
  article,
  categories,
  allArticles,
}: {
  article?: any;
  categories: { id: string; name: string }[];
  allArticles: { id: string; title: string }[];
}) {
  const router = useRouter();
  const isEdit = !!article;

  const [title, setTitle] = React.useState(article?.title ?? "");
  const [slug, setSlug] = React.useState(article?.slug ?? "");
  const [slugTouched, setSlugTouched] = React.useState(isEdit);
  const [content, setContent] = React.useState(article?.content ?? "");
  const [categoryId, setCategoryId] = React.useState(article?.categoryId ?? categories[0]?.id ?? "");
  const [status, setStatus] = React.useState(article?.status ?? "PUBLISHED");
  const [version, setVersion] = React.useState(article?.version ?? "1.0");
  const [order, setOrder] = React.useState(String(article?.order ?? 0));
  const [parentId, setParentId] = React.useState(article?.parentId ?? "");

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

    const payload: DocArticleInput = {
      title,
      slug,
      content,
      categoryId,
      status: status as any,
      version,
      order: Number(order) || 0,
      parentId,
    };

    const res = isEdit ? await updateArticle(article.id, payload) : await createArticle(payload);
    if (res.ok) {
      router.push("/admin/docs");
      router.refresh();
    } else {
      setError(res.error);
      if (res.issues) setIssues(res.issues);
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[1fr_280px]">
      <div className="space-y-6">
        <Card>
          <CardContent className="space-y-4 pt-6">
            <Field label="Title" error={issues.title}>
              <Input value={title} onChange={(e) => onTitle(e.target.value)} required />
            </Field>
            <Field label="Slug" error={issues.slug}>
              <Input
                value={slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setSlug(e.target.value);
                }}
                required
              />
            </Field>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Content</CardTitle>
          </CardHeader>
          <CardContent>
            <MarkdownEditor value={content} onChange={setContent} rows={20} />
            {issues.content && <p className="mt-1 text-xs text-destructive">{issues.content[0]}</p>}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field label="Category" error={issues.categoryId}>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
              >
                <option value="">— Pick —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Parent article (nesting)">
              <select
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
              >
                <option value="">— None —</option>
                {allArticles
                  .filter((a) => a.id !== article?.id)
                  .map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.title}
                    </option>
                  ))}
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Version">
                <Input value={version} onChange={(e) => setVersion(e.target.value)} />
              </Field>
              <Field label="Order">
                <Input type="number" value={order} onChange={(e) => setOrder(e.target.value)} />
              </Field>
            </div>
            <Field label="Status">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>
            <Button type="submit" className="w-full" disabled={pending}>
              {pending && <Loader2 className="size-4 animate-spin" />}
              {isEdit ? "Save changes" : "Create article"}
            </Button>
            {error && <p className="text-xs text-destructive">{error}</p>}
          </CardContent>
        </Card>
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string[];
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error[0]}</p>}
    </div>
  );
}
