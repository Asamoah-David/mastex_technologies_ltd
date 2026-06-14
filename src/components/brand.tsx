import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Brand({
  className,
  showWordmark = true,
  href = "/",
  markSrc = "/logo-mark.png",
}: {
  className?: string;
  showWordmark?: boolean;
  href?: string | null;
  markSrc?: string;
}) {
  const content = (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="inline-flex size-9 items-center justify-center overflow-hidden rounded-lg bg-[#05070d] ring-1 ring-border shadow-sm">
        <Image
          src={markSrc}
          alt="Mastex Technologies Ltd"
          width={36}
          height={36}
          className="size-9 object-cover"
          priority
          unoptimized={markSrc.startsWith("http")}
        />
      </span>
      {showWordmark && (
        <span className="flex flex-col leading-none">
          <span className="text-sm font-semibold tracking-tight">Mastex</span>
          <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Technologies
          </span>
        </span>
      )}
    </span>
  );

  if (href === null) return content;
  return (
    <Link href={href} aria-label="Mastex Technologies Ltd home">
      {content}
    </Link>
  );
}
