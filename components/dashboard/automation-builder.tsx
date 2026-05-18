import { ArrowUpRight, Power, Timer } from "lucide-react";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { demoAutomations } from "@/lib/demo-data";

export function AutomationBuilder() {
  return (
    <div className="grid gap-4">
      {demoAutomations.map((automation) => (
        <Card key={automation.id} className="p-5">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-xs uppercase tracking-[0.18em] text-white/40">{automation.trigger}</p>
                <StatusBadge value={automation.enabled ? "Ativo" : "Inativo"} tone={automation.enabled ? "active" : "inactive"} />
              </div>
              <h2 className="mt-3 text-xl font-semibold text-white">{automation.name}</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{automation.message}</p>
              <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1">
                  <Timer className="h-3.5 w-3.5 text-cyan" />
                  {automation.wait}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1">
                  <ArrowUpRight className="h-3.5 w-3.5 text-cyan" />
                  fluxo comercial pronto
                </span>
              </div>
            </div>
            <Button variant="outline">
              <Power className="mr-2 h-4 w-4" />
              {automation.enabled ? "Desativar" : "Ativar"}
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
