import { createClient } from "@supabase/supabase-js";
import { getServerSupabaseAdminConfig } from "@/lib/env/server";

export function createSupabaseAdminClient() {
  const { url, serviceRoleKey } = getServerSupabaseAdminConfig();

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}
