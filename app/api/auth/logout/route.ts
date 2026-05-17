import { NextResponse } from "next/server";
import { hasPublicSupabaseEnv } from "@/lib/env/public";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const destination = new URL("/login", request.url);

  if (!hasPublicSupabaseEnv()) {
    destination.searchParams.set("message", "Configure o Supabase para habilitar autenticacao.");
    return NextResponse.redirect(destination);
  }

  const supabase = createSupabaseServerClient();
  await supabase.auth.signOut();

  destination.searchParams.set("message", "Sessao encerrada com sucesso.");
  return NextResponse.redirect(destination);
}
