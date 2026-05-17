import { redirect } from "next/navigation";
import { SetupAlert } from "@/components/app/setup-alert";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { getTenantContext } from "@/lib/dashboard/queries";
import { getPublicEnvStatus } from "@/lib/env/public";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const envStatus = getPublicEnvStatus();

  if (!envStatus.ok) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4 py-12">
        <SetupAlert
          title="Configuracao do Supabase pendente"
          description="O dashboard esta pronto, mas precisa das chaves publicas do Supabase no .env.local para autenticar e carregar dados."
          missing={envStatus.missing}
        />
      </main>
    );
  }

  const { organization, profile } = await getTenantContext();

  const onboardingComplete =
    profile?.onboarding_completed ||
    Boolean((organization?.metadata as { onboarding_completed?: boolean } | null)?.onboarding_completed);

  if (!onboardingComplete) {
    redirect("/onboarding");
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <Topbar organizationName={organization?.name ?? "Sem organizacao"} />
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
