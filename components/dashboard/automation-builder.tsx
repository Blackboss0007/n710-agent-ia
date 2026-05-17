import { Power, Timer } from "lucide-react";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { demoAutomations } from "@/lib/demo-data";

export function AutomationBuilder() {
  return (
    <div className="grid gap-4">
      {demoAutomations.map((automation) => (
        <Card key={automation.id}>
          <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="font-semibold">{automation.name}</h2>
                <StatusBadge value={automation.enabled ? "Ativo" : "Inativo"} tone={automation.enabled ? "active" : "inactive"} />
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{automation.message}</p>
              <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                <span>Gatilho: {automation.trigger}</span>
                <span className="inline-flex items-center gap-1">
                  <Timer className="h-3.5 w-3.5" />
                  {automation.wait}
                </span>
              </div>
            </div>
            <Button variant="outline">
              <Power className="mr-2 h-4 w-4" />
              {automation.enabled ? "Desativar" : "Ativar"}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
