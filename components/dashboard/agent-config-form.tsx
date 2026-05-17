import { Save } from "lucide-react";
import { saveAgentAction } from "@/app/dashboard/agent/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { AgentRow } from "@/lib/dashboard/queries";

export const BASE_AGENT_PROMPT =
  "Voce e um vendedor digital profissional da empresa {{company_name}}. Seu objetivo e atender leads, responder duvidas, qualificar oportunidades, quebrar objecoes e conduzir o cliente para agendamento ou compra. Seja claro, humano, objetivo e persuasivo. Nunca invente informacoes. Quando nao souber responder, encaminhe para atendimento humano.";

export function AgentConfigForm({ agent, organizationName }: { agent: AgentRow | null; organizationName: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuracao do Agente IA</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={saveAgentAction} className="grid gap-5">
          <input type="hidden" name="agent_id" value={agent?.id ?? ""} />
          <div className="grid gap-4 md:grid-cols-2">
            <Field name="name" label="Nome do agente" defaultValue={agent?.name ?? "N710 Sales Agent"} />
            <Field name="niche" label="Nicho da empresa" defaultValue={agent?.niche ?? ""} />
            <Field name="voice_tone" label="Tom de voz" defaultValue={agent?.voice_tone ?? "Humano, consultivo e direto"} />
            <Field name="goal" label="Objetivo principal" defaultValue={agent?.goal ?? "Agendar oportunidades qualificadas"} />
            <Field name="business_hours" label="Horario de atendimento" defaultValue={agent?.business_hours ?? ""} />
            <Field
              name="initial_message"
              label="Mensagem inicial"
              defaultValue={agent?.initial_message ?? `Ola! Sou o assistente da ${organizationName}. Como posso te ajudar?`}
            />
          </div>
          <Area name="products_services" label="Produtos/servicos" defaultValue={agent?.products_services ?? ""} />
          <Area name="common_objections" label="Objecoes comuns" defaultValue={agent?.common_objections ?? ""} />
          <Area name="forbidden_answers" label="Respostas proibidas" defaultValue={agent?.forbidden_answers ?? ""} />
          <Area name="human_handoff_rules" label="Quando chamar humano" defaultValue={agent?.human_handoff_rules ?? ""} />
          <Area name="custom_prompt" label="Prompt personalizado" defaultValue={agent?.custom_prompt ?? BASE_AGENT_PROMPT} />
          <label className="flex items-center gap-3 text-sm text-muted-foreground">
            <input
              type="checkbox"
              name="is_active"
              defaultChecked={agent?.is_active ?? true}
              className="h-4 w-4 rounded border-white/20 bg-white/[0.04]"
            />
            Agente ativo para responder webhooks
          </label>
          <div>
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              Salvar agente
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function Field({ name, label, defaultValue }: { name: string; label: string; defaultValue: string }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} defaultValue={defaultValue} />
    </div>
  );
}

function Area({ name, label, defaultValue }: { name: string; label: string; defaultValue: string }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Textarea id={name} name={name} defaultValue={defaultValue} />
    </div>
  );
}
