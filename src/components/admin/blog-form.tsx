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
import { createPost, updatePost } from "@/app/admin/(panel)/blog/actions";
import type { BlogPostInput } from "@/lib/validations";

const STATUSES = ["DRAFT", "SCHEDULED", "PUBLISHED", "ARCHIVED"];

export function BlogForm({
  post,
  categories,
}: {
  post?: any;
  categories: { id: string; name: string }[];
}) {
  const router = useRouter();
  const isEdit = !!post;

  const [title, setTitle] = React.useState(post?.title ?? "");
  const [slug, setSlug] = React.useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = React.useState(isEdit);
  const [excerpt, setExcerpt] = React.useState(post?.excerpt ?? "");
  const [content, setContent] = React.useState(post?.content ?? "");
  const [coverUrl, setCoverUrl] = React.useState(post?.coverUrl ?? "");
  const [status, setStatus] = React.useState(post?.status ?? "DRAFT");
  const [publishedAt, setPublishedAt] = React.useState(
    post?.publishedAt ? new Date(post.publishedAt).toISOString().slice(0, 16) : "",
  );
  const [categoryId, setCategoryId] = React.useState(post?.categoryId ?? "");
  const [tags, setTags] = React.useState(
    (post?.tags ?? []).map((t: any) => t.tag?.name ?? t.name).join(", "),
  );
  const [seoTitle, setSeoTitle] = React.useState(post?.seoTitle ?? "");
  const [seoDescription, setSeoDescription] = React.useState(post?.seoDescription ?? "");

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

    const payload: BlogPostInput = {
      title,
      slug,
      excerpt,
      content,
      coverUrl,
      status: status as any,
      publishedAt,
      categoryId,
      tags: tags.split(",").map((t: string) => t.trim()).filter(Boolean),
      readingMinutes: Math.max(1, Math.round(content.trim().split(/\s+/).length / 200)),
      seoTitle,
      seoDescription,
    };

    const res = isEdit ? await updatePost(post.id, payload) : await createPost(payload);
    if (res.ok) {
      router.push("/admin/blog");
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
              <Input
                value={slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setSlug(e.target.value);
                }}
                required
              />
            </Field>
            <Field label="Excerpt">
              <Textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} />
            </Field>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content</CardTitle>
          </CardHeader>
          <CardContent>
            <MarkdownEditor value={content} onChange={setContent} />
            {issues.content && <p className="mt-1 text-xs text-destructive">{issues.content[0]}</p>}
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Publish</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
            {(status === "SCHEDULED" || status === "PUBLISHED") && (
              <Field label="Publish date">
                <Input type="datetime-local" value={publishedAt} onChange={(e) => setPublishedAt(e.target.value)} />
              </Field>
            )}
            <Button type="submit" className="w-full" disabled={pending}>
              {pending && <Loader2 className="size-4 animate-spin" />}
              {isEdit ? "Save changes" : "Create post"}
            </Button>
            {error && <p className="text-xs text-destructive">{error}</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Organise</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field label="Category">
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
              >
                <option value="">— None —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Tags (comma-separated)">
              <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="ai, scale" />
            </Field>
            <Field label="Cover image">
              <ImageUploadField value={coverUrl} onChange={setCoverUrl} />
            </Field>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>SEO</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field label="SEO title">
              <Input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} />
            </Field>
            <Field label="SEO description">
              <Textarea value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} rows={3} />
            </Field>
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
