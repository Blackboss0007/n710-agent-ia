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
        description="Acesse seu painel comercial de IA."
        mode="login"
        nextPath={searchParams?.next}
        initialMessage={searchParams?.message}
      />
    </div>
  );
}
