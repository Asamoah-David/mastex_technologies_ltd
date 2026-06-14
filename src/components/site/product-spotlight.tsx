"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/icon";
import { productImage } from "@/lib/images";
import { cn } from "@/lib/utils";

const STATUS_LABEL: Record<string, { label: string; variant: any }> = {
  LIVE: { label: "Live", variant: "success" },
  BETA: { label: "Beta", variant: "warning" },
  IN_DEVELOPMENT: { label: "In development", variant: "muted" },
  CONCEPT: { label: "Concept", variant: "muted" },
  DEPRECATED: { label: "Deprecated", variant: "secondary" },
};

export function ProductSpotlight({
  products,
  interval = 5000,
}: {
  products: any[];
  interval?: number;
}) {
  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);

  React.useEffect(() => {
    if (paused || products.length < 2) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const t = window.setInterval(() => setIndex((i) => (i + 1) % products.length), interval);
    return () => window.clearInterval(t);
  }, [paused, products.length, interval]);

  if (!products.length) return null;
  const p = products[index];
  const status = STATUS_LABEL[p.status] ?? STATUS_LABEL.IN_DEVELOPMENT;
  const features = (p.features ?? []).filter((f: any) => !f.isBenefit).slice(0, 3);

  return (
    <div
      className="grid items-center gap-8 overflow-hidden rounded-3xl border bg-card lg:grid-cols-2"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Text */}
      <div className="order-2 p-8 sm:p-12 lg:order-1">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Featured product
          </span>
          <Badge variant={status.variant}>{status.label}</Badge>
        </div>
        <h3 className="mt-4 text-3xl font-bold tracking-tight">{p.name}</h3>
        {p.tagline && <p className="mt-2 text-lg font-medium text-primary/80">{p.tagline}</p>}
        <p className="mt-3 text-muted-foreground">{p.description}</p>

        {features.length > 0 && (
          <ul className="mt-6 flex flex-wrap gap-2">
            {features.map((f: any) => (
              <li
                key={f.id ?? f.title}
                className="inline-flex items-center gap-1.5 rounded-full border bg-background px-3 py-1 text-sm"
              >
                <Icon name={f.icon} className="size-3.5 text-primary" /> {f.title}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-8 flex items-center gap-4">
          <Button asChild>
            <Link href={`/products/${p.slug}`}>
              Explore {p.name} <ArrowRight className="size-4" />
            </Link>
          </Button>
          <div className="flex gap-1.5">
            {products.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Show product ${i + 1}`}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === index ? "w-6 bg-primary" : "w-2.5 bg-border hover:bg-muted-foreground/40",
                )}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Image */}
      <div className="relative order-1 h-64 w-full overflow-hidden lg:order-2 lg:h-[26rem]">
        {products.map((prod, i) => (
          <div
            key={prod.slug}
            className={cn(
              "absolute inset-0 transition-opacity duration-700",
              i === index ? "opacity-100" : "opacity-0",
            )}
          >
            <Image
              src={prod.coverUrl || productImage(prod.slug)}
              alt={prod.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#060a14]/40 to-transparent lg:bg-gradient-to-l" />
          </div>
        ))}
      </div>
    </div>
  );
}
