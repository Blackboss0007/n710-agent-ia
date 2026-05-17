import { Cable, Settings } from "lucide-react";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Integration } from "@/types/domain";

export function IntegrationCard({ integration }: { integration: Integration }) {
  const statusLabel = integration.status === "connected" ? "Conectado" : integration.status === "soon" ? "Em breve" : "Disponível";

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white/[0.06] text-violet">
              <Cable className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-semibold">{integration.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{integration.description}</p>
            </div>
          </div>
          <StatusBadge value={statusLabel} tone={integration.status} />
        </div>
        <Button className="mt-5" variant="outline" disabled={integration.status === "soon"}>
          <Settings className="mr-2 h-4 w-4" />
          Configurar
        </Button>
      </CardContent>
    </Card>
  );
}
