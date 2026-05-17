export type PublicEnvStatus = {
  ok: boolean;
  missing: string[];
  supabaseUrl: string | null;
  supabaseAnonKey: string | null;
  appUrl: string;
};

function read(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export function getPublicEnvStatus(): PublicEnvStatus {
  const supabaseUrl = read(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const supabaseAnonKey = read(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const appUrl = read(process.env.NEXT_PUBLIC_APP_URL) ?? "http://localhost:3000";
  const missing: string[] = [];

  if (!supabaseUrl) {
    missing.push("NEXT_PUBLIC_SUPABASE_URL");
  }

  if (!supabaseAnonKey) {
    missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  return {
    ok: missing.length === 0,
    missing,
    supabaseUrl,
    supabaseAnonKey,
    appUrl
  };
}

export function hasPublicSupabaseEnv() {
  return getPublicEnvStatus().ok;
}

export function getPublicSupabaseConfig() {
  const status = getPublicEnvStatus();

  if (!status.ok || !status.supabaseUrl || !status.supabaseAnonKey) {
    throw new Error(
      `Configuracao do Supabase incompleta. Defina ${status.missing.join(", ")} no .env.local.`
    );
  }

  return {
    url: status.supabaseUrl,
    anonKey: status.supabaseAnonKey,
    appUrl: status.appUrl
  };
}
