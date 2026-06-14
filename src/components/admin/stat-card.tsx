import { icons } from "lucide-react";
import { Card } from "@/components/ui/card";

export function StatCard({
  label,
  value,
  icon,
  hint,
}: {
  label: string;
  value: string | number;
  icon: string;
  hint?: string;
}) {
  const Icon = (icons as any)[icon] ?? icons.Activity;
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="inline-flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-4" />
        </span>
      </div>
      <div className="mt-3 text-3xl font-bold tracking-tight">{value}</div>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </Card>
  );
}
