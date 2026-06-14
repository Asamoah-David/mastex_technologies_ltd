"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";

export function DocsSidebar({ tree }: { tree: any[] }) {
  const pathname = usePathname();
  const [query, setQuery] = React.useState("");

  const term = query.trim().toLowerCase();
  const filtered = term
    ? tree
        .map((cat) => ({
          ...cat,
          articles: (cat.articles ?? []).filter((a: any) =>
            a.title.toLowerCase().includes(term),
          ),
        }))
        .filter((cat) => cat.articles.length > 0)
    : tree;

  return (
    <nav className="space-y-6">
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search docs…"
          className="h-9 w-full rounded-lg border border-input bg-background pl-8 pr-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
      {filtered.length === 0 && (
        <p className="text-sm text-muted-foreground">No matching articles.</p>
      )}
      {filtered.map((cat) => (
        <div key={cat.id}>
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Icon name={cat.icon} className="size-3.5" />
            {cat.name}
          </div>
          <ul className="space-y-0.5 border-l border-border">
            {(cat.articles ?? []).map((a: any) => {
              const href = `/docs/${a.slug}`;
              const active = pathname === href;
              return (
                <li key={a.id}>
                  <Link
                    href={href}
                    className={cn(
                      "-ml-px block border-l-2 py-1.5 pl-4 text-sm transition-colors",
                      active
                        ? "border-primary font-medium text-foreground"
                        : "border-transparent text-muted-foreground hover:border-border hover:text-foreground",
                    )}
                  >
                    {a.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
