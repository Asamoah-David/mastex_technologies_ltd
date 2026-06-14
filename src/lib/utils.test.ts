import { describe, it, expect } from "vitest";
import { slugify, truncate, readingTime, cn } from "./utils";

describe("utils", () => {
  it("slugify normalises text", () => {
    expect(slugify("Hello World")).toBe("hello-world");
    expect(slugify("  Spaced  Out  ")).toBe("spaced-out");
    expect(slugify("Special!@# Chars")).toBe("special-chars");
    expect(slugify("Already-Slugged")).toBe("already-slugged");
  });

  it("truncate respects length and adds ellipsis", () => {
    expect(truncate("short", 80)).toBe("short");
    const long = "a".repeat(200);
    const t = truncate(long, 50);
    expect(t.length).toBeLessThanOrEqual(51);
    expect(t.endsWith("…")).toBe(true);
  });

  it("readingTime is at least 1 minute", () => {
    expect(readingTime("just a few words")).toBe(1);
    expect(readingTime("word ".repeat(400))).toBeGreaterThanOrEqual(2);
  });

  it("cn merges and dedupes tailwind classes", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
    expect(cn("text-sm", false && "hidden", "font-bold")).toContain("font-bold");
  });
});
