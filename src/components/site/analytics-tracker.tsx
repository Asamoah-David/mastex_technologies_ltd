"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

/**
 * First-party, privacy-respecting page-view tracker. Sends a beacon on each
 * route change. Honours Do Not Track and a per-session anonymous id.
 */
function sessionId() {
  try {
    const KEY = "mtx_sid";
    let id = sessionStorage.getItem(KEY);
    if (!id) {
      id = Math.random().toString(36).slice(2) + Date.now().toString(36);
      sessionStorage.setItem(KEY, id);
    }
    return id;
  } catch {
    return undefined;
  }
}

function device() {
  if (typeof navigator === "undefined") return "unknown";
  const ua = navigator.userAgent;
  if (/mobile/i.test(ua)) return "mobile";
  if (/tablet|ipad/i.test(ua)) return "tablet";
  return "desktop";
}

export function AnalyticsTracker() {
  const pathname = usePathname();

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    // Respect Do Not Track.
    if (navigator.doNotTrack === "1" || (window as any).doNotTrack === "1") return;
    if (pathname.startsWith("/admin")) return;

    const payload = JSON.stringify({
      path: pathname,
      referrer: document.referrer || null,
      device: device(),
      sessionId: sessionId(),
    });

    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/track", new Blob([payload], { type: "application/json" }));
      } else {
        fetch("/api/track", { method: "POST", body: payload, headers: { "Content-Type": "application/json" }, keepalive: true });
      }
    } catch {
      /* ignore */
    }
  }, [pathname]);

  return null;
}
