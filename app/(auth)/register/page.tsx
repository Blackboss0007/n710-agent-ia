import { AuthCard } from "@/components/auth/auth-card";
import { redirectIfAuthenticated } from "@/lib/auth/session";

export default async function RegisterPage({
  searchParams
}: {
  searchParams?: { message?: string };
}) {
  await redirectIfAuthenticated();

  return (
    <div className="mx-auto flex justify-center">
      <AuthCard
        title="Criar conta"
        description="Configure sua organizacao e comece a treinar seu agente."
        mode="register"
        initialMessage={searchParams?.message}
      />
    </div>
  );
}
