import { getPublicEnvStatus } from "@/lib/env/public";

type ServerEnvStatus = {
  ok: boolean;
  missing: string[];
  serviceRoleKey: string | null;
};

function read(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export function getServerEnvStatus(): ServerEnvStatus {
  const publicStatus = getPublicEnvStatus();
  const serviceRoleKey = read(process.env.SUPABASE_SERVICE_ROLE_KEY);
  const missing = [...publicStatus.missing];

  if (!serviceRoleKey) {
    missing.push("SUPABASE_SERVICE_ROLE_KEY");
  }

  return {
    ok: missing.length === 0,
    missing,
    serviceRoleKey
  };
}

export function getServerSupabaseAdminConfig() {
  const publicStatus = getPublicEnvStatus();
  const serverStatus = getServerEnvStatus();

  if (!serverStatus.ok || !publicStatus.supabaseUrl || !serverStatus.serviceRoleKey) {
    throw new Error(
      `Configuracao do Supabase Admin incompleta. Defina ${serverStatus.missing.join(", ")} no .env.local.`
    );
  }

  return {
    url: publicStatus.supabaseUrl,
    serviceRoleKey: serverStatus.serviceRoleKey
  };
}
