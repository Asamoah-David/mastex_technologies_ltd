import Image from "next/image";
import {
  MapPin,
  Briefcase,
  Building2,
  Rocket,
  GraduationCap,
  Globe2,
  HeartHandshake,
  Trophy,
  Scale,
} from "lucide-react";
import { Section, SectionHeader } from "@/components/site/section";
import { Badge } from "@/components/ui/badge";
import { LeadForm } from "@/components/site/lead-form";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { getJobs } from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Careers",
  description: "Build the software that powers modern businesses. Join Mastex Technologies Ltd.",
  path: "/careers",
});

const JOB_TYPE_LABEL: Record<string, string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship",
  REMOTE: "Remote",
};

export default async function CareersPage() {
  const jobs = await getJobs();

  return (
    <>
      {/* Hero banner */}
      <section className="relative overflow-hidden bg-[#070b16] text-white">
        <Image
          src="/images/team-happy.jpg"
          alt="The Mastex team"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[#060a14]/78" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1838]/70 via-transparent to-[#1d4ed8]/30" aria-hidden />
        <div className="container-page relative py-20 text-center sm:py-28">
          <Reveal className="mx-auto max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-300">Careers</p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-balance text-white sm:text-5xl">
              Build the future with us
            </h1>
            <p className="mt-5 text-lg text-white/75 text-balance">
              We&apos;re a small, ambitious team building software used by thousands. If you care
              about craft and impact, we&apos;d love to meet you.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Perks & culture */}
      <Section>
        <Reveal>
          <SectionHeader
            eyebrow="Life at Mastex"
            title="Why you'll love working here"
            description="We're a tight-knit team that ships real software with real impact — and looks after each other while doing it."
          />
        </Reveal>
        <Stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PERKS.map((p) => (
            <StaggerItem key={p.title}>
              <div className="flex h-full flex-col rounded-2xl border bg-card p-6">
                <span className="inline-flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <p.icon className="size-5" />
                </span>
                <h3 className="mt-4 font-semibold">{p.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{p.body}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      {/* Open roles */}
      <Section className="bg-muted/30">
        <Reveal>
          <SectionHeader eyebrow="Open roles" title="Join the team" center={false} />
        </Reveal>
        <div className="mx-auto mt-10 max-w-3xl">
          {jobs.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No open roles right now — but we&apos;re always glad to meet great people.
            </p>
          ) : (
            <Stagger className="space-y-4">
              {jobs.map((job) => (
                <StaggerItem key={job.id}>
                  <div className="rounded-2xl border bg-card p-6">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold">{job.title}</h3>
                        <div className="mt-2 flex flex-wrap gap-3 text-sm text-muted-foreground">
                          <span className="inline-flex items-center gap-1.5">
                            <Building2 className="size-4" /> {job.department}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <MapPin className="size-4" /> {job.location}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <Briefcase className="size-4" /> {JOB_TYPE_LABEL[job.type] ?? job.type}
                          </span>
                        </div>
                      </div>
                      <Badge variant="success">Open</Badge>
                    </div>
                    <p className="mt-4 text-sm text-muted-foreground">{job.description}</p>
                    {job.requirements && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">Requirements: </span>
                        {job.requirements}
                      </p>
                    )}
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          )}
        </div>
      </Section>

      <Section>
        <div className="mx-auto max-w-2xl">
          <SectionHeader
            eyebrow="Apply"
            title="Tell us about yourself"
            description="Don't see the perfect role? Send us a note anyway."
          />
          <div className="mt-10 rounded-2xl border bg-card p-6 sm:p-8">
            <LeadForm type="JOB_APPLICATION" source="/careers" />
          </div>
        </div>
      </Section>
    </>
  );
}

const PERKS = [
  { icon: Rocket, title: "Real ownership", body: "Small team, big surface area. Your work ships to thousands of users — fast." },
  { icon: Globe2, title: "Remote-friendly", body: "Work from Accra or anywhere. We care about outcomes, not seat time." },
  { icon: GraduationCap, title: "Learning budget", body: "Courses, books and conferences — we invest in you levelling up." },
  { icon: HeartHandshake, title: "Health & wellbeing", body: "Health cover and genuine flexibility when life happens." },
  { icon: Trophy, title: "Meaningful impact", body: "Build software that helps African businesses and institutions grow." },
  { icon: Scale, title: "Fair & transparent", body: "Clear levels, honest feedback and equitable pay." },
];
