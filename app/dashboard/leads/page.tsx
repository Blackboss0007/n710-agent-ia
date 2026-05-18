import { LeadPipelineBoard } from "@/components/dashboard/lead-pipeline-board";
import { LeadTable } from "@/components/dashboard/lead-table";
import { getLeadsData } from "@/lib/dashboard/queries";

export default async function LeadsPage() {
  const leads = await getLeadsData();

  return (
    <div className="space-y-6">
      <section className="hero-outline rounded-lg px-6 py-8">
        <div className="max-w-3xl">
          <div className="eyebrow-chip">crm pipeline</div>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white">Leads e pipeline</h1>
          <p className="mt-4 text-base leading-8 text-muted-foreground">
            Uma leitura visual para priorizar atendimento, mover oportunidades entre estagios e entender o que o funil esta pedindo agora.
          </p>
        </div>
      </section>
      <LeadPipelineBoard leads={leads} />
      <LeadTable leads={leads} />
    </div>
  );
}
