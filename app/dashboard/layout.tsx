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

  const { organization, profile, schemaIssue } = await getTenantContext();

  const onboardingComplete =
    profile?.onboarding_completed ||
    Boolean((organization?.metadata as { onboarding_completed?: boolean } | null)?.onboarding_completed);

  if (!schemaIssue && !onboardingComplete) {
    redirect("/onboarding");
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="relative min-w-0 flex-1">
        <div className="pointer-events-none absolute inset-0 dashboard-grid opacity-50" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[linear-gradient(180deg,rgba(115,81,255,0.16),transparent)]" />
        <div className="relative">
          <Topbar organizationName={organization?.name ?? "Sem organizacao"} />
          <main className="p-4 pb-24 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
