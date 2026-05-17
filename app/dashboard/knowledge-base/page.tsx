import { KnowledgeBaseEditor } from "@/components/dashboard/knowledge-base-editor";
import { getKnowledgeBaseData } from "@/lib/dashboard/queries";

export default async function KnowledgeBasePage() {
  const { agent, items } = await getKnowledgeBaseData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Base de Conhecimento</h1>
        <p className="text-muted-foreground">Documentos, perguntas e informacoes usadas no treinamento do agente ativo.</p>
      </div>
      <KnowledgeBaseEditor items={items} agentId={agent?.id ?? null} />
    </div>
  );
}
