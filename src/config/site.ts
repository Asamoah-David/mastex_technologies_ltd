export const siteConfig = {
  name: "Mastex Technologies Ltd",
  shortName: "Mastex",
  domain: "mastex.tech",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  description:
    "Mastex Technologies Ltd designs, builds and operates enterprise software, SaaS platforms and digital solutions engineered to scale.",
  tagline: "Software that runs modern businesses.",
  email: "hello@mastex.tech",
  ogImage: "/og.png",
  socials: {
    x: "https://x.com/mastex",
    linkedin: "https://linkedin.com/company/mastex",
    github: "https://github.com/mastex",
  },
} as const;

export const mainNav = [
  { label: "Products", href: "/products" },
  { label: "Solutions", href: "/solutions" },
  { label: "Docs", href: "/docs" },
  { label: "Blog", href: "/blog" },
  { label: "Careers", href: "/careers" },
  { label: "About", href: "/about" },
] as const;

export const footerNav = [
  {
    title: "Products",
    links: [
      { label: "Mastex BMS", href: "/products/mastex-bms" },
      { label: "Mastex SchoolOS", href: "/products/mastex-schoolos" },
      { label: "DeepBoard", href: "/products/deepboard" },
      { label: "All products", href: "/products" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "/docs" },
      { label: "Solutions", href: "/solutions" },
      { label: "Pricing", href: "/pricing" },
      { label: "Changelog", href: "/changelog" },
      { label: "Status", href: "/status" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
] as const;

export const adminNav = [
  { label: "Dashboard", href: "/admin", icon: "LayoutDashboard" },
  { label: "Products", href: "/admin/products", icon: "Package" },
  { label: "Solutions", href: "/admin/solutions", icon: "Layers" },
  { label: "Changelog", href: "/admin/changelog", icon: "GitCommitHorizontal" },
  { label: "Blog", href: "/admin/blog", icon: "Newspaper" },
  { label: "Documentation", href: "/admin/docs", icon: "BookText" },
  { label: "Media", href: "/admin/media", icon: "Image" },
  { label: "Leads", href: "/admin/leads", icon: "Inbox" },
  { label: "Careers", href: "/admin/careers", icon: "Briefcase" },
  { label: "Taxonomy", href: "/admin/taxonomy", icon: "Tags" },
  { label: "Analytics", href: "/admin/analytics", icon: "BarChart3" },
  { label: "Audit log", href: "/admin/audit", icon: "ScrollText" },
  { label: "Navigation", href: "/admin/navigation", icon: "Menu" },
  { label: "Settings", href: "/admin/settings", icon: "Settings" },
  { label: "Users", href: "/admin/users", icon: "Users" },
] as const;
