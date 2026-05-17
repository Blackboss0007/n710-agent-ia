import { IntegrationCard } from "@/components/dashboard/integration-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSettingsData } from "@/lib/dashboard/queries";

export default async function IntegrationsPage() {
  const { integrations } = await getSettingsData();

  const cards = [
    {
      id: "supabase",
      name: "Supabase",
      description: "Banco, Auth e Storage do projeto.",
      status: normalizeStatus(integrations.find((item) => item.provider === "supabase")?.status)
    },
    {
      id: "openai",
      name: "OpenAI",
      description: "Geracao de respostas do agente, resumos e classificacao de leads.",
      status: normalizeStatus(integrations.find((item) => item.provider === "openai")?.status)
    },
    {
      id: "whatsapp",
      name: "WhatsApp Webhook",
      description: "Recebe mensagens, cria leads e devolve respostas prontas do agente.",
      status: normalizeStatus(integrations.find((item) => item.provider === "whatsapp")?.status)
    },
    {
      id: "cakto",
      name: "Cakto",
      description: "Libera acesso apos compra aprovada e registra subscription e payment.",
      status: normalizeStatus(integrations.find((item) => item.provider === "cakto")?.status)
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Integracoes</h1>
        <p className="text-muted-foreground">Status de conexao e instrucoes objetivas para configuracao em producao.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {cards.map((integration) => (
          <IntegrationCard key={integration.id} integration={integration} />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Instrucoes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>Supabase: configure Auth URLs, rode `supabase/schema.sql` e preencha as chaves no ambiente.</p>
          <p>OpenAI: defina `OPENAI_API_KEY` no ambiente do servidor. A chave nunca vai para o client.</p>
          <p>WhatsApp: aponte o provedor para `POST /api/webhooks/whatsapp` com `X-Whatsapp-Signature`.</p>
          <p>Cakto: aponte o webhook para `POST /api/webhooks/cakto` com `X-Cakto-Signature`.</p>
        </CardContent>
      </Card>
    </div>
  );
}

function normalizeStatus(status?: string | null): "connected" | "available" | "soon" {
  if (status === "connected") return "connected";
  if (status === "soon") return "soon";
  return "available";
}
