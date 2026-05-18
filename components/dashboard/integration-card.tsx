import { Cable, Settings } from "lucide-react";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Integration } from "@/types/domain";

export function IntegrationCard({ integration }: { integration: Integration }) {
  const statusLabel =
    integration.status === "connected" ? "Conectado" : integration.status === "soon" ? "Em breve" : "Disponivel";

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-md border border-white/10 bg-white/[0.04] text-cyan">
            <Cable className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-white/40">integration</p>
            <h2 className="mt-2 font-semibold text-white">{integration.name}</h2>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">{integration.description}</p>
          </div>
        </div>
        <StatusBadge value={statusLabel} tone={integration.status} />
      </div>
      <Button className="mt-5" variant="outline" disabled={integration.status === "soon"}>
        <Settings className="mr-2 h-4 w-4" />
        Configurar
      </Button>
    </Card>
  );
}
