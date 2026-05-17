"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireOrganization } from "@/lib/dashboard/queries";

export async function completeOnboardingAction(formData: FormData) {
  const { supabase, organization, user } = await requireOrganization();

  if (!organization) {
    redirect("/login");
  }

  const payload = {
    name: getValue(formData, "company_name") || organization.name,
    segment: getValue(formData, "segment"),
    website: getValue(formData, "website"),
    whatsapp_phone: getValue(formData, "whatsapp_phone"),
    metadata: {
      onboarding_completed: true
    }
  };

  const { error: orgError } = await supabase
    .from("organizations")
    .update(payload)
    .eq("id", organization.id);

  if (orgError) {
    throw new Error(orgError.message);
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      full_name: getValue(formData, "owner_name") || undefined,
      onboarding_completed: true
    })
    .eq("id", user.id);

  if (profileError) {
    throw new Error(profileError.message);
  }

  const agentUpdate = {
    name: getValue(formData, "agent_name") || "N710 Sales Agent",
    niche: getValue(formData, "segment"),
    products_services: getValue(formData, "products_services"),
    voice_tone: getValue(formData, "voice_tone"),
    business_hours: getValue(formData, "business_hours"),
    common_objections: getValue(formData, "common_objections"),
    initial_message: getValue(formData, "initial_message"),
    goal: "Atender leads, responder duvidas e converter em agendamento ou compra",
    human_handoff_rules: "Encaminhar para humano quando houver pedido explicito, duvida sensivel ou proposta pronta para fechamento.",
    is_active: true
  };

  const { data: currentAgent } = await supabase
    .from("agents")
    .select("id")
    .eq("organization_id", organization.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  const agentResult = currentAgent?.id
    ? await supabase.from("agents").update(agentUpdate).eq("id", currentAgent.id).eq("organization_id", organization.id)
    : await supabase.from("agents").insert({
        organization_id: organization.id,
        ...agentUpdate
      });

  if (agentResult.error) {
    throw new Error(agentResult.error.message);
  }

  await supabase.from("integrations").upsert(
    [
      { organization_id: organization.id, provider: "supabase", status: "connected", connected_at: new Date().toISOString() },
      { organization_id: organization.id, provider: "openai", status: process.env.OPENAI_API_KEY ? "connected" : "available" },
      { organization_id: organization.id, provider: "whatsapp", status: "available" },
      { organization_id: organization.id, provider: "cakto", status: "available" }
    ],
    { onConflict: "organization_id,provider" }
  );

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard/integrations");
  redirect("/dashboard");
}

function getValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}
