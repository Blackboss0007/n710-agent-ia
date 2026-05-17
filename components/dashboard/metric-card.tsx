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
    <Card>
      <CardContent className="flex items-start justify-between p-5">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <strong className="mt-2 block text-2xl font-semibold tracking-tight">{value}</strong>
          <span className="mt-2 block text-xs text-emerald-300">{detail}</span>
        </div>
        <div className="rounded-md border border-white/10 bg-white/[0.05] p-2 text-violet">
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
}
