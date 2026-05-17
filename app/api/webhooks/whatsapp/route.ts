import { NextResponse } from "next/server";
import { z } from "zod";
import {
  classifyLeadTemperature,
  extractLeadData,
  generateAgentResponse,
  suggestNextAction,
  summarizeConversation
} from "@/lib/ai/openai";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { rateLimit, validateSharedSecret } from "@/lib/webhooks/security";

export const runtime = "nodejs";

const whatsappPayloadSchema = z.object({
  organization_id: z.string().uuid().optional(),
  tenant_slug: z.string().optional(),
  from: z.string().min(3),
  name: z.string().optional(),
  message: z.string().min(1),
  provider_message_id: z.string().optional(),
  channel: z.enum(["whatsapp", "instagram"]).default("whatsapp")
});

export async function POST(request: Request) {
  if (!rateLimit(`whatsapp:${request.headers.get("x-forwarded-for") ?? "local"}`, 120)) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  const secretError = validateSharedSecret(request, "WHATSAPP_WEBHOOK_SECRET", ["x-whatsapp-signature", "authorization"]);
  if (secretError) return secretError;

  const rawPayload = await request.json();
  const parsed = whatsappPayloadSchema.safeParse(rawPayload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload.", issues: parsed.error.flatten() }, { status: 400 });
  }

  const payload = parsed.data;
  const supabase = createSupabaseAdminClient();

  const organizationQuery = payload.organization_id
    ? supabase.from("organizations").select("*").eq("id", payload.organization_id).single()
    : supabase.from("organizations").select("*").eq("slug", payload.tenant_slug).single();

  const { data: organization, error: organizationError } = await organizationQuery;
  if (organizationError || !organization) {
    return NextResponse.json({ error: "Organization not found." }, { status: 404 });
  }

  const duplicateMessage = payload.provider_message_id
    ? await supabase
        .from("messages")
        .select("id")
        .eq("organization_id", organization.id)
        .eq("provider_message_id", payload.provider_message_id)
        .maybeSingle()
    : { data: null };

  if (duplicateMessage.data) {
    return NextResponse.json({ ok: true, duplicate: true });
  }

  const { data: lead, error: leadError } = await supabase
    .from("leads")
    .upsert(
      {
        organization_id: organization.id,
        name: payload.name || payload.from,
        phone: payload.from,
        source: payload.channel,
        status: "new",
        last_interaction_at: new Date().toISOString()
      },
      { onConflict: "organization_id,phone" }
    )
    .select()
    .single();

  if (leadError || !lead) {
    return NextResponse.json({ error: leadError?.message ?? "Lead could not be created." }, { status: 500 });
  }

  const { data: agent } = await supabase
    .from("agents")
    .select("*")
    .eq("organization_id", organization.id)
    .eq("is_active", true)
    .limit(1)
    .maybeSingle();

  const { data: conversation, error: conversationError } = await supabase
    .from("conversations")
    .upsert(
      {
        organization_id: organization.id,
        lead_id: lead.id,
        agent_id: agent?.id ?? null,
        channel: payload.channel,
        status: "active",
        updated_at: new Date().toISOString()
      },
      { onConflict: "organization_id,lead_id,channel" }
    )
    .select()
    .single();

  if (conversationError || !conversation) {
    return NextResponse.json({ error: conversationError?.message ?? "Conversation could not be created." }, { status: 500 });
  }

  await supabase.from("messages").insert({
    organization_id: organization.id,
    conversation_id: conversation.id,
    direction: "inbound",
    role: "lead",
    content: payload.message,
    provider_message_id: payload.provider_message_id
  });

  const [{ data: kb }, { data: history }] = await Promise.all([
    supabase.from("knowledge_base").select("*").eq("organization_id", organization.id),
    supabase.from("messages").select("role, content, created_at").eq("conversation_id", conversation.id).order("created_at", { ascending: true }).limit(30)
  ]);

  const response = await generateAgentResponse({
    companyName: organization.name,
    agentName: agent?.name || "N710 Sales Agent",
    voiceTone: agent?.voice_tone || "Humano, claro e persuasivo",
    goal: agent?.goal || "Qualificar o lead e conduzir para agendamento ou compra",
    productsServices: agent?.products_services || "",
    objections: agent?.common_objections || "",
    forbiddenAnswers: agent?.forbidden_answers || "",
    humanHandoffRules: agent?.human_handoff_rules || "Encaminhar quando houver duvida sensivel ou pedido explicito de humano",
    knowledgeBase: (kb || []).map((item) => `${item.title}: ${item.content}`).join("\n\n"),
    conversationHistory: (history || []).map((item) => ({
      role: item.role === "agent" ? "agent" : item.role === "human" ? "human" : "lead",
      content: item.content
    })),
    userMessage: payload.message
  });

  await supabase.from("messages").insert({
    organization_id: organization.id,
    conversation_id: conversation.id,
    direction: "outbound",
    role: "agent",
    content: response
  });

  const compactHistory = [...(history || []), { role: "agent", content: response, created_at: new Date().toISOString() }];
  const [summary, temperature, leadData, nextAction] = await Promise.all([
    summarizeConversation(compactHistory.map((item) => ({ role: item.role, content: item.content }))),
    classifyLeadTemperature(compactHistory.map((item) => ({ role: item.role, content: item.content }))),
    extractLeadData(compactHistory.map((item) => ({ role: item.role, content: item.content }))),
    suggestNextAction(compactHistory.map((item) => ({ role: item.role, content: item.content })))
  ]);

  await supabase.from("leads").update({
    name: leadData.name || lead.name,
    email: leadData.email || lead.email,
    temperature,
    notes: nextAction,
    last_interaction_at: new Date().toISOString()
  }).eq("id", lead.id).eq("organization_id", organization.id);

  await supabase.from("conversations").update({
    summary,
    status: "active",
    tags: [payload.channel, temperature, lead.status]
  }).eq("id", conversation.id).eq("organization_id", organization.id);

  await supabase.from("lead_events").insert({
    organization_id: organization.id,
    lead_id: lead.id,
    event_type: "message.received",
    metadata: {
      channel: payload.channel,
      next_action: nextAction
    }
  });

  await supabase.from("integrations").upsert({
    organization_id: organization.id,
    provider: payload.channel === "instagram" ? "instagram" : "whatsapp",
    status: "connected",
    connected_at: new Date().toISOString(),
    settings: { webhook: "/api/webhooks/whatsapp" }
  }, { onConflict: "organization_id,provider" });

  await supabase.from("webhooks").insert({
    organization_id: organization.id,
    provider: payload.channel,
    event: "message.received",
    payload: rawPayload,
    headers: {
      "x-whatsapp-signature": request.headers.get("x-whatsapp-signature")
    },
    status: "processed",
    processed_at: new Date().toISOString()
  });

  await supabase.from("audit_logs").insert({
    organization_id: organization.id,
    action: "whatsapp.message_processed",
    entity_type: "conversation",
    entity_id: conversation.id,
    metadata: { from: payload.from, next_action: nextAction }
  });

  return NextResponse.json({
    ok: true,
    conversation_id: conversation.id,
    reply: response,
    lead_temperature: temperature
  });
}
