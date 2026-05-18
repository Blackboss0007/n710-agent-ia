import { Bot, Sparkles, Zap } from "lucide-react";
import { AgentConfigForm } from "@/components/dashboard/agent-config-form";
import { Card, CardContent } from "@/components/ui/card";
import { getAgentData } from "@/lib/dashboard/queries";

export default async function AgentPage() {
  const { organization, agent } = await getAgentData();
  const overview = [
    { label: "Agente ativo", value: agent?.is_active ? "Online" : "Offline", icon: Bot },
    { label: "Tom atual", value: agent?.voice_tone || "Consultivo", icon: Sparkles },
    { label: "Objetivo", value: agent?.goal || "Agendar oportunidades", icon: Zap }
  ];

  return (
    <div className="space-y-6">
      <section className="hero-outline rounded-lg px-6 py-8">
        <div className="max-w-3xl">
          <div className="eyebrow-chip">agent command</div>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white">Central de agentes IA</h1>
          <p className="mt-4 text-base leading-8 text-muted-foreground">
            Defina tom, limites, servicos, regras de handoff e prompt base do vendedor digital da {organization?.name ?? "sua empresa"}.
          </p>
        </div>
      </section>
      <div className="grid gap-4 md:grid-cols-3">
        {overview.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-md border border-white/10 bg-white/[0.04] text-cyan">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-white/38">{label}</p>
                <p className="mt-2 text-lg font-semibold text-white">{value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <AgentConfigForm agent={agent} organizationName={organization?.name ?? "sua empresa"} />
    </div>
  );
}
