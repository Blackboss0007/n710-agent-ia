"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getPublicEnvStatus } from "@/lib/env/public";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function AuthCard({
  title,
  description,
  mode,
  nextPath,
  initialMessage,
  recoveryMode
}: {
  title: string;
  description: string;
  mode: "login" | "register" | "reset";
  nextPath?: string;
  initialMessage?: string;
  recoveryMode?: boolean;
}) {
  const router = useRouter();
  const envStatus = getPublicEnvStatus();
  const isRecoveryFlow = mode === "reset" && recoveryMode;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState(initialMessage ?? "");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    if (!envStatus.ok) {
      setLoading(false);
      setMessage(`Configure ${envStatus.missing.join(", ")} no .env.local para habilitar autenticacao.`);
      return;
    }

    const supabase = createSupabaseBrowserClient();
    const origin = window.location.origin;
    const result =
      isRecoveryFlow
        ? await supabase.auth.updateUser({ password })
        : mode === "login"
        ? await supabase.auth.signInWithPassword({ email, password })
        : mode === "register"
          ? await supabase.auth.signUp({
              email,
              password,
              options: {
                data: { name },
                emailRedirectTo: `${origin}/api/auth/callback`
              }
            })
          : await supabase.auth.resetPasswordForEmail(email, {
              redirectTo: `${origin}/reset-password`
            });

    setLoading(false);

    if (result.error) {
      setMessage(result.error.message);
      return;
    }

    if (mode === "reset" && !isRecoveryFlow) {
      setMessage("Enviamos as instrucoes de recuperacao para seu email.");
      return;
    }

    if (isRecoveryFlow) {
      setMessage("Senha atualizada com sucesso.");
      router.push("/login?message=Senha redefinida com sucesso.");
      router.refresh();
      return;
    }

    if (mode === "register" && !("session" in result.data && result.data.session)) {
      router.push("/login?message=Conta criada com sucesso.");
      router.refresh();
      return;
    }

    router.push(nextPath || "/dashboard");
    router.refresh();
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-md bg-primary shadow-glow">
          <Sparkles className="h-5 w-5" />
        </div>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {mode === "register" ? (
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Seu nome" required />
            </div>
          ) : null}
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="voce@empresa.com" required />
          </div>
          {mode !== "reset" || isRecoveryFlow ? (
            <div className="space-y-2">
              <Label>{isRecoveryFlow ? "Nova senha" : "Senha"}</Label>
              <Input value={password} onChange={(event) => setPassword(event.target.value)} type="password" placeholder={isRecoveryFlow ? "Defina sua nova senha" : "Sua senha"} required minLength={6} />
            </div>
          ) : null}
          <Button className="w-full" type="submit" disabled={loading || !envStatus.ok}>
            {loading
              ? "Processando..."
              : mode === "login"
                ? "Entrar"
                : mode === "register"
                  ? "Criar conta"
                  : isRecoveryFlow
                    ? "Salvar nova senha"
                    : "Enviar recuperacao"}
          </Button>
        </form>
        {message ? <p className="mt-4 rounded-md border border-white/10 bg-white/[0.04] p-3 text-sm text-muted-foreground">{message}</p> : null}
        {!envStatus.ok ? (
          <p className="mt-4 rounded-md border border-amber-400/20 bg-amber-400/10 p-3 text-sm text-amber-200">
            Faltam variaveis obrigatorias: {envStatus.missing.join(", ")}.
          </p>
        ) : null}
        <div className="mt-5 text-center text-sm text-muted-foreground">
          {mode === "login" ? (
            <>
              <Link className="text-violet hover:underline" href="/reset-password">Esqueci minha senha</Link>
              <span className="mx-2">•</span>
              <Link className="text-violet hover:underline" href="/register">Criar conta</Link>
            </>
          ) : (
            <Link className="text-violet hover:underline" href="/login">Voltar para login</Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
