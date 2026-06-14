"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, CornerDownLeft, ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";

export type CommandItem = {
  label: string;
  href: string;
  group: string;
  icon?: string;
  keywords?: string;
};

export function CommandPalette({ items }: { items: CommandItem[] }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [active, setActive] = React.useState(0);

  // Global shortcuts: ⌘K / Ctrl+K, and a custom event from the navbar button.
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-command", onOpen as EventListener);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-command", onOpen as EventListener);
    };
  }, []);

  React.useEffect(() => {
    if (!open) {
      setQuery("");
      setActive(0);
    }
  }, [open]);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((i) =>
      `${i.label} ${i.group} ${i.keywords ?? ""}`.toLowerCase().includes(q),
    );
  }, [items, query]);

  React.useEffect(() => setActive(0), [query]);

  function go(href: string) {
    setOpen(false);
    router.push(href);
  }

  function onInputKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter" && filtered[active]) {
      e.preventDefault();
      go(filtered[active].href);
    }
  }

  // Group results for display.
  const groups = React.useMemo(() => {
    const map = new Map<string, { item: CommandItem; index: number }[]>();
    filtered.forEach((item, index) => {
      const arr = map.get(item.group) ?? [];
      arr.push({ item, index });
      map.set(item.group, arr);
    });
    return [...map.entries()];
  }, [filtered]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent hideClose className="overflow-hidden p-0">
        <DialogTitle className="sr-only">Search Mastex</DialogTitle>
        <div className="flex items-center gap-2 border-b px-4">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onInputKey}
            placeholder="Search products, docs, pages…"
            className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <kbd className="hidden rounded border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground sm:inline">
            ESC
          </kbd>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {filtered.length === 0 && (
            <p className="px-3 py-8 text-center text-sm text-muted-foreground">
              No results for “{query}”.
            </p>
          )}
          {groups.map(([group, entries]) => (
            <div key={group} className="mb-2">
              <p className="px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {group}
              </p>
              {entries.map(({ item, index }) => (
                <button
                  key={item.href}
                  onMouseEnter={() => setActive(index)}
                  onClick={() => go(item.href)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm",
                    index === active ? "bg-accent text-accent-foreground" : "text-foreground",
                  )}
                >
                  <Icon name={item.icon} className="size-4 text-muted-foreground" />
                  <span className="flex-1">{item.label}</span>
                  {index === active ? (
                    <CornerDownLeft className="size-3.5 text-muted-foreground" />
                  ) : (
                    <ArrowRight className="size-3.5 opacity-0" />
                  )}
                </button>
              ))}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
