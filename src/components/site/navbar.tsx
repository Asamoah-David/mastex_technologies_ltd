"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight, Search } from "lucide-react";
import { Brand } from "@/components/brand";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { mainNav } from "@/config/site";
import { cn } from "@/lib/utils";

type NavItem = { label: string; href: string; isExternal?: boolean };

export function Navbar({ items, logoSrc }: { items?: NavItem[]; logoSrc?: string }) {
  const nav: NavItem[] = items && items.length ? items : (mainNav as unknown as NavItem[]);
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all",
        scrolled
          ? "border-b border-border/60 bg-background/80 backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      <nav className="container-page flex h-16 items-center justify-between gap-6">
        <Brand markSrc={logoSrc} />

        <div className="hidden items-center gap-1 md:flex">
          {nav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-foreground",
                  active ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event("open-command"))}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Search"
          >
            <Search className="size-3.5" />
            <span>Search</span>
            <kbd className="rounded border bg-background px-1 py-0.5 text-[10px]">⌘K</kbd>
          </button>
          <ThemeToggle />
          <Button asChild variant="ghost" size="sm">
            <Link href="/contact">Contact</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/products">
              Explore <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-border/60 bg-background md:hidden">
          <div className="container-page flex flex-col gap-1 py-4">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
            <Button asChild className="mt-2">
              <Link href="/contact">Talk to us</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
