import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check, Shield, LineChart, Zap } from "lucide-react";
import { industryImage } from "@/lib/images";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Section, SectionHeader } from "@/components/site/section";
import { ProductCard } from "@/components/site/product-card";
import { Marquee } from "@/components/site/marquee";
import { HeroCarousel } from "@/components/site/hero-carousel";
import { TestimonialCarousel } from "@/components/site/testimonial-carousel";
import { ProductSpotlight } from "@/components/site/product-spotlight";
import { Faq } from "@/components/site/faq";
import { JsonLd } from "@/components/json-ld";
import { faqJsonLd } from "@/lib/seo";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { Icon } from "@/components/icon";
import {
  getFeaturedProducts,
  getIndustries,
  getPublishedPosts,
  getSetting,
} from "@/lib/queries";
import { formatDate } from "@/lib/utils";

export const revalidate = 600;

export default async function HomePage() {
  const [products, industries, posts, hero, stats, testimonials, trustedBy, faq] =
    await Promise.all([
      getFeaturedProducts(),
      getIndustries(),
      getPublishedPosts(),
      getSetting<any>("home.hero"),
      getSetting<any[]>("home.stats"),
      getSetting<any[]>("home.testimonials"),
      getSetting<string[]>("home.trustedBy"),
      getSetting<any[]>("home.faq"),
    ]);

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#070b16] text-white">
        {/* Rotating real-photography backdrop */}
        <HeroCarousel
          slides={[
            { src: "/images/hero-team.jpg", alt: "Mastex business team collaborating in a modern office" },
            { src: "/images/hero-skyline.jpg", alt: "Modern Accra city skyline" },
            { src: "/images/hero-data.jpg", alt: "Analyst reviewing business performance dashboards" },
            { src: "/images/collab.jpg", alt: "Colleagues working together on a project" },
          ]}
        />
        <div className="container-page relative z-10 pb-28 pt-24 sm:pt-32">
          <Reveal className="mx-auto max-w-3xl text-center">
            <Badge
              variant="outline"
              className="mb-6 border-white/20 bg-white/5 py-1 font-medium text-white/90 backdrop-blur"
            >
              {hero?.eyebrow ?? "Mastex Technologies Ltd"}
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-balance text-white sm:text-6xl">
              {hero?.headline ?? "Software that runs modern businesses."}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-white/70 text-balance">
              {hero?.subhead}
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="shadow-lg shadow-blue-500/20">
                <Link href={hero?.primaryCta?.href ?? "/products"}>
                  {hero?.primaryCta?.label ?? "Explore products"}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/25 bg-white/5 text-white backdrop-blur hover:bg-white/10 hover:text-white"
              >
                <Link href={hero?.secondaryCta?.href ?? "/contact"}>
                  {hero?.secondaryCta?.label ?? "Talk to us"}
                </Link>
              </Button>
            </div>
          </Reveal>

          {/* Stats */}
          {stats && (
            <Stagger className="mx-auto mt-20 grid max-w-4xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-4">
              {stats.map((s) => (
                <StaggerItem
                  key={s.label}
                  className="bg-white/[0.04] p-6 text-center backdrop-blur"
                >
                  <div className="text-3xl font-bold tracking-tight text-white">{s.value}</div>
                  <div className="mt-1 text-sm text-white/60">{s.label}</div>
                </StaggerItem>
              ))}
            </Stagger>
          )}
        </div>
      </section>

      {/* ── Product spotlight (auto-cycling) ─────────────────────────────── */}
      {products.length > 0 && (
        <Section className="pb-0">
          <Reveal>
            <ProductSpotlight products={products} />
          </Reveal>
        </Section>
      )}

      {/* ── Featured products ────────────────────────────────────────────── */}
      <Section>
        <Reveal>
          <SectionHeader
            eyebrow="Our products"
            title="A growing suite of software products"
            description="Every Mastex product is built on the same foundation: secure, scalable and designed to be loved by the people who use it daily."
          />
        </Reveal>
        <Stagger className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <StaggerItem key={p.id}>
              <ProductCard product={p} />
            </StaggerItem>
          ))}
        </Stagger>
        <div className="mt-10 text-center">
          <Button asChild variant="outline">
            <Link href="/products">
              View all products <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </Section>

      {/* ── Trusted by ───────────────────────────────────────────────────── */}
      {trustedBy && trustedBy.length > 0 && (
        <div className="border-y bg-muted/20 py-10">
          <div className="container-page">
            <p className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Trusted by teams across the continent
            </p>
            <Marquee items={trustedBy} />
          </div>
        </div>
      )}

      {/* ── Industries ───────────────────────────────────────────────────── */}
      <Section className="bg-muted/30">
        <Reveal>
          <SectionHeader
            eyebrow="Industries"
            title="Built for the sectors that move economies"
            description="From classrooms to clinics to checkout counters — our software adapts to how each industry actually works."
          />
        </Reveal>
        <Stagger className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {industries.map((ind) => (
            <StaggerItem key={ind.id}>
              <Link
                href={`/solutions#${ind.slug}`}
                className="group relative flex h-56 flex-col justify-end overflow-hidden rounded-2xl border"
              >
                <Image
                  src={industryImage(ind.slug)}
                  alt={ind.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#060a14] via-[#060a14]/55 to-transparent" />
                <div className="relative p-5 text-white">
                  <span className="mb-2 inline-flex size-9 items-center justify-center rounded-lg bg-white/15 backdrop-blur">
                    <Icon name={ind.icon} className="size-4.5" />
                  </span>
                  <div className="font-semibold">{ind.name}</div>
                  <div className="mt-0.5 line-clamp-2 text-xs text-white/70">{ind.description}</div>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      {/* ── Why choose us ────────────────────────────────────────────────── */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Why Mastex
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl text-balance">
              Engineered like a billion-dollar software company.
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              We obsess over reliability, security and craft so you don&apos;t have to. Each
              product is production-grade from day one.
            </p>
            <ul className="mt-8 space-y-4">
              {WHY.map((w) => (
                <li key={w.title} className="flex gap-4">
                  <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <w.icon className="size-5" />
                  </span>
                  <div>
                    <h3 className="font-medium">{w.title}</h3>
                    <p className="text-sm text-muted-foreground">{w.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="relative rounded-2xl border bg-gradient-to-br from-card to-muted/40 p-8">
              <div className="space-y-4">
                {CAPABILITIES.map((c) => (
                  <div key={c} className="flex items-center gap-3 rounded-lg border bg-card px-4 py-3">
                    <Check className="size-4 text-primary" />
                    <span className="text-sm font-medium">{c}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ── Testimonials ─────────────────────────────────────────────────── */}
      <Section className="bg-muted/30">
        <Reveal>
          <SectionHeader eyebrow="Trusted by teams" title="What our customers say" />
        </Reveal>
        <Reveal delay={0.1} className="mt-14">
          <TestimonialCarousel items={testimonials ?? TESTIMONIALS} />
        </Reveal>
      </Section>

      {/* ── Latest blog ──────────────────────────────────────────────────── */}
      {posts.length > 0 && (
        <Section>
          <div className="flex items-end justify-between">
            <SectionHeader eyebrow="Insights" title="From the blog" center={false} />
            <Button asChild variant="ghost" className="hidden sm:inline-flex">
              <Link href="/blog">
                All posts <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {posts.slice(0, 3).map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group flex flex-col rounded-2xl border bg-card p-6 transition-colors hover:border-primary/40"
              >
                {post.category && (
                  <Badge variant="muted" className="w-fit">
                    {post.category.name}
                  </Badge>
                )}
                <h3 className="mt-4 text-lg font-semibold leading-snug group-hover:text-primary">
                  {post.title}
                </h3>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{post.excerpt}</p>
                <div className="mt-5 text-xs text-muted-foreground">
                  {post.publishedAt ? formatDate(post.publishedAt) : "Draft"} ·{" "}
                  {post.readingMinutes} min read
                </div>
              </Link>
            ))}
          </div>
        </Section>
      )}

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      {faq && faq.length > 0 && (
        <Section className="bg-muted/30">
          <JsonLd data={faqJsonLd(faq)} />
          <Reveal>
            <SectionHeader
              eyebrow="FAQ"
              title="Frequently asked questions"
              description="Everything you need to know. Can't find an answer? Talk to our team."
            />
          </Reveal>
          <Reveal delay={0.1} className="mt-12">
            <Faq items={faq} />
          </Reveal>
        </Section>
      )}

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <Section>
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border px-8 py-20 text-center text-white sm:px-16">
            {/* Real photography backdrop */}
            <Image
              src="/images/hero-skyline.jpg"
              alt="Accra business district"
              fill
              sizes="(max-width: 1280px) 100vw, 1200px"
              className="object-cover"
            />
            {/* Brand-tinted overlay for legibility */}
            <div className="absolute inset-0 bg-[#060a14]/75" aria-hidden />
            <div className="absolute inset-0 bg-gradient-to-br from-[#0a1838]/70 via-transparent to-[#1d4ed8]/40" aria-hidden />
            <h2 className="relative mx-auto max-w-2xl text-3xl font-bold tracking-tight text-balance sm:text-4xl">
              Ready to build the future of your business?
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-white/80">
              Talk to our team about which Mastex products fit your organisation — or request a
              tailored demo.
            </p>
            <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/contact">Talk to sales</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/30 bg-white/5 text-white backdrop-blur hover:bg-white/10 hover:text-white"
              >
                <Link href="/products">Browse products</Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}

const WHY = [
  { icon: Shield, title: "Secure by design", description: "RBAC, audit logs, encryption and security headers built into every layer." },
  { icon: Zap, title: "Fast everywhere", description: "Server components, edge caching and offline-first clients keep things instant." },
  { icon: LineChart, title: "Insight-driven", description: "We turn your operational data into clear decisions, not just dashboards." },
];

const CAPABILITIES = [
  "99.9% uptime SLA",
  "SOC2-ready architecture",
  "Multi-tenant & multi-branch",
  "Local payment rails (mobile money, cards)",
  "Role-based access control",
  "Continuous deployment",
];

const TESTIMONIALS = [
  { quote: "Mastex BMS replaced four separate tools. Our shops finally run on one system.", author: "Ama Mensah", role: "Owner, Mensah Retail" },
  { quote: "SchoolOS cut our fee-collection admin in half and parents love the portal.", author: "Mr. Boateng", role: "Head, Unity Academy" },
  { quote: "DeepBoard gives our board the clarity we used to spend weeks assembling.", author: "K. Owusu", role: "CFO, Adinkra Group" },
];
