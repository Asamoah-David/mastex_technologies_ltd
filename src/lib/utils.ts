import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string, opts?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...opts,
  }).format(new Date(date));
}

export function formatCurrency(amount: number, currency = "GHS") {
  return new Intl.NumberFormat("en-GH", { style: "currency", currency }).format(amount);
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function truncate(text: string, length = 160) {
  if (text.length <= length) return text;
  return text.slice(0, length).trimEnd() + "…";
}

export function readingTime(text: string) {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}
