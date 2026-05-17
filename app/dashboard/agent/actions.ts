"use server";

import { revalidatePath } from "next/cache";
import { requireOrganization } from "@/lib/dashboard/queries";

const fallbackPrompt =
  "Voce e um vendedor digital profissional da empresa {{company_name}}. Seu objetivo e atender leads, responder duvidas, qualificar oportunidades, quebrar objecoes e conduzir o cliente para agendamento ou compra. Seja claro, humano, objetivo e persuasivo. Nunca invente informacoes. Quando nao souber responder, encaminhe para atendimento humano.";

export async function saveAgentAction(formData: FormData) {
  const { supabase, organization } = await requireOrganization();
  if (!organization) return;

  const agentId = getValue(formData, "agent_id");
  const payload = {
    organization_id: organization.id,
    name: getValue(formData, "name") || "N710 Sales Agent",
    niche: getValue(formData, "niche"),
    voice_tone: getValue(formData, "voice_tone"),
    goal: getValue(formData, "goal"),
    products_services: getValue(formData, "products_services"),
    common_objections: getValue(formData, "common_objections"),
    forbidden_answers: getValue(formData, "forbidden_answers"),
    human_handoff_rules: getValue(formData, "human_handoff_rules"),
    business_hours: getValue(formData, "business_hours"),
    initial_message: getValue(formData, "initial_message"),
    custom_prompt: getValue(formData, "custom_prompt") || fallbackPrompt,
    is_active: formData.get("is_active") === "on"
  };

  const result = agentId
    ? await supabase.from("agents").update(payload).eq("id", agentId).eq("organization_id", organization.id)
    : await supabase.from("agents").insert(payload);

  if (result.error) {
    throw new Error(result.error.message);
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/agent");
}

function getValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}
