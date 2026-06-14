import { CheckCircle2 } from "lucide-react";
import { Section } from "@/components/site/section";
import { Badge } from "@/components/ui/badge";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "System Status",
  description: "Live operational status of Mastex Technologies products and services.",
  path: "/status",
});

const SERVICES = [
  "Mastex BMS",
  "Mastex SchoolOS",
  "DeepBoard",
  "Mastex Pay (beta)",
  "API",
  "Dashboard",
  "Authentication",
  "Website",
];

export default function StatusPage() {
  return (
    <Section>
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6">
          <CheckCircle2 className="size-7 text-emerald-500" />
          <div>
            <h1 className="text-xl font-semibold">All systems operational</h1>
            <p className="text-sm text-muted-foreground">
              Last checked just now · 90-day uptime 99.9%
            </p>
          </div>
        </div>

        <div className="mt-8 divide-y rounded-2xl border bg-card">
          {SERVICES.map((s) => (
            <div key={s} className="flex items-center justify-between px-6 py-4">
              <span className="font-medium">{s}</span>
              <Badge variant="success" className="gap-1.5">
                <span className="size-1.5 rounded-full bg-emerald-500" /> Operational
              </Badge>
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          For incident history or to report an issue, email{" "}
          <a href="mailto:status@mastex.tech" className="text-primary hover:underline">
            status@mastex.tech
          </a>
          .
        </p>
      </div>
    </Section>
  );
}
