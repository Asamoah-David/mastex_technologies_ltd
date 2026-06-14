import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function Breadcrumbs({
  items,
  className,
}: {
  items: { name: string; href?: string }[];
  className?: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-1.5">
              {item.href && !last ? (
                <Link href={item.href} className="text-muted-foreground hover:text-foreground">
                  {item.name}
                </Link>
              ) : (
                <span className={last ? "font-medium" : "text-muted-foreground"} aria-current={last ? "page" : undefined}>
                  {item.name}
                </span>
              )}
              {!last && <ChevronRight className="size-3.5 text-muted-foreground/60" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
