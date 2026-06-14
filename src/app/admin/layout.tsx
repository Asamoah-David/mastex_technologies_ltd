import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin — Mastex Technologies Ltd",
  robots: { index: false, follow: false },
};

// Passthrough: the gated chrome lives in (panel)/layout.tsx so that
// /admin/login can render without the sidebar or auth gate.
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
