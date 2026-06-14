import Image from "next/image";
import { Mail, MapPin, Phone, Handshake, Briefcase, MessageSquare } from "lucide-react";
import { Section } from "@/components/site/section";
import { LeadForm } from "@/components/site/lead-form";
import { Reveal } from "@/components/motion";
import { getSetting } from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Contact",
  description: "Talk to the Mastex team — sales, partnerships and general enquiries.",
  path: "/contact",
});

export default async function ContactPage() {
  const company = await getSetting<any>("company.details");

  return (
    <>
      {/* Hero banner */}
      <section className="relative overflow-hidden bg-[#070b16] text-white">
        <Image
          src="/images/city-accra.jpg"
          alt="Accra, Ghana"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[#060a14]/80" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1838]/70 via-transparent to-[#1d4ed8]/30" aria-hidden />
        <div className="container-page relative py-20 sm:py-24">
          <Reveal className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-300">Contact</p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-balance text-white sm:text-5xl">
              Let&apos;s build something together.
            </h1>
            <p className="mt-4 text-lg text-white/75">
              Whether you&apos;re exploring a product, a partnership or a custom build, our team is
              ready to help.
            </p>
          </Reveal>
        </div>
      </section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <Reveal>
            <h2 className="text-xl font-semibold">Get in touch</h2>
            <div className="mt-6 space-y-5">
            <ContactRow icon={Mail} label="Email" value={company?.email ?? "hello@mastex.tech"} href={`mailto:${company?.email ?? "hello@mastex.tech"}`} />
            {company?.phone && (
              <ContactRow icon={Phone} label="Phone" value={company.phone} href={`tel:${company.phone}`} />
            )}
            <ContactRow icon={MapPin} label="Office" value={company?.address ?? "Accra, Ghana"} />
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {ENQUIRY_TYPES.map((t) => (
              <div key={t.label} className="rounded-xl border bg-card p-4">
                <t.icon className="size-5 text-primary" />
                <div className="mt-2 text-sm font-medium">{t.label}</div>
                <div className="text-xs text-muted-foreground">{t.desc}</div>
              </div>
            ))}
          </div>
        </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-2xl border bg-card p-6 sm:p-8">
              <LeadForm type="SALES" source="/contact" />
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}

function ContactRow({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: any;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div className="flex items-center gap-4">
      <span className="inline-flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="size-5" />
      </span>
      <div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="font-medium">{value}</div>
      </div>
    </div>
  );
  return href ? (
    <a href={href} className="block transition-opacity hover:opacity-80">
      {content}
    </a>
  ) : (
    content
  );
}

const ENQUIRY_TYPES = [
  { icon: MessageSquare, label: "Sales", desc: "Pricing & demos" },
  { icon: Handshake, label: "Partnerships", desc: "Work with us" },
  { icon: Briefcase, label: "Careers", desc: "Join the team" },
];
