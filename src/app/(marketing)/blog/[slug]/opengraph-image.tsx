import { ImageResponse } from "next/og";
import { OgCard, OG_SIZE } from "@/lib/og";
import { getPostBySlug } from "@/lib/queries";

export const alt = "Mastex blog post";
export const size = OG_SIZE;
export const contentType = "image/png";
export const dynamic = "force-dynamic";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  return new ImageResponse(
    (
      <OgCard
        eyebrow={post?.category?.name ?? "Blog"}
        title={post?.title ?? "Mastex Blog"}
        subtitle={post?.excerpt ?? undefined}
      />
    ),
    { ...size },
  );
}
