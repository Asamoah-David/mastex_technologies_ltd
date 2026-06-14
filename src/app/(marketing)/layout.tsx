import { Suspense } from "react";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { AnalyticsTracker } from "@/components/site/analytics-tracker";
import { BackToTop } from "@/components/site/back-to-top";
import { CommandPalette, type CommandItem } from "@/components/command-palette";
import {
  getNavigation,
  getAllProducts,
  getDocTree,
  getPublishedPosts,
  getSolutions,
  getBrandLogo,
} from "@/lib/queries";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [nav, products, docTree, posts, solutions, logoSrc] = await Promise.all([
    getNavigation(),
    getAllProducts(),
    getDocTree(),
    getPublishedPosts(),
    getSolutions(),
    getBrandLogo(),
  ]);

  const commandItems: CommandItem[] = [
    { label: "Home", href: "/", group: "Pages", icon: "Home" },
    { label: "Products", href: "/products", group: "Pages", icon: "Package" },
    { label: "Solutions", href: "/solutions", group: "Pages", icon: "Layers" },
    { label: "Documentation", href: "/docs", group: "Pages", icon: "BookText" },
    { label: "Blog", href: "/blog", group: "Pages", icon: "Newspaper" },
    { label: "Careers", href: "/careers", group: "Pages", icon: "Briefcase" },
    { label: "Pricing", href: "/pricing", group: "Pages", icon: "BadgeDollarSign" },
    { label: "About", href: "/about", group: "Pages", icon: "Building2" },
    { label: "Contact", href: "/contact", group: "Pages", icon: "Mail" },
    ...products.map((p: any) => ({
      label: p.name,
      href: `/products/${p.slug}`,
      group: "Products",
      icon: "Box",
      keywords: p.tagline ?? "",
    })),
    ...solutions.map((s: any) => ({
      label: s.title,
      href: `/solutions/${s.slug}`,
      group: "Solutions",
      icon: "Layers",
    })),
    ...docTree.flatMap((c: any) =>
      (c.articles ?? []).map((a: any) => ({
        label: a.title,
        href: `/docs/${a.slug}`,
        group: "Docs",
        icon: "FileText",
      })),
    ),
    ...posts.map((p: any) => ({
      label: p.title,
      href: `/blog/${p.slug}`,
      group: "Blog",
      icon: "FileText",
    })),
  ];

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <Suspense>
        <AnalyticsTracker />
      </Suspense>
      <CommandPalette items={commandItems} />
      <Navbar items={nav.header} logoSrc={logoSrc} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer extraLinks={nav.footer} logoSrc={logoSrc} />
      <BackToTop />
    </div>
  );
}
