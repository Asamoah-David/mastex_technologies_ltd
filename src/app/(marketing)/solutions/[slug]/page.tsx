import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Section } from "@/components/site/section";
import { Reveal } from "@/components/motion";
import { Icon } from "@/components/icon";
import { Markdown } from "@/components/markdown";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { ProductCard } from "@/components/site/product-card";
import { JsonLd } from "@/components/json-ld";
import { getSolutionBySlug, getSolutions, getAllProducts } from "@/lib/queries";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { industryImage } from "@/lib/images";

export const revalidate = 600;

export async function generateStaticParams() {
  const solutions = await getSolutions();
  return solutions.map((s: any) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const solution = await getSolutionBySlug(slug);
  if (!solution) return buildMetadata({ title: "Solution not found", noIndex: true });
  return buildMetadata({
    title: solution.title,
    description: solution.summary,
    path: `/solutions/${solution.slug}`,
  });
}

export default async function SolutionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [solution, allProducts] = await Promise.all([getSolutionBySlug(slug), getAllProducts()]);
  if (!solution) notFound();

  const industrySlug = solution.industry?.slug;
  const relatedProducts = allProducts
    .filter((p: any) => (p.industries ?? []).some((i: any) => i.slug === industrySlug))
    .slice(0, 3);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Solutions", path: "/solutions" },
          { name: solution.title, path: `/solutions/${solution.slug}` },
        ])}
      />

      <div className="container-page pt-6">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Solutions", href: "/solutions" },
            { name: solution.title },
          ]}
        />
      </div>

      {/* Hero */}
      <section className="relative mt-6 overflow-hidden border-y bg-[#070b16] text-white">
        <Image
          src={solution.coverUrl || industryImage(industrySlug)}
          alt={solution.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[#060a14]/78" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-r from-[#060a14] via-[#060a14]/70 to-[#1d4ed8]/30" aria-hidden />
        <div className="container-page relative py-20 sm:py-28">
          <Reveal className="max-w-3xl">
            {solution.industry && (
              <Badge variant="outline" className="mb-4 border-white/25 text-white/80">
                {solution.industry.name}
              </Badge>
            )}
            <div className="flex items-center gap-3">
              <span className="inline-flex size-12 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur">
                <Icon name={solution.icon} className="size-6" />
              </span>
              <h1 className="text-4xl font-bold tracking-tight text-balance text-white sm:text-5xl">
                {solution.title}
              </h1>
            </div>
            <p className="mt-5 max-w-2xl text-lg text-white/75">{solution.summary}</p>
            <Button asChild size="lg" className="mt-8">
              <Link href="/contact">
                Talk to our team <ArrowRight className="size-4" />
              </Link>
            </Button>
          </Reveal>
        </div>
      </section>

      {/* Body */}
      {solution.body && (
        <Section>
          <div className="mx-auto max-w-3xl">
            <Markdown content={solution.body} />
          </div>
        </Section>
      )}

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <Section className="bg-muted/30">
          <h2 className="text-2xl font-bold tracking-tight">Products that power this solution</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedProducts.map((p: any) => (
              <ProductCard key={p.id ?? p.slug} product={p} />
            ))}
          </div>
        </Section>
      )}

      {/* CTA */}
      <Section>
        <div className="flex flex-col items-center gap-4 rounded-3xl border bg-card p-12 text-center">
          <h2 className="text-2xl font-bold tracking-tight">Let&apos;s tailor this to your organisation</h2>
          <p className="max-w-md text-muted-foreground">
            Tell us about your goals and we&apos;ll map the right Mastex products to them.
          </p>
          <Button asChild>
            <Link href="/contact">
              Get in touch <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </Section>
    </>
  );
}
