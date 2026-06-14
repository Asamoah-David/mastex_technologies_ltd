"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FaqItem {
  question: string;
  answer: string;
}

export function Faq({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = React.useState<number | null>(0);
  if (!items?.length) return null;

  return (
    <div className="mx-auto max-w-3xl divide-y rounded-2xl border bg-card">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i}>
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
            >
              <span className="font-medium">{item.question}</span>
              <ChevronDown
                className={cn(
                  "size-5 shrink-0 text-muted-foreground transition-transform",
                  isOpen && "rotate-180",
                )}
              />
            </button>
            <div
              className={cn(
                "grid transition-all duration-300",
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden">
                <p className="px-6 pb-5 text-muted-foreground">{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
