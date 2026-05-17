import { redirect } from "next/navigation";
import { hasPublicSupabaseEnv } from "@/lib/env/public";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getOptionalUser() {
  if (!hasPublicSupabaseEnv()) {
    return null;
  }

  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  return user ?? null;
}

export async function redirectIfAuthenticated() {
  const user = await getOptionalUser();

  if (user) {
    redirect("/dashboard");
  }
}
