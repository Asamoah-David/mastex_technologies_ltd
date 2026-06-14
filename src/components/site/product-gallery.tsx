"use client";

import * as React from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface GalleryItem {
  id?: string;
  url: string;
  caption?: string | null;
}

export function ProductGallery({
  items,
  productName,
}: {
  items: GalleryItem[];
  productName: string;
}) {
  const [open, setOpen] = React.useState<number | null>(null);

  const close = React.useCallback(() => setOpen(null), []);
  const next = React.useCallback(
    () => setOpen((i) => (i === null ? i : (i + 1) % items.length)),
    [items.length],
  );
  const prev = React.useCallback(
    () => setOpen((i) => (i === null ? i : (i - 1 + items.length) % items.length)),
    [items.length],
  );

  React.useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close, next, prev]);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((m, i) => (
          <button
            key={m.id ?? m.url}
            onClick={() => setOpen(i)}
            className="group relative aspect-video overflow-hidden rounded-2xl border bg-card text-left"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={m.url}
              alt={m.caption ?? productName}
              className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
            {m.caption && (
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-sm text-white">
                {m.caption}
              </span>
            )}
          </button>
        ))}
      </div>

      {open !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={close}
        >
          <button
            onClick={close}
            aria-label="Close"
            className="absolute right-4 top-4 inline-flex size-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <X className="size-5" />
          </button>
          {items.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                aria-label="Previous"
                className="absolute left-4 inline-flex size-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                aria-label="Next"
                className="absolute right-4 inline-flex size-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
              >
                <ChevronRight className="size-5" />
              </button>
            </>
          )}
          <figure className="relative max-h-[85vh] w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <div className="relative aspect-video w-full">
              <Image
                src={items[open].url}
                alt={items[open].caption ?? productName}
                fill
                sizes="100vw"
                className="rounded-xl object-contain"
              />
            </div>
            {items[open].caption && (
              <figcaption className="mt-3 text-center text-sm text-white/80">
                {items[open].caption}
              </figcaption>
            )}
          </figure>
        </div>
      )}
    </>
  );
}
