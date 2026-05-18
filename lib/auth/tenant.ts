import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getCurrentUserOrganization() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, organization: null, profile: null, role: null };
  }

  const [{ data: profile, error: profileError }, { data: membership, error: membershipError }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
    supabase
      .from("organization_members")
      .select("organization_id, role, organizations(*)")
      .eq("profile_id", user.id)
      .limit(1)
      .maybeSingle()
  ]);

  const schemaError = [profileError?.message, membershipError?.message].find((message) =>
    /Could not find the table|schema cache/i.test(message ?? "")
  );

  if (schemaError) {
    return { user, organization: null, profile: null, role: null, schemaIssue: schemaError };
  }

  return {
    user,
    profile: profile ?? null,
    organization: membership?.organizations ?? null,
    role: membership?.role ?? null,
    schemaIssue: null
  };
}
