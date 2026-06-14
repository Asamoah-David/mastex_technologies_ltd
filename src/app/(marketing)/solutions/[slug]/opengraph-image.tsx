import { ImageResponse } from "next/og";
import { OgCard, OG_SIZE } from "@/lib/og";
import { getSolutionBySlug } from "@/lib/queries";

export const alt = "Mastex solution";
export const size = OG_SIZE;
export const contentType = "image/png";
export const dynamic = "force-dynamic";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const solution = await getSolutionBySlug(slug);
  return new ImageResponse(
    (
      <OgCard
        eyebrow={solution?.industry?.name ?? "Solution"}
        title={solution?.title ?? "Mastex Solution"}
        subtitle={solution?.summary}
      />
    ),
    { ...size },
  );
}
