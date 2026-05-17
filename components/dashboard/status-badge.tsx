import { Badge } from "@/components/ui/badge";
import type { LeadTemperature } from "@/types/domain";

const temperatureMap: Record<LeadTemperature, { label: string; variant: "success" | "warning" | "muted" }> = {
  hot: { label: "Quente", variant: "success" },
  warm: { label: "Morno", variant: "warning" },
  cold: { label: "Frio", variant: "muted" }
};

export function StatusBadge({
  value,
  tone
}: {
  value: string;
  tone?: LeadTemperature | "active" | "inactive" | "connected" | "available" | "soon";
}) {
  if (tone === "hot" || tone === "warm" || tone === "cold") {
    const config = temperatureMap[tone];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  }

  if (tone === "active" || tone === "connected") {
    return <Badge variant="success">{value}</Badge>;
  }

  if (tone === "soon") {
    return <Badge variant="muted">{value}</Badge>;
  }

  if (tone === "available") {
    return <Badge variant="warning">{value}</Badge>;
  }

  if (tone === "inactive") {
    return <Badge variant="danger">{value}</Badge>;
  }

  return <Badge variant="default">{value}</Badge>;
}
