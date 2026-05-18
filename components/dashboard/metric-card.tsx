import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function MetricCard({
  title,
  value,
  detail,
  icon: Icon
}: {
  title: string;
  value: string;
  detail: string;
  icon: LucideIcon;
}) {
  return (
    <Card className="relative">
      <CardContent className="flex items-start justify-between p-5">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.18em] text-white/38">{title}</p>
          <strong className="mt-3 block text-3xl font-semibold tracking-tight text-white">{value}</strong>
          <span className="mt-3 block text-sm text-muted-foreground">{detail}</span>
        </div>
        <div className="rounded-md border border-white/10 bg-white/[0.05] p-3 text-cyan">
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
}
