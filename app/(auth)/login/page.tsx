import { AuthCard } from "@/components/auth/auth-card";
import { redirectIfAuthenticated } from "@/lib/auth/session";

export default async function LoginPage({
  searchParams
}: {
  searchParams?: { message?: string; next?: string };
}) {
  await redirectIfAuthenticated();

  return (
    <div className="mx-auto flex justify-center">
      <AuthCard
        title="Entrar no N710"
        description="Acesse sua operacao comercial com IA, dashboards ao vivo e automacoes de atendimento."
        mode="login"
        nextPath={searchParams?.next}
        initialMessage={searchParams?.message}
      />
    </div>
  );
}
