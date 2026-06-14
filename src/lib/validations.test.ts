import { describe, it, expect } from "vitest";
import { leadSchema, productSchema } from "./validations";

describe("leadSchema", () => {
  it("accepts a valid lead", () => {
    const r = leadSchema.safeParse({
      name: "Ama Mensah",
      email: "ama@example.com",
      message: "I would like a demo of Mastex BMS please.",
    });
    expect(r.success).toBe(true);
  });

  it("rejects bad email and short message", () => {
    const r = leadSchema.safeParse({ name: "x", email: "nope", message: "short" });
    expect(r.success).toBe(false);
  });

  it("defaults type to CONTACT", () => {
    const r = leadSchema.parse({
      name: "Test",
      email: "t@example.com",
      message: "A sufficiently long message here.",
    });
    expect(r.type).toBe("CONTACT");
  });
});

describe("productSchema", () => {
  it("requires a valid slug format", () => {
    const base = {
      name: "Mastex Pay",
      description: "Payments infrastructure for African businesses.",
      status: "BETA" as const,
    };
    expect(productSchema.safeParse({ ...base, slug: "Bad Slug!" }).success).toBe(false);
    expect(productSchema.safeParse({ ...base, slug: "mastex-pay" }).success).toBe(true);
  });
});
