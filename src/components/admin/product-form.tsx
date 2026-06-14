"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Trash2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { slugify } from "@/lib/utils";
import { createProduct, updateProduct } from "@/app/admin/(panel)/products/actions";
import type { ProductInput } from "@/lib/validations";

const STATUSES = ["CONCEPT", "IN_DEVELOPMENT", "BETA", "LIVE", "DEPRECATED"];

type Feature = { title: string; description: string; icon: string; isBenefit: boolean };
type Tier = { tier: string; price: string; period: string; features: string[] };
type MediaItem = { url: string; caption: string };

export function ProductForm({
  product,
  categories,
  industries,
}: {
  product?: any;
  categories: { id: string; name: string }[];
  industries: { id: string; name: string }[];
}) {
  const router = useRouter();
  const isEdit = !!product;

  const [name, setName] = React.useState(product?.name ?? "");
  const [slug, setSlug] = React.useState(product?.slug ?? "");
  const [slugTouched, setSlugTouched] = React.useState(isEdit);
  const [tagline, setTagline] = React.useState(product?.tagline ?? "");
  const [description, setDescription] = React.useState(product?.description ?? "");
  const [longDescription, setLongDescription] = React.useState(product?.longDescription ?? "");
  const [status, setStatus] = React.useState(product?.status ?? "IN_DEVELOPMENT");
  const [featured, setFeatured] = React.useState(product?.featured ?? false);
  const [order, setOrder] = React.useState(String(product?.order ?? 0));
  const [categoryId, setCategoryId] = React.useState(product?.categoryId ?? "");
  const [industryIds, setIndustryIds] = React.useState<string[]>(
    product?.industries?.map((i: any) => i.id) ?? [],
  );
  const [demoUrl, setDemoUrl] = React.useState(product?.demoUrl ?? "");
  const [repoUrl, setRepoUrl] = React.useState(product?.repoUrl ?? "");
  const [docsUrl, setDocsUrl] = React.useState(product?.docsUrl ?? "");
  const [coverUrl, setCoverUrl] = React.useState(product?.coverUrl ?? "");
  const [seoTitle, setSeoTitle] = React.useState(product?.seoTitle ?? "");
  const [seoDescription, setSeoDescription] = React.useState(product?.seoDescription ?? "");

  const [features, setFeatures] = React.useState<Feature[]>(
    (product?.features ?? []).map((f: any) => ({
      title: f.title,
      description: f.description ?? "",
      icon: f.icon ?? "",
      isBenefit: f.isBenefit ?? false,
    })),
  );
  const [pricing, setPricing] = React.useState<Tier[]>(
    (Array.isArray(product?.pricing) ? product.pricing : []).map((t: any) => ({
      tier: t.tier ?? "",
      price: String(t.price ?? ""),
      period: t.period ?? "",
      features: t.features ?? [],
    })),
  );
  const [media, setMedia] = React.useState<MediaItem[]>(
    (product?.media ?? []).map((m: any) => ({ url: m.url, caption: m.caption ?? "" })),
  );

  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [issues, setIssues] = React.useState<Record<string, string[]>>({});

  function onName(v: string) {
    setName(v);
    if (!slugTouched) setSlug(slugify(v));
  }

  function toggleIndustry(id: string) {
    setIndustryIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    setIssues({});

    const payload: ProductInput = {
      name,
      slug,
      tagline,
      description,
      longDescription,
      status: status as any,
      featured,
      order: Number(order) || 0,
      categoryId,
      industryIds,
      demoUrl,
      repoUrl,
      docsUrl,
      coverUrl,
      features: features.map((f) => ({ ...f })),
      pricing: pricing.map((t) => ({
        tier: t.tier,
        price: isNaN(Number(t.price)) ? t.price : Number(t.price),
        period: t.period,
        features: t.features.filter(Boolean),
      })),
      media: media.filter((m) => m.url.trim()).map((m) => ({ url: m.url.trim(), caption: m.caption })),
      seoTitle,
      seoDescription,
    };

    const res = isEdit ? await updateProduct(product.id, payload) : await createProduct(payload);

    if (res.ok) {
      router.push("/admin/products");
      router.refresh();
    } else {
      setError(res.error);
      if (res.issues) setIssues(res.issues);
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basics</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <FormField label="Name" error={issues.name}>
            <Input value={name} onChange={(e) => onName(e.target.value)} required />
          </FormField>
          <FormField label="Slug" error={issues.slug}>
            <Input
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              }}
              required
            />
          </FormField>
          <FormField label="Tagline" className="sm:col-span-2">
            <Input value={tagline} onChange={(e) => setTagline(e.target.value)} />
          </FormField>
          <FormField label="Short description" error={issues.description} className="sm:col-span-2">
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} required />
          </FormField>
          <FormField label="Long description" className="sm:col-span-2">
            <Textarea value={longDescription} onChange={(e) => setLongDescription(e.target.value)} rows={5} />
          </FormField>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Classification</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <FormField label="Status">
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
          </FormField>
          <FormField label="Category">
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
          </FormField>
          <FormField label="Order">
            <Input type="number" value={order} onChange={(e) => setOrder(e.target.value)} />
          </FormField>
          <div className="flex items-center gap-3 pt-7">
            <Switch checked={featured} onCheckedChange={setFeatured} id="featured" />
            <Label htmlFor="featured" className="flex items-center gap-1.5">
              <Star className="size-4" /> Featured on homepage
            </Label>
          </div>
          <FormField label="Industries" className="sm:col-span-2">
            <div className="flex flex-wrap gap-2">
              {industries.map((ind) => {
                const active = industryIds.includes(ind.id);
                return (
                  <button
                    type="button"
                    key={ind.id}
                    onClick={() => toggleIndustry(ind.id)}
                    className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {ind.name}
                  </button>
                );
              })}
            </div>
          </FormField>
        </CardContent>
      </Card>

      {/* Features & benefits */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Features & benefits</CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setFeatures((f) => [...f, { title: "", description: "", icon: "", isBenefit: false }])
            }
          >
            <Plus className="size-4" /> Add
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {features.length === 0 && (
            <p className="text-sm text-muted-foreground">No features yet.</p>
          )}
          {features.map((f, i) => (
            <div key={i} className="grid gap-2 rounded-lg border p-3 sm:grid-cols-[1fr_1.5fr_auto_auto]">
              <Input
                placeholder="Title"
                value={f.title}
                onChange={(e) => updateAt(setFeatures, i, { title: e.target.value })}
              />
              <Input
                placeholder="Description"
                value={f.description}
                onChange={(e) => updateAt(setFeatures, i, { description: e.target.value })}
              />
              <Input
                placeholder="Icon (lucide)"
                value={f.icon}
                onChange={(e) => updateAt(setFeatures, i, { icon: e.target.value })}
                className="w-32"
              />
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Switch
                    checked={f.isBenefit}
                    onCheckedChange={(v) => updateAt(setFeatures, i, { isBenefit: v })}
                  />
                  Benefit
                </label>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setFeatures((arr) => arr.filter((_, j) => j !== i))}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Pricing */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Pricing tiers</CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPricing((p) => [...p, { tier: "", price: "", period: "mo", features: [] }])}
          >
            <Plus className="size-4" /> Add tier
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {pricing.length === 0 && (
            <p className="text-sm text-muted-foreground">No pricing tiers — product shows no pricing section.</p>
          )}
          {pricing.map((t, i) => (
            <div key={i} className="space-y-2 rounded-lg border p-3">
              <div className="grid gap-2 sm:grid-cols-[1fr_1fr_1fr_auto]">
                <Input placeholder="Tier (e.g. Growth)" value={t.tier} onChange={(e) => updateAt(setPricing, i, { tier: e.target.value })} />
                <Input placeholder="Price" value={t.price} onChange={(e) => updateAt(setPricing, i, { price: e.target.value })} />
                <Input placeholder="Period (mo, yr…)" value={t.period} onChange={(e) => updateAt(setPricing, i, { period: e.target.value })} />
                <Button type="button" variant="ghost" size="icon" onClick={() => setPricing((arr) => arr.filter((_, j) => j !== i))}>
                  <Trash2 className="size-4" />
                </Button>
              </div>
              <Textarea
                placeholder="Features, one per line"
                rows={3}
                value={t.features.join("\n")}
                onChange={(e) => updateAt(setPricing, i, { features: e.target.value.split("\n") })}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Screenshots / gallery */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Screenshots & media</CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setMedia((m) => [...m, { url: "", caption: "" }])}
          >
            <Plus className="size-4" /> Add image
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-muted-foreground">
            Paste an image URL, or upload in the{" "}
            <a href="/admin/media" className="text-primary hover:underline">Media library</a>{" "}
            and copy its link here.
          </p>
          {media.length === 0 && (
            <p className="text-sm text-muted-foreground">No screenshots yet.</p>
          )}
          {media.map((m, i) => (
            <div key={i} className="space-y-2 rounded-lg border p-3">
              <div className="flex items-start gap-2">
                <div className="flex-1">
                  <ImageUploadField
                    compact
                    value={m.url}
                    onChange={(url) => updateAt(setMedia, i, { url })}
                    placeholder="Screenshot URL"
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setMedia((arr) => arr.filter((_, j) => j !== i))}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
              <Input
                placeholder="Caption (optional)"
                value={m.caption}
                onChange={(e) => updateAt(setMedia, i, { caption: e.target.value })}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Links & SEO */}
      <Card>
        <CardHeader>
          <CardTitle>Links & SEO</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <FormField label="Live demo / site URL"><Input value={demoUrl} onChange={(e) => setDemoUrl(e.target.value)} placeholder="https://app.yourproduct.com" /></FormField>
          <FormField label="Repository URL"><Input value={repoUrl} onChange={(e) => setRepoUrl(e.target.value)} placeholder="https://" /></FormField>
          <FormField label="Docs URL"><Input value={docsUrl} onChange={(e) => setDocsUrl(e.target.value)} placeholder="https://" /></FormField>
          <FormField label="Cover image" className="sm:col-span-2">
            <ImageUploadField value={coverUrl} onChange={setCoverUrl} />
          </FormField>
          <FormField label="SEO title" className="sm:col-span-2"><Input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} /></FormField>
          <FormField label="SEO description" className="sm:col-span-2"><Textarea value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} rows={2} /></FormField>
        </CardContent>
      </Card>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending && <Loader2 className="size-4 animate-spin" />}
          {isEdit ? "Save changes" : "Create product"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.push("/admin/products")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

function updateAt<T>(
  setter: React.Dispatch<React.SetStateAction<T[]>>,
  index: number,
  patch: Partial<T>,
) {
  setter((arr) => arr.map((item, i) => (i === index ? { ...item, ...patch } : item)));
}

function FormField({
  label,
  error,
  className,
  children,
}: {
  label: string;
  error?: string[];
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`space-y-1.5 ${className ?? ""}`}>
      <Label>{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error[0]}</p>}
    </div>
  );
}
