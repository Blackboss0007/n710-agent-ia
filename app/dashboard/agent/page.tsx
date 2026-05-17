import { AgentConfigForm } from "@/components/dashboard/agent-config-form";
import { getAgentData } from "@/lib/dashboard/queries";

export default async function AgentPage() {
  const { organization, agent } = await getAgentData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Agente IA</h1>
        <p className="text-muted-foreground">Treine o vendedor digital com contexto, limites e objetivo comercial reais do tenant.</p>
      </div>
      <AgentConfigForm agent={agent} organizationName={organization?.name ?? "sua empresa"} />
    </div>
  );
}
