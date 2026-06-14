import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Section, SectionHeader } from "@/components/site/section";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { Icon } from "@/components/icon";
import { getIndustries, getSolutions } from "@/lib/queries";
import { industryImage } from "@/lib/images";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 600;

export const metadata = buildMetadata({
  title: "Solutions",
  description: "Industry solutions powered by the Mastex product suite.",
  path: "/solutions",
});

export default async function SolutionsPage() {
  const [industries, solutions] = await Promise.all([getIndustries(), getSolutions()]);

  return (
    <>
      <Section className="pb-10">
        <Reveal>
          <SectionHeader
            eyebrow="Solutions"
            title="Software shaped to your industry"
            description="We combine our products into solutions tailored to the way each sector operates."
          />
        </Reveal>
      </Section>

      <Section className="pt-0">
        <Stagger className="grid gap-6 md:grid-cols-2">
          {solutions.map((s) => (
            <StaggerItem key={s.id}>
              <Link
                href={`/solutions/${s.slug}`}
                id={s.industry?.slug}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-card transition-colors hover:border-primary/40"
              >
                <div className="relative h-44 w-full overflow-hidden">
                  <Image
                    src={industryImage(s.industry?.slug)}
                    alt={s.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060a14]/40 to-transparent" />
                  <span className="absolute left-4 top-4 inline-flex size-11 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur">
                    <Icon name={s.icon} className="size-5" />
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-8 pt-6">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold">{s.title}</h3>
                </div>
                {s.industry && (
                  <span className="mt-1 text-sm text-primary">{s.industry.name}</span>
                )}
                <p className="mt-3 flex-1 text-muted-foreground">{s.summary}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                  Explore solution <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      <Section className="bg-muted/30">
        <Reveal>
          <SectionHeader eyebrow="Industries we serve" title="Trusted across sectors" />
        </Reveal>
        <div className="mx-auto mt-12 flex max-w-4xl flex-wrap justify-center gap-3">
          {industries.map((i) => (
            <span
              key={i.id}
              className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-sm font-medium"
            >
              <Icon name={i.icon} className="size-4 text-primary" /> {i.name}
            </span>
          ))}
        </div>
      </Section>
    </>
  );
}
