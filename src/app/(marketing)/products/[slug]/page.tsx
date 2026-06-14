import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check, ExternalLink, FileText, Github } from "lucide-react";
import { productImage } from "@/lib/images";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Section } from "@/components/site/section";
import { Reveal } from "@/components/motion";
import { Icon } from "@/components/icon";
import { getAllProducts, getProductBySlug } from "@/lib/queries";
import { buildMetadata, productJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { ProductGallery } from "@/components/site/product-gallery";
import { ProductCard } from "@/components/site/product-card";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { formatCurrency } from "@/lib/utils";

export const revalidate = 600;

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return buildMetadata({ title: "Product not found", noIndex: true });
  return buildMetadata({
    title: product.seoTitle ?? product.name,
    description: product.seoDescription ?? product.description,
    path: `/products/${product.slug}`,
  });
}

const STATUS: Record<string, { label: string; variant: any }> = {
  LIVE: { label: "Live", variant: "success" },
  BETA: { label: "Beta", variant: "warning" },
  IN_DEVELOPMENT: { label: "In development", variant: "muted" },
  CONCEPT: { label: "Concept", variant: "muted" },
  DEPRECATED: { label: "Deprecated", variant: "secondary" },
};

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [product, allProducts] = await Promise.all([getProductBySlug(slug), getAllProducts()]);
  if (!product) notFound();

  const related = allProducts.filter((p: any) => p.slug !== product.slug).slice(0, 3);
  const status = STATUS[product.status] ?? STATUS.IN_DEVELOPMENT;
  const features = (product.features ?? []).filter((f: any) => !f.isBenefit);
  const benefits = (product.features ?? []).filter((f: any) => f.isBenefit);
  const pricing: any[] = Array.isArray(product.pricing) ? product.pricing : [];

  return (
    <>
      <JsonLd
        data={[
          productJsonLd(product),
          breadcrumbJsonLd([
            { name: "Products", path: "/products" },
            { name: product.name, path: `/products/${product.slug}` },
          ]),
        ]}
      />
      <div className="container-page pt-6">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Products", href: "/products" },
            { name: product.name },
          ]}
        />
      </div>
      {/* Hero */}
      <section className="relative mt-6 overflow-hidden border-y bg-[#070b16] text-white">
        <Image
          src={product.coverUrl || productImage(product.slug)}
          alt={product.name}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[#060a14]/78" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-r from-[#060a14] via-[#060a14]/70 to-[#1d4ed8]/30" aria-hidden />
        <div className="container-page relative py-20 sm:py-28">
          <Reveal className="max-w-3xl">
            <div className="mb-4 flex items-center gap-3">
              <Badge variant={status.variant}>{status.label}</Badge>
              {product.category && (
                <span className="text-sm text-white/70">{product.category.name}</span>
              )}
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-balance text-white sm:text-5xl">
              {product.name}
            </h1>
            {product.tagline && (
              <p className="mt-3 text-xl font-medium text-blue-300">{product.tagline}</p>
            )}
            <p className="mt-5 max-w-2xl text-lg text-white/75">
              {product.longDescription ?? product.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/contact">Request a demo</Link>
              </Button>
              {product.demoUrl && (
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/30 bg-white/5 text-white backdrop-blur hover:bg-white/10 hover:text-white"
                >
                  <a href={product.demoUrl} target="_blank" rel="noopener noreferrer">
                    Live demo <ExternalLink className="size-4" />
                  </a>
                </Button>
              )}
              {product.docsUrl && (
                <Button
                  asChild
                  size="lg"
                  variant="ghost"
                  className="text-white hover:bg-white/10 hover:text-white"
                >
                  <a href={product.docsUrl} target="_blank" rel="noopener noreferrer">
                    <FileText className="size-4" /> Docs
                  </a>
                </Button>
              )}
            </div>
            {product.industries?.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2">
                {product.industries.map((i: any) => (
                  <Badge key={i.slug} variant="outline" className="border-white/25 text-white/80">
                    {i.name}
                  </Badge>
                ))}
              </div>
            )}
          </Reveal>
        </div>
      </section>

      {/* Screenshots / media gallery */}
      {product.media?.length > 0 && (
        <Section>
          <h2 className="text-2xl font-bold tracking-tight">Screenshots</h2>
          <div className="mt-8">
            <ProductGallery items={product.media} productName={product.name} />
          </div>
        </Section>
      )}

      {/* Features */}
      {features.length > 0 && (
        <Section>
          <h2 className="text-2xl font-bold tracking-tight">Features</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f: any) => (
              <div key={f.id ?? f.title} className="rounded-2xl border bg-card p-6">
                <span className="inline-flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon name={f.icon} className="size-5" />
                </span>
                <h3 className="mt-4 font-semibold">{f.title}</h3>
                {f.description && (
                  <p className="mt-1 text-sm text-muted-foreground">{f.description}</p>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Benefits */}
      {benefits.length > 0 && (
        <Section className="bg-muted/30">
          <h2 className="text-2xl font-bold tracking-tight">Benefits</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {benefits.map((b: any) => (
              <div key={b.id ?? b.title} className="flex gap-4 rounded-xl border bg-card p-5">
                <Check className="mt-0.5 size-5 shrink-0 text-primary" />
                <div>
                  <h3 className="font-medium">{b.title}</h3>
                  {b.description && (
                    <p className="text-sm text-muted-foreground">{b.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Pricing */}
      {pricing.length > 0 && (
        <Section>
          <h2 className="text-2xl font-bold tracking-tight">Pricing</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {pricing.map((tier, i) => (
              <div
                key={tier.tier}
                className={`flex flex-col rounded-2xl border p-6 ${
                  i === 1 ? "border-primary bg-primary/5 shadow-lg shadow-primary/5" : "bg-card"
                }`}
              >
                <h3 className="font-semibold">{tier.tier}</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-3xl font-bold">
                    {typeof tier.price === "number" ? formatCurrency(tier.price) : tier.price}
                  </span>
                  {tier.period && (
                    <span className="text-sm text-muted-foreground">/{tier.period}</span>
                  )}
                </div>
                <ul className="mt-6 space-y-2.5">
                  {(tier.features ?? []).map((f: string) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check className="size-4 text-primary" /> {f}
                    </li>
                  ))}
                </ul>
                <Button asChild className="mt-6" variant={i === 1 ? "default" : "outline"}>
                  <Link href="/contact">Get started</Link>
                </Button>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Changelog */}
      {product.changelog?.length > 0 && (
        <Section className="bg-muted/30">
          <h2 className="text-2xl font-bold tracking-tight">Changelog</h2>
          <div className="mt-8 space-y-6">
            {product.changelog.map((c: any) => (
              <div key={c.id} className="rounded-xl border bg-card p-6">
                <div className="flex items-center gap-3">
                  <Badge variant="outline">v{c.version}</Badge>
                  <span className="font-medium">{c.title}</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{c.body}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Related products */}
      {related.length > 0 && (
        <Section>
          <h2 className="text-2xl font-bold tracking-tight">More from Mastex</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p: any) => (
              <ProductCard key={p.id ?? p.slug} product={p} />
            ))}
          </div>
        </Section>
      )}

      {/* CTA */}
      <Section>
        <div className="flex flex-col items-center gap-4 rounded-3xl border bg-card p-12 text-center">
          <h2 className="text-2xl font-bold tracking-tight">
            See {product.name} in action
          </h2>
          <p className="max-w-md text-muted-foreground">
            Book a tailored demo with our team and see how it fits your organisation.
          </p>
          <div className="flex gap-3">
            <Button asChild>
              <Link href="/contact">
                Request a demo <ArrowRight className="size-4" />
              </Link>
            </Button>
            {product.repoUrl && (
              <Button asChild variant="outline">
                <a href={product.repoUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="size-4" /> Repository
                </a>
              </Button>
            )}
          </div>
        </div>
      </Section>
    </>
  );
}
