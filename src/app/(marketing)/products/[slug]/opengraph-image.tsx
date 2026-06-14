import { ImageResponse } from "next/og";
import { OgCard, OG_SIZE } from "@/lib/og";
import { getProductBySlug } from "@/lib/queries";

export const alt = "Mastex product";
export const size = OG_SIZE;
export const contentType = "image/png";
export const dynamic = "force-dynamic";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return new ImageResponse(
    (
      <OgCard
        eyebrow="Product"
        title={product?.name ?? "Mastex Product"}
        subtitle={product?.tagline ?? product?.description}
      />
    ),
    { ...size },
  );
}
