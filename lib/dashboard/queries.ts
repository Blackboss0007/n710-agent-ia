import { unstable_noStore as noStore } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Conversation, Lead, Message } from "@/types/domain";

type Organization = {
  id: string;
  name: string;
  slug: string;
  segment?: string | null;
  website?: string | null;
  whatsapp_phone?: string | null;
  metadata?: { onboarding_completed?: boolean } | null;
};

type AgentRow = {
  id: string;
  organization_id: string;
  name: string;
  niche: string | null;
  voice_tone: string | null;
  goal: string | null;
  products_services: string | null;
  common_objections: string | null;
  forbidden_answers: string | null;
  human_handoff_rules: string | null;
  business_hours: string | null;
  initial_message: string | null;
  custom_prompt: string | null;
  is_active: boolean;
};

type KnowledgeBaseRow = {
  id: string;
  organization_id: string;
  agent_id: string | null;
  title: string;
  content: string;
  category: string;
  source_type?: string | null;
  file_path?: string | null;
  updated_at: string;
};

type ConversationRow = {
  id: string;
  channel: string;
  status: string;
  summary: string | null;
  tags: string[] | null;
  updated_at: string;
  leads:
    | {
        name: string | null;
        temperature: "hot" | "warm" | "cold" | null;
      }
    | Array<{
        name: string | null;
        temperature: "hot" | "warm" | "cold" | null;
      }>
    | null;
  messages?: Array<{
    id: string;
    role: "lead" | "agent" | "human" | "system";
    content: string;
    created_at: string;
  }>;
};

export async function getTenantContext() {
  noStore();
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [{ data: profile }, { data: membership, error }] = await Promise.all([
    supabase.from("profiles").select("id, email, full_name, onboarding_completed").eq("id", user.id).maybeSingle(),
    supabase
    .from("organization_members")
    .select("organization_id, role, organizations(id, name, slug, segment, website, whatsapp_phone, metadata)")
    .eq("profile_id", user.id)
    .limit(1)
    .maybeSingle()
  ]);

  if (error) {
    throw new Error(error.message);
  }

  const organization = Array.isArray(membership?.organizations)
    ? membership?.organizations[0]
    : membership?.organizations;

  return {
    supabase,
    user,
    profile: profile ?? null,
    organization: (organization ?? null) as Organization | null,
    role: membership?.role as string | null
  };
}

export async function requireOrganization() {
  const context = await getTenantContext();

  if (!context.organization) {
    return context;
  }

  return context as typeof context & { organization: Organization };
}

export async function getDashboardData() {
  const { supabase, organization } = await requireOrganization();

  if (!organization) {
    return emptyDashboard();
  }

  const orgId = organization.id;
  const [
    totalLeads,
    activeConversations,
    scheduledLeads,
    hotLeads,
    coldLeads,
    wonLeads,
    humanConversations,
    leadsRevenue,
    recentConversations,
    agent
  ] = await Promise.all([
    countRows(supabase, "leads", orgId),
    countRows(supabase, "conversations", orgId, "status", "active"),
    countRows(supabase, "leads", orgId, "status", "scheduled"),
    countRows(supabase, "leads", orgId, "temperature", "hot"),
    countRows(supabase, "leads", orgId, "temperature", "cold"),
    countRows(supabase, "leads", orgId, "status", "won"),
    countRows(supabase, "conversations", orgId, "status", "human"),
    supabase.from("leads").select("potential_value, created_at").eq("organization_id", orgId),
    supabase
      .from("conversations")
      .select("id, channel, status, summary, tags, updated_at, leads(name, temperature)")
      .eq("organization_id", orgId)
      .order("updated_at", { ascending: false })
      .limit(5),
    supabase
      .from("agents")
      .select("id, name, is_active")
      .eq("organization_id", orgId)
      .eq("is_active", true)
      .limit(1)
      .maybeSingle()
  ]);

  const revenueRows = leadsRevenue.data ?? [];
  const revenue = revenueRows.reduce((sum, lead) => sum + Number(lead.potential_value ?? 0), 0);
  const conversionRate = totalLeads ? (wonLeads / totalLeads) * 100 : 0;

  return {
    organization,
    metrics: {
      totalLeads,
      activeConversations,
      conversionRate,
      scheduledLeads,
      revenue,
      hotLeads,
      coldLeads,
      alerts: humanConversations
    },
    agentOnline: Boolean(agent.data?.is_active),
    recentConversations: mapConversations((recentConversations.data ?? []) as ConversationRow[]),
    performance: buildPerformanceData(revenueRows)
  };
}

export async function getLeadsData() {
  const { supabase, organization } = await requireOrganization();
  if (!organization) return [];

  const { data, error } = await supabase
    .from("leads")
    .select("id, name, phone, email, niche, status, temperature, source, last_interaction_at, potential_value, notes, updated_at")
    .eq("organization_id", organization.id)
    .order("updated_at", { ascending: false })
    .limit(200);

  if (error) throw new Error(error.message);

  return (data ?? []).map((lead): Lead => ({
    id: lead.id,
    name: lead.name,
    phone: lead.phone ?? "-",
    email: lead.email ?? "-",
    niche: lead.niche ?? "-",
    status: lead.status,
    temperature: lead.temperature,
    source: lead.source ?? "-",
    lastInteraction: formatDate(lead.last_interaction_at ?? lead.updated_at),
    potentialValue: Number(lead.potential_value ?? 0),
    notes: lead.notes ?? ""
  }));
}

