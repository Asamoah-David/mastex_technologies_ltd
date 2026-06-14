/** Maps industry / solution slugs to real photography stored in /public/images. */
const INDUSTRY_IMAGES: Record<string, string> = {
  education: "/images/education.jpg",
  retail: "/images/retail.jpg",
  finance: "/images/finance.jpg",
  government: "/images/city-accra.jpg",
  enterprise: "/images/enterprise.jpg",
  healthcare: "/images/team-happy.jpg",
  logistics: "/images/collab.jpg",
};

export function industryImage(slug?: string | null): string {
  return (slug && INDUSTRY_IMAGES[slug]) || "/images/collab.jpg";
}

const PRODUCT_IMAGES: Record<string, string> = {
  workop: "/images/collab.jpg",
  "mastex-bms": "/images/retail.jpg",
  "mastex-schoolos": "/images/education.jpg",
  deepboard: "/images/hero-data.jpg",
  "mastex-pay": "/images/payments.jpg",
};

export function productImage(slug?: string | null): string {
  return (slug && PRODUCT_IMAGES[slug]) || "/images/enterprise.jpg";
}

export const HERO_IMAGES = [
  "/images/hero-team.jpg",
  "/images/hero-skyline.jpg",
  "/images/hero-data.jpg",
  "/images/collab.jpg",
];
