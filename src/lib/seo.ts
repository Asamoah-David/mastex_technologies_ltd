import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

interface SeoParams {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
}

export function buildMetadata({
  title,
  description,
  path = "/",
  image,
  noIndex,
}: SeoParams = {}): Metadata {
  const fullTitle = title ? `${title} — ${siteConfig.name}` : siteConfig.name;
  const desc = description ?? siteConfig.description;
  const url = new URL(path, siteConfig.url).toString();
  const ogImage = image ?? siteConfig.ogImage;

  return {
    title: fullTitle,
    description: desc,
    metadataBase: new URL(siteConfig.url),
    manifest: "/manifest.webmanifest",
    icons: {
      icon: [
        { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
        { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      ],
      apple: "/apple-icon.png",
    },
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      title: fullTitle,
      description: desc,
      url,
      images: [{ url: ogImage, width: 1200, height: 630, alt: siteConfig.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: desc,
      images: [ogImage],
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    sameAs: Object.values(siteConfig.socials),
  };
}

export function productJsonLd(product: any) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: product.name,
    description: product.description,
    applicationCategory: product.category?.name ?? "BusinessApplication",
    operatingSystem: "Web",
    url: `${siteConfig.url}/products/${product.slug}`,
    publisher: { "@type": "Organization", name: siteConfig.name },
    ...(Array.isArray(product.pricing) && product.pricing.length
      ? {
          offers: product.pricing.map((t: any) => ({
            "@type": "Offer",
            name: t.tier,
            price: typeof t.price === "number" ? t.price : undefined,
            priceCurrency: "GHS",
          })),
        }
      : {}),
  };
}

export function articleJsonLd(post: any) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt ?? undefined,
    datePublished: post.publishedAt ?? undefined,
    dateModified: post.updatedAt ?? post.publishedAt ?? undefined,
    author: { "@type": post.author?.name ? "Person" : "Organization", name: post.author?.name ?? siteConfig.name },
    publisher: { "@type": "Organization", name: siteConfig.name },
    mainEntityOfPage: `${siteConfig.url}/blog/${post.slug}`,
  };
}

export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${siteConfig.url}${it.path}`,
    })),
  };
}
