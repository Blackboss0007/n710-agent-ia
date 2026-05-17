"use server";

import { revalidatePath } from "next/cache";
import { requireOrganization } from "@/lib/dashboard/queries";

export async function saveSettingsAction(formData: FormData) {
  const { supabase, organization } = await requireOrganization();
  if (!organization) return;

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
