import { siteConfig } from "@/config/site";

/** Shared branded OG card used by per-page opengraph-image routes. */
export function OgCard({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 80,
        background:
          "radial-gradient(1000px 500px at 20% 0%, #14306b 0%, transparent 60%), radial-gradient(900px 500px at 100% 100%, #1d4ed8 0%, transparent 55%), #070b16",
        color: "white",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 14,
            background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 34,
            fontWeight: 800,
          }}
        >
          M
        </div>
        <span style={{ fontSize: 26, fontWeight: 700 }}>Mastex Technologies</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {eyebrow && (
          <div style={{ fontSize: 24, fontWeight: 600, color: "#5b9bff", letterSpacing: 1 }}>
            {eyebrow.toUpperCase()}
          </div>
        )}
        <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.05, maxWidth: 1000 }}>
          {title}
        </div>
        {subtitle && (
          <div style={{ fontSize: 28, color: "#aebfe0", maxWidth: 920 }}>{subtitle}</div>
        )}
      </div>

      <div style={{ fontSize: 22, color: "#8aa0cc" }}>{siteConfig.domain}</div>
    </div>
  );
}

export const OG_SIZE = { width: 1200, height: 630 };
