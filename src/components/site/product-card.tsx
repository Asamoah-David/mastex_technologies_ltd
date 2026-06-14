import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/icon";
import { productImage } from "@/lib/images";

const STATUS_LABEL: Record<string, { label: string; variant: any }> = {
  LIVE: { label: "Live", variant: "success" },
  BETA: { label: "Beta", variant: "warning" },
  IN_DEVELOPMENT: { label: "In development", variant: "muted" },
  CONCEPT: { label: "Concept", variant: "muted" },
  DEPRECATED: { label: "Deprecated", variant: "secondary" },
};

export function ProductCard({ product }: { product: any }) {
  const status = STATUS_LABEL[product.status] ?? STATUS_LABEL.IN_DEVELOPMENT;
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border bg-card transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
    >
      {/* Cover image */}
      <div className="relative h-40 w-full overflow-hidden">
        <Image
          src={product.coverUrl || productImage(product.slug)}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060a14]/70 via-transparent to-transparent" />
        <span className="absolute left-4 top-4 inline-flex size-10 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur">
          <Icon name={product.features?.[0]?.icon ?? "Boxes"} className="size-5" />
        </span>
        <span className="absolute right-4 top-4">
          <Badge variant={status.variant}>{status.label}</Badge>
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-semibold tracking-tight">{product.name}</h3>
        {product.tagline && (
          <p className="mt-1 text-sm font-medium text-primary/80">{product.tagline}</p>
        )}
        <p className="mt-2 flex-1 text-sm text-muted-foreground">{product.description}</p>
        <div className="mt-5 flex items-center justify-between">
          {product.category && (
            <span className="text-xs text-muted-foreground">{product.category.name}</span>
          )}
          <span className="inline-flex items-center gap-1 text-sm font-medium text-foreground opacity-0 transition-opacity group-hover:opacity-100">
            Learn more <ArrowUpRight className="size-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
