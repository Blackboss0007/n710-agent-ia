import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getCurrentUserOrganization() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, organization: null, profile: null, role: null };
  }

  const [{ data: profile }, { data: membership }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
    supabase
      .from("organization_members")
      .select("organization_id, role, organizations(*)")
      .eq("profile_id", user.id)
      .limit(1)
      .maybeSingle()
  ]);

  return {
    user,
    profile: profile ?? null,
    organization: membership?.organizations ?? null,
    role: membership?.role ?? null
  };
}
