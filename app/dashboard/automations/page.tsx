import { AutomationBuilder } from "@/components/dashboard/automation-builder";

export default function AutomationsPage() {
  return (
    <div className="space-y-6">
      <section className="hero-outline rounded-lg px-6 py-8">
        <div className="max-w-3xl">
          <div className="eyebrow-chip">automation matrix</div>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white">Automacoes</h1>
          <p className="mt-4 text-base leading-8 text-muted-foreground">
            Fluxos para novo lead, follow-up, orcamento, confirmacao e pos-atendimento com cara de orquestracao premium.
          </p>
        </div>
      </section>
      <AutomationBuilder />
    </div>
  );
}
