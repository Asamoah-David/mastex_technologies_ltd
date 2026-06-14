"use client";

import * as React from "react";
import { Quote } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
}

export function TestimonialCarousel({
  items,
  interval = 6000,
}: {
  items: Testimonial[];
  interval?: number;
}) {
  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);

  React.useEffect(() => {
    if (paused || items.length < 2) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const t = window.setInterval(() => setIndex((i) => (i + 1) % items.length), interval);
    return () => window.clearInterval(t);
  }, [paused, items.length, interval]);

  if (!items.length) return null;

  return (
    <div
      className="relative mx-auto max-w-3xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative overflow-hidden rounded-3xl border bg-card p-8 sm:p-12">
        <Quote className="size-10 text-primary/30" />
        {/* Stacked for cross-fade; height driven by the active item */}
        <div className="relative mt-6">
          {items.map((t, i) => (
            <figure
              key={i}
              className={cn(
                "transition-opacity duration-700",
                i === index ? "relative opacity-100" : "pointer-events-none absolute inset-0 opacity-0",
              )}
            >
              <blockquote className="text-xl font-medium leading-relaxed text-balance sm:text-2xl">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                  {t.author?.[0] ?? "M"}
                </span>
                <span>
                  <span className="block font-semibold">{t.author}</span>
                  <span className="block text-sm text-muted-foreground">{t.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      {/* Indicators */}
      {items.length > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Show testimonial ${i + 1}`}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === index ? "w-6 bg-primary" : "w-2.5 bg-border hover:bg-muted-foreground/40",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
