import Link from "next/link";
import { Check } from "lucide-react";
import { Section, SectionHeader } from "@/components/site/section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/motion";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Pricing",
  description: "Simple, transparent pricing for every Mastex product. Pay as you grow.",
  path: "/pricing",
});

const TIERS = [
  {
    name: "Starter",
    price: "GHS 500",
    period: "/mo",
    description: "For small teams getting started.",
    features: ["Core product access", "1 branch / location", "Email support", "Standard reports"],
    cta: "Start free trial",
  },
  {
    name: "Growth",
    price: "GHS 1,000",
    period: "/mo",
    description: "For growing businesses scaling up.",
    features: [
      "Everything in Starter",
      "Up to 3 branches",
      "Business insights",
      "Priority support",
      "Advanced analytics",
    ],
    cta: "Choose Growth",
    featured: true,
  },
  {
    name: "Scale",
    price: "Custom",
    period: "",
    description: "For enterprises with bespoke needs.",
    features: [
      "Everything in Growth",
      "Unlimited branches",
      "Dedicated success manager",
      "API access & integrations",
      "SLA & onboarding",
    ],
    cta: "Talk to sales",
  },
];

export default function PricingPage() {
  return (
    <>
      <Section className="pb-8">
        <Reveal>
          <SectionHeader
            eyebrow="Pricing"
            title="Pricing that scales with you"
            description="Start small and grow. Every plan includes security, updates and the reliability you'd expect from enterprise software."
          />
        </Reveal>
      </Section>

      <Section className="pt-0">
        <div className="grid gap-6 lg:grid-cols-3">
          {TIERS.map((t) => (
            <div
              key={t.name}
              className={`flex flex-col rounded-2xl border p-8 ${
                t.featured ? "border-primary bg-primary/5 shadow-lg shadow-primary/5" : "bg-card"
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{t.name}</h3>
                {t.featured && <Badge>Most popular</Badge>}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{t.description}</p>
              <div className="mt-5 flex items-baseline gap-1">
                <span className="text-4xl font-bold tracking-tight">{t.price}</span>
                <span className="text-sm text-muted-foreground">{t.period}</span>
              </div>
              <ul className="mt-6 flex-1 space-y-3">
                {t.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="size-4 shrink-0 text-primary" /> {f}
                  </li>
                ))}
              </ul>
              <Button asChild className="mt-8" variant={t.featured ? "default" : "outline"}>
                <Link href="/contact">{t.cta}</Link>
              </Button>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-muted-foreground">
          Prices vary by product. See each{" "}
          <Link href="/products" className="text-primary hover:underline">
            product page
          </Link>{" "}
          for specifics, or{" "}
          <Link href="/contact" className="text-primary hover:underline">
            contact sales
          </Link>{" "}
          for a tailored quote.
        </p>
      </Section>
    </>
  );
}
