"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { icons } from "lucide-react";
import { Brand } from "@/components/brand";
import { adminNav } from "@/config/site";
import { cn } from "@/lib/utils";

export function AdminSidebar({ logoSrc }: { logoSrc?: string }) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r bg-card lg:flex">
      <div className="flex h-16 items-center border-b px-6">
        <Brand markSrc={logoSrc} />
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {adminNav.map((item) => {
          const Icon = (icons as any)[item.icon] ?? icons.Circle;
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t p-3">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          <icons.ExternalLink className="size-4" />
          View site
        </Link>
      </div>
    </aside>
  );
}
