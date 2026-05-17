import { AuthCard } from "@/components/auth/auth-card";
import { redirectIfAuthenticated } from "@/lib/auth/session";

export default async function ResetPasswordPage({
  searchParams
}: {
  searchParams?: { message?: string; type?: string };
}) {
  await redirectIfAuthenticated();

  return (
    <div className="mx-auto flex justify-center">
      <AuthCard
        title="Recuperar senha"
        description="Receba um link seguro para redefinir seu acesso."
        mode="reset"
        initialMessage={searchParams?.message}
        recoveryMode={searchParams?.type === "recovery"}
      />
    </div>
  );
}
