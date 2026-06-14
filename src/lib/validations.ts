import { z } from "zod";

export const leadSchema = z.object({
  type: z
    .enum(["CONTACT", "SALES", "PARTNERSHIP", "JOB_APPLICATION", "DEMO_REQUEST"])
    .default("CONTACT"),
  name: z.string().min(2, "Please enter your name").max(120),
  email: z.string().email("Enter a valid email"),
  phone: z.string().max(40).optional().or(z.literal("")),
  company: z.string().max(160).optional().or(z.literal("")),
  subject: z.string().max(200).optional().or(z.literal("")),
  message: z.string().min(10, "Tell us a little more").max(5000),
  source: z.string().max(200).optional(),
  jobSlug: z.string().optional(),
  // Honeypot — must stay empty.
  website: z.string().max(0).optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;

// ── Products ────────────────────────────────────────────────────────────────

export const productFeatureSchema = z.object({
  title: z.string().min(1, "Title required").max(160),
  description: z.string().max(400).optional().or(z.literal("")),
  icon: z.string().max(60).optional().or(z.literal("")),
  isBenefit: z.boolean().default(false),
});

export const pricingTierSchema = z.object({
  tier: z.string().min(1).max(60),
  price: z.union([z.number(), z.string()]),
  period: z.string().max(20).optional().or(z.literal("")),
  features: z.array(z.string()).default([]),
});

export const productSchema = z.object({
  name: z.string().min(2, "Name is required").max(160),
  slug: z
    .string()
    .min(2, "Slug is required")
    .max(160)
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers and hyphens only"),
  tagline: z.string().max(200).optional().or(z.literal("")),
  description: z.string().min(10, "Add a short description").max(400),
  longDescription: z.string().max(8000).optional().or(z.literal("")),
  status: z.enum(["CONCEPT", "IN_DEVELOPMENT", "BETA", "LIVE", "DEPRECATED"]),
  featured: z.boolean().default(false),
  order: z.coerce.number().int().default(0),
  categoryId: z.string().optional().or(z.literal("")),
  industryIds: z.array(z.string()).default([]),
  demoUrl: z.string().url().optional().or(z.literal("")),
  repoUrl: z.string().url().optional().or(z.literal("")),
  docsUrl: z.string().url().optional().or(z.literal("")),
  coverUrl: z.string().url().optional().or(z.literal("")),
  features: z.array(productFeatureSchema).default([]),
  pricing: z.array(pricingTierSchema).default([]),
  media: z
    .array(
      z.object({
        url: z.string().min(1),
        caption: z.string().max(200).optional().or(z.literal("")),
      }),
    )
    .default([]),
  seoTitle: z.string().max(200).optional().or(z.literal("")),
  seoDescription: z.string().max(400).optional().or(z.literal("")),
});

export type ProductInput = z.infer<typeof productSchema>;

// ── Blog ────────────────────────────────────────────────────────────────────

export const blogPostSchema = z.object({
  title: z.string().min(2, "Title is required").max(200),
  slug: z
    .string()
    .min(2, "Slug is required")
    .max(200)
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers and hyphens only"),
  excerpt: z.string().max(400).optional().or(z.literal("")),
  content: z.string().min(10, "Write some content"),
  coverUrl: z.string().url().optional().or(z.literal("")),
  status: z.enum(["DRAFT", "SCHEDULED", "PUBLISHED", "ARCHIVED"]),
  publishedAt: z.string().optional().or(z.literal("")),
  categoryId: z.string().optional().or(z.literal("")),
  tags: z.array(z.string()).default([]),
  readingMinutes: z.coerce.number().int().min(1).default(3),
  seoTitle: z.string().max(200).optional().or(z.literal("")),
  seoDescription: z.string().max(400).optional().or(z.literal("")),
});

export type BlogPostInput = z.infer<typeof blogPostSchema>;

// ── Docs ────────────────────────────────────────────────────────────────────

export const docArticleSchema = z.object({
  title: z.string().min(2, "Title is required").max(200),
  slug: z
    .string()
    .min(2, "Slug is required")
    .max(200)
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers and hyphens only"),
  content: z.string().min(5, "Write some content"),
  categoryId: z.string().min(1, "Pick a category"),
  status: z.enum(["DRAFT", "SCHEDULED", "PUBLISHED", "ARCHIVED"]).default("PUBLISHED"),
  version: z.string().max(20).default("1.0"),
  order: z.coerce.number().int().default(0),
  parentId: z.string().optional().or(z.literal("")),
});

export type DocArticleInput = z.infer<typeof docArticleSchema>;

export const docCategorySchema = z.object({
  name: z.string().min(2).max(120),
  slug: z
    .string()
    .min(2)
    .max(120)
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers and hyphens only"),
  description: z.string().max(400).optional().or(z.literal("")),
  icon: z.string().max(60).optional().or(z.literal("")),
  order: z.coerce.number().int().default(0),
});

export type DocCategoryInput = z.infer<typeof docCategorySchema>;

// ── Solutions ───────────────────────────────────────────────────────────────

export const solutionSchema = z.object({
  title: z.string().min(2, "Title is required").max(160),
  slug: z
    .string()
    .min(2, "Slug is required")
    .max(160)
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers and hyphens only"),
  summary: z.string().min(5, "Add a short summary").max(400),
  body: z.string().max(20000).optional().or(z.literal("")),
  icon: z.string().max(60).optional().or(z.literal("")),
  coverUrl: z.string().url().optional().or(z.literal("")),
  order: z.coerce.number().int().default(0),
  status: z.enum(["DRAFT", "SCHEDULED", "PUBLISHED", "ARCHIVED"]).default("PUBLISHED"),
  industryId: z.string().optional().or(z.literal("")),
});

export type SolutionInput = z.infer<typeof solutionSchema>;

// ── Job postings ──────────────────────────────────────────────────────────

export const jobSchema = z.object({
  title: z.string().min(2, "Title is required").max(160),
  slug: z
    .string()
    .min(2, "Slug is required")
    .max(160)
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers and hyphens only"),
  department: z.string().min(1, "Department is required").max(120),
  location: z.string().min(1, "Location is required").max(160),
  type: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP", "REMOTE"]),
  description: z.string().min(10, "Add a description"),
  requirements: z.string().optional().or(z.literal("")),
  status: z.enum(["DRAFT", "SCHEDULED", "PUBLISHED", "ARCHIVED"]).default("PUBLISHED"),
});

export type JobInput = z.infer<typeof jobSchema>;

// ── Changelog ─────────────────────────────────────────────────────────────

export const changelogSchema = z.object({
  productId: z.string().min(1, "Pick a product"),
  version: z.string().min(1, "Version is required").max(40),
  title: z.string().min(2, "Title is required").max(200),
  body: z.string().min(2, "Add release notes"),
  status: z.enum(["DRAFT", "SCHEDULED", "PUBLISHED", "ARCHIVED"]).default("PUBLISHED"),
  releasedAt: z.string().optional().or(z.literal("")),
});

export type ChangelogInput = z.infer<typeof changelogSchema>;

// ── Taxonomy ──────────────────────────────────────────────────────────────

export const taxonomySchema = z.object({
  name: z.string().min(2, "Name is required").max(120),
  slug: z
    .string()
    .min(2, "Slug is required")
    .max(120)
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers and hyphens only"),
  description: z.string().max(400).optional().or(z.literal("")),
  icon: z.string().max(60).optional().or(z.literal("")),
});

export type TaxonomyInput = z.infer<typeof taxonomySchema>;

// ── Users ───────────────────────────────────────────────────────────────────

export const userSchema = z.object({
  email: z.string().email("Enter a valid email"),
  name: z.string().max(160).optional().or(z.literal("")),
  role: z.enum(["SUPER_ADMIN", "ADMIN", "EDITOR", "SUPPORT", "VIEWER"]),
});

export type UserInput = z.infer<typeof userSchema>;
