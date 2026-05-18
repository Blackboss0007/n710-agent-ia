import Link from "next/link";
import { Bell, Command, LogOut, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Topbar({ organizationName = "Organizacao" }: { organizationName?: string }) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-background/70 px-4 py-4 backdrop-blur-xl lg:px-8">
      <div className="flex flex-wrap items-center gap-3">
        <div className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white/70 lg:hidden">
          N710 AI
        </div>
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Buscar lead, conversa ou integracao" />
        </div>
        <div className="hidden items-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white/68 md:flex">
          <Command className="h-4 w-4 text-cyan" />
          quick ops
        </div>
        <Button variant="outline" size="icon" aria-label="Notificacoes">
          <Bell className="h-4 w-4" />
        </Button>
        <div className="hidden min-w-[180px] max-w-64 truncate rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 md:block">
          <p className="text-[11px] uppercase tracking-[0.16em] text-white/42">workspace</p>
          <p className="truncate text-sm text-white">{organizationName}</p>
        </div>
        <div className="hidden items-center gap-2 rounded-md border border-primary/20 bg-primary/10 px-3 py-2 text-sm text-white xl:flex">
          <Sparkles className="h-4 w-4 text-cyan" />
          AI insights on
        </div>
        <Button variant="outline" asChild>
          <Link href="/api/auth/logout">
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Link>
        </Button>
      </div>
    </header>
  );
}
