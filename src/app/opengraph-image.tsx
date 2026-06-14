import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const alt = "Mastex Technologies Ltd";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
// Render on-demand (avoids a @vercel/og build-time prerender issue on paths
// that contain spaces; on the Linux deploy these are generated + cached).
export const dynamic = "force-dynamic";

export default function OgImage() {
  return new ImageResponse(
    (
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
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 40,
              fontWeight: 800,
            }}
          >
            M
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 30, fontWeight: 700 }}>Mastex</span>
            <span style={{ fontSize: 16, letterSpacing: 4, color: "#9db7e8" }}>
              TECHNOLOGIES
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.05, maxWidth: 960 }}>
            {siteConfig.tagline}
          </div>
          <div style={{ fontSize: 28, color: "#aebfe0", maxWidth: 900 }}>
            Enterprise software, SaaS platforms and digital solutions — engineered to scale.
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, color: "#8aa0cc" }}>
          <span>{siteConfig.domain}</span>
          <span>Mastex Technologies Ltd</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
