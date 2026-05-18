"use server";

import { revalidatePath } from "next/cache";
import { FALLBACK_ORGANIZATION_ID, requireOrganization } from "@/lib/dashboard/queries";

export async function saveSettingsAction(formData: FormData) {
  const { supabase, organization, schemaIssue } = await requireOrganization();
  if (!organization) return;
  if (schemaIssue || organization.id === FALLBACK_ORGANIZATION_ID) {
    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard");
    return;
  }

  const { error } = await supabase
    .from("organizations")
    .update({
      name: getValue(formData, "name") || organization.name,
      segment: getValue(formData, "segment"),
      whatsapp_phone: getValue(formData, "whatsapp_phone"),
      website: getValue(formData, "website"),
      metadata: {
        ...(organization.metadata ?? {}),
        onboarding_completed: true
      }
    })
    .eq("id", organization.id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard");
}

function getValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}
