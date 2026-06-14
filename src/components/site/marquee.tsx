import { cn } from "@/lib/utils";

/**
 * Lightweight CSS marquee for a "trusted by" strip. Duplicates the items so the
 * loop is seamless. Pauses on hover and respects reduced motion (via CSS).
 */
export function Marquee({
  items,
  className,
}: {
  items: string[];
  className?: string;
}) {
  if (!items?.length) return null;
  const loop = [...items, ...items];
  return (
    <div
      className={cn(
        "group relative flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)]",
        className,
      )}
    >
      <div className="flex shrink-0 animate-[marquee_28s_linear_infinite] items-center gap-12 pr-12 group-hover:[animation-play-state:paused] motion-reduce:animate-none">
        {loop.map((item, i) => (
          <span
            key={i}
            className="whitespace-nowrap text-lg font-semibold tracking-tight text-muted-foreground/70"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
