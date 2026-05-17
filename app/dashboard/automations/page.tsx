import { AutomationBuilder } from "@/components/dashboard/automation-builder";

export default function AutomationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Automações</h1>
        <p className="text-muted-foreground">Fluxos de novo lead, follow-up, orçamento, confirmação e pós-atendimento.</p>
      </div>
      <AutomationBuilder />
    </div>
  );
}
