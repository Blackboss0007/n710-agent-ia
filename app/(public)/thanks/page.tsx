import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ThanksPage() {
  return (
    <main className="container flex min-h-screen items-center justify-center py-16">
      <div className="max-w-xl rounded-lg border border-white/10 bg-white/[0.04] p-8 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-300" />
        <h1 className="mt-5 text-3xl font-semibold">Compra recebida</h1>
        <p className="mt-3 text-muted-foreground">Assim que a Cakto confirmar o pagamento, seu acesso será liberado automaticamente pelo webhook.</p>
        <Button className="mt-6" asChild>
          <Link href="/login">Acessar painel</Link>
        </Button>
      </div>
    </main>
  );
}