export async function getConversationsData() {
  const { supabase, organization } = await requireOrganization();
  if (!organization) return { conversations: [], selectedConversation: null };

  const { data, error } = await supabase
    .from("conversations")
    .select(
      "id, channel, status, summary, tags, updated_at, leads(name, temperature), messages(id, role, content, created_at)"
    )
    .eq("organization_id", organization.id)
    .order("updated_at", { ascending: false })
    .limit(30);

  if (error) throw new Error(error.message);

  const conversations = mapConversations((data ?? []) as ConversationRow[]);

  return {
    conversations,
    selectedConversation: conversations[0] ?? null
  };
}

export async function getAgentData() {
  const { supabase, organization, profile } = await requireOrganization();
  if (!organization) return { organization: null, profile: null, agent: null };

  const { data: agent, error } = await supabase
    .from("agents")
    .select("*")
    .eq("organization_id", organization.id)
    .order("is_active", { ascending: false })
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(error.message);

  return {
    organization,
    profile: profile ?? null,
    agent: agent as AgentRow | null
  };
}

export async function getKnowledgeBaseData() {
  const { supabase, organization } = await requireOrganization();
  if (!organization) return { organization: null, agent: null, items: [] };

  const [{ data: agent, error: agentError }, { data: items, error: itemsError }] = await Promise.all([
    supabase
      .from("agents")
      .select("id, name")
      .eq("organization_id", organization.id)
      .eq("is_active", true)
      .limit(1)
      .maybeSingle(),
    supabase
      .from("knowledge_base")
      .select("id, organization_id, agent_id, title, content, category, source_type, file_path, updated_at")
      .eq("organization_id", organization.id)
      .order("updated_at", { ascending: false })
  ]);

  if (agentError) throw new Error(agentError.message);
  if (itemsError) throw new Error(itemsError.message);

  return {
    organization,
    agent,
    items: (items ?? []) as KnowledgeBaseRow[]
  };
}

export async function getSettingsData() {
  const { supabase, organization, profile } = await requireOrganization();
  if (!organization) {
    return {
      organization: null,
      profile: null,
      plan: null,
      integrations: [],
      statuses: buildStatusSummary([], false)
    };
  }

  const [{ data: plan }, { data: integrations }] = await Promise.all([
    supabase
      .from("subscriptions")
      .select("plan, status, current_period_end")
      .eq("organization_id", organization.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("integrations")
      .select("provider, status, last_error, connected_at, settings")
      .eq("organization_id", organization.id)
      .order("provider", { ascending: true })
  ]);

  const envOpenAI = Boolean(process.env.OPENAI_API_KEY?.trim());

  return {
    organization,
    profile: profile ?? null,
    plan: plan ?? null,
    integrations: integrations ?? [],
    statuses: buildStatusSummary(integrations ?? [], envOpenAI)
  };
}

function buildStatusSummary(
  integrations: Array<{ provider: string; status: string; last_error?: string | null }> | [],
  openAIConfigured: boolean
) {
  const byProvider = new Map(integrations.map((item) => [item.provider, item.status]));

  return {
    supabase: "connected",
    openai: openAIConfigured ? byProvider.get("openai") ?? "connected" : "available",
    whatsapp: byProvider.get("whatsapp") ?? "available",
    cakto: byProvider.get("cakto") ?? "available"
  };
}

async function countRows(
  supabase: ReturnType<typeof createSupabaseServerClient>,
  table: string,
  organizationId: string,
  column?: string,
  value?: string
) {
  let query = supabase.from(table).select("id", { count: "exact", head: true }).eq("organization_id", organizationId);

  if (column && value) {
    query = query.eq(column, value);
  }

  const { count, error } = await query;
  if (error) throw new Error(error.message);
  return count ?? 0;
}

function mapConversations(rows: ConversationRow[]): Conversation[] {
  return rows.map((conversation) => {
    const messages = [...(conversation.messages ?? [])].sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    return {
      id: conversation.id,
      leadName: normalizeLead(conversation.leads)?.name || "Lead sem nome",
      channel: conversation.channel === "instagram" ? "instagram" : "whatsapp",
      status: conversation.status === "human" ? "human" : conversation.status === "waiting" ? "waiting" : conversation.status === "closed" ? "closed" : "active",
      temperature: normalizeLead(conversation.leads)?.temperature || "cold",
      summary: conversation.summary || "Ainda sem resumo gerado pela IA.",
      tags: conversation.tags ?? [],
      messages: messages.map((message): Message => ({
        id: message.id,
        role: message.role,
        content: message.content,
        createdAt: formatTime(message.created_at)
      }))
    };
  });
}

function normalizeLead(lead: ConversationRow["leads"]) {
  return Array.isArray(lead) ? lead[0] ?? null : lead;
}

function buildPerformanceData(rows: Array<{ potential_value: number | string | null; created_at: string }>) {
  const now = new Date();
  const buckets = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(now);
    date.setDate(now.getDate() - (6 - index));
    return {
      key: date.toISOString().slice(0, 10),
      day: date.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", ""),
      leads: 0,
      conversions: 0
    };
  });

  for (const row of rows) {
    const key = new Date(row.created_at).toISOString().slice(0, 10);
    const bucket = buckets.find((item) => item.key === key);
    if (bucket) {
      bucket.leads += 1;
      if (Number(row.potential_value ?? 0) > 0) {
        bucket.conversions += 1;
      }
    }
  }

  return buckets.map(({ key: _key, ...bucket }) => bucket);
}

function emptyDashboard() {
  return {
    organization: null,
    metrics: {
      totalLeads: 0,
      activeConversations: 0,
      conversionRate: 0,
      scheduledLeads: 0,
      revenue: 0,
      hotLeads: 0,
      coldLeads: 0,
      alerts: 0
    },
    agentOnline: false,
    recentConversations: [],
    performance: []
  };
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

export type { AgentRow, KnowledgeBaseRow };
