import { Section, SectionHeader } from "@/components/site/section";
import { ProductCard } from "@/components/site/product-card";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { getAllProducts, getCategories } from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Products",
  description: "Explore the full suite of Mastex software products.",
  path: "/products",
});

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const [products, categories] = await Promise.all([getAllProducts(), getCategories()]);

  const filtered = category
    ? products.filter((p) => p.category?.slug === category)
    : products;

  return (
    <Section>
      <Reveal>
        <SectionHeader
          eyebrow="Products"
          title="Software for every part of your business"
          description="A growing portfolio of enterprise systems, SaaS platforms and digital solutions — all under one brand."
        />
      </Reveal>

      {/* Category filter */}
      <div className="mt-10 flex flex-wrap justify-center gap-2">
        <FilterPill href="/products" active={!category} label="All" />
        {categories.map((c) => (
          <FilterPill
            key={c.id}
            href={`/products?category=${c.slug}`}
            active={category === c.slug}
            label={c.name}
          />
        ))}
      </div>

      <Stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <StaggerItem key={p.id}>
            <ProductCard product={p} />
          </StaggerItem>
        ))}
      </Stagger>

      {filtered.length === 0 && (
        <p className="mt-16 text-center text-muted-foreground">
          No products in this category yet.
        </p>
      )}
    </Section>
  );
}

import Link from "next/link";
import { cn } from "@/lib/utils";

function FilterPill({
  href,
  active,
  label,
}: {
  href: string;
  active: boolean;
  label: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-muted-foreground hover:text-foreground",
      )}
    >
      {label}
    </Link>
  );
}
