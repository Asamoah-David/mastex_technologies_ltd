"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface HeroSlide {
  src: string;
  alt: string;
}

/**
 * Auto-rotating, cross-fading hero background built from real photography.
 * Respects prefers-reduced-motion (no auto-advance). A dark overlay keeps the
 * foreground text legible.
 */
export function HeroCarousel({
  slides,
  interval = 5500,
}: {
  slides: HeroSlide[];
  interval?: number;
}) {
  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);

  React.useEffect(() => {
    if (paused || slides.length < 2) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const t = window.setInterval(
      () => setIndex((i) => (i + 1) % slides.length),
      interval,
    );
    return () => window.clearInterval(t);
  }, [paused, slides.length, interval]);

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      aria-hidden
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((s, i) => (
        <div
          key={s.src}
          className={cn(
            "absolute inset-0 transition-opacity duration-[1400ms] ease-in-out motion-reduce:transition-none",
            i === index ? "opacity-100" : "opacity-0",
          )}
        >
          <Image
            src={s.src}
            alt={s.alt}
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover"
          />
        </div>
      ))}

      {/* Legibility overlays: darken + brand tint + smooth bottom blend */}
      <div className="absolute inset-0 bg-[#060a14]/72" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a1838]/70 via-transparent to-[#1d4ed8]/25" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#060a14]/30 via-transparent to-[#070b16]" />

      {/* Slide indicators */}
      {slides.length > 1 && (
        <div className="pointer-events-auto absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
          {slides.map((s, i) => (
            <button
              key={s.src}
              onClick={() => setIndex(i)}
              aria-label={`Show slide ${i + 1}`}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === index ? "w-6 bg-white" : "w-2.5 bg-white/40 hover:bg-white/60",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
