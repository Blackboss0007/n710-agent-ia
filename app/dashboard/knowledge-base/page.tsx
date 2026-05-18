import { KnowledgeBaseEditor } from "@/components/dashboard/knowledge-base-editor";
import { getKnowledgeBaseData } from "@/lib/dashboard/queries";

export default async function KnowledgeBasePage() {
  const { agent, items } = await getKnowledgeBaseData();

  return (
    <div className="space-y-6">
      <section className="hero-outline rounded-lg px-6 py-8">
        <div className="max-w-3xl">
          <div className="eyebrow-chip">knowledge layer</div>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white">Base de conhecimento</h1>
          <p className="mt-4 text-base leading-8 text-muted-foreground">
            Alimente a memoria operacional do agente com precos, politicas, FAQs e documentos privados da operacao.
          </p>
        </div>
      </section>
      <KnowledgeBaseEditor items={items} agentId={agent?.id ?? null} />
    </div>
  );
}
