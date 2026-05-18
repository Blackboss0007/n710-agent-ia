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
        description="Ative sua organizacao, conecte seu contexto comercial e lance seu primeiro agente IA."
        mode="register"
        initialMessage={searchParams?.message}
      />
    </div>
  );
}
