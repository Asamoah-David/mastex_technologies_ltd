import Image from "next/image";
import { Quote, Target, Eye, Heart, Flag } from "lucide-react";
import { Section, SectionHeader } from "@/components/site/section";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { Brand } from "@/components/brand";
import { getSetting } from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 600;

export const metadata = buildMetadata({
  title: "About",
  description: "The company, the mission and the people building Mastex Technologies Ltd.",
  path: "/about",
});

export default async function AboutPage() {
  const [company, founder, leadership] = await Promise.all([
    getSetting<any>("company.details"),
    getSetting<any>("about.founder"),
    getSetting<any[]>("about.leadership"),
  ]);

  return (
    <>
      <Section className="pb-10">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            About us
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-balance sm:text-5xl">
            We build the software that runs modern businesses.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground text-balance">
            {company?.tagline} Mastex Technologies Ltd is a product company shipping enterprise
            systems, SaaS platforms and digital solutions for organisations across Africa and beyond.
          </p>
        </Reveal>
      </Section>

      {/* Banner image */}
      <div className="container-page">
        <Reveal>
          <div className="relative aspect-[21/9] w-full overflow-hidden rounded-3xl border">
            <Image
              src="/images/hero-team.jpg"
              alt="The Mastex team at work"
              fill
              sizes="(max-width: 1280px) 100vw, 1200px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#060a14]/60 to-transparent" />
          </div>
        </Reveal>
      </div>

      {/* Story */}
      <Section className="py-12">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="space-y-5 text-lg leading-relaxed text-muted-foreground">
            <h2 className="text-2xl font-bold text-foreground">Our story</h2>
            <p>
              Mastex began with a simple observation: ambitious organisations were being held back
              by software that didn&apos;t fit how they actually work. So we set out to build it
              properly — products that are reliable, secure and a joy to use.
            </p>
            <p>
              Today we operate a growing portfolio of products, from business management to school
              operations to decision intelligence, all built on a shared, scalable foundation.
            </p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border">
            <Image
              src="/images/collab.jpg"
              alt="Mastex engineers collaborating"
              fill
              sizes="(max-width: 1024px) 100vw, 600px"
              className="object-cover"
            />
          </div>
        </div>
      </Section>

      {/* Mission / Vision / Values */}
      <Section className="bg-muted/30">
        <Stagger className="grid gap-6 md:grid-cols-3">
          {PILLARS.map((p) => (
            <StaggerItem key={p.title}>
              <div className="flex h-full flex-col rounded-2xl border bg-card p-6">
                <span className="inline-flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <p.icon className="size-5" />
                </span>
                <h3 className="mt-4 text-lg font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.body}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      {/* Values list */}
      <Section>
        <Reveal>
          <SectionHeader eyebrow="What we value" title="The principles we build on" />
        </Reveal>
        <div className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-2">
          {VALUES.map((v) => (
            <div key={v.title} className="flex gap-4 rounded-xl border bg-card p-5">
              <Heart className="mt-0.5 size-5 shrink-0 text-primary" />
              <div>
                <h3 className="font-medium">{v.title}</h3>
                <p className="text-sm text-muted-foreground">{v.body}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Founder (≈10% presence) */}
      {founder && (
        <Section className="bg-muted/30">
          <Reveal className="mx-auto max-w-3xl">
            <div className="rounded-3xl border bg-card p-8 sm:p-12">
              <Quote className="size-8 text-primary/40" />
              <blockquote className="mt-4 text-xl font-medium leading-relaxed text-balance">
                {founder.quote}
              </blockquote>
              <div className="mt-6 flex items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
                  {founder.name?.[0] ?? "M"}
                </div>
                <div>
                  <div className="font-semibold">{founder.name}</div>
                  <div className="text-sm text-muted-foreground">{founder.role}</div>
                </div>
              </div>
              {founder.vision && (
                <p className="mt-6 border-t pt-6 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Our vision: </span>
                  {founder.vision}
                </p>
              )}
            </div>
          </Reveal>
        </Section>
      )}

      {/* Leadership */}
      {leadership && leadership.length > 0 && (
        <Section>
          <Reveal>
            <SectionHeader eyebrow="Leadership" title="The team steering Mastex" />
          </Reveal>
          <Stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {leadership.map((person: any) => (
              <StaggerItem key={person.name}>
                <div className="flex h-full flex-col items-center rounded-2xl border bg-card p-6 text-center">
                  <div className="flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-brand-700/20 text-xl font-semibold text-primary">
                    {person.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                  <div className="mt-4 font-semibold">{person.name}</div>
                  <div className="text-sm text-primary">{person.role}</div>
                  {person.bio && (
                    <p className="mt-3 text-sm text-muted-foreground">{person.bio}</p>
                  )}
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </Section>
      )}

      {/* Timeline */}
      <Section>
        <Reveal>
          <SectionHeader eyebrow="Our journey" title="Milestones" />
        </Reveal>
        <div className="mx-auto mt-12 max-w-2xl">
          <ol className="relative border-l border-border pl-8">
            {TIMELINE.map((t) => (
              <li key={t.year} className="mb-8 last:mb-0">
                <span className="absolute -left-[9px] flex size-4 items-center justify-center rounded-full bg-primary" />
                <div className="flex items-center gap-3">
                  <Flag className="size-4 text-primary" />
                  <span className="font-semibold">{t.year}</span>
                </div>
                <p className="mt-1 text-muted-foreground">{t.event}</p>
              </li>
            ))}
          </ol>
        </div>
        <div className="mt-16 flex justify-center">
          <Brand href={null} />
        </div>
      </Section>
    </>
  );
}

const PILLARS = [
  { icon: Target, title: "Mission", body: "To give every organisation access to world-class software that helps them grow." },
  { icon: Eye, title: "Vision", body: "To be the default technology partner for ambitious businesses across the continent." },
  { icon: Heart, title: "Approach", body: "Build production-grade products with security, scale and craft from day one." },
];

const VALUES = [
  { title: "Customer obsession", body: "We build for the people who use our software every day." },
  { title: "Engineering excellence", body: "Quality is not negotiable — reliability is a feature." },
  { title: "Security first", body: "We protect our customers' data like it's our own." },
  { title: "Move with purpose", body: "We ship fast, but never recklessly." },
];

const TIMELINE = [
  { year: "2024", event: "Mastex Technologies Ltd founded with a focus on business software." },
  { year: "2025", event: "Mastex BMS and SchoolOS go live with their first customers." },
  { year: "2026", event: "DeepBoard enters beta; the platform expands across three countries." },
];
