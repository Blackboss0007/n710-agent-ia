import Link from "next/link";
import { Bell, LogOut, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Topbar({ organizationName = "Organização" }: { organizationName?: string }) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-background/85 px-4 py-3 backdrop-blur-xl lg:px-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Abrir menu">
          <Menu className="h-5 w-5" />
        </Button>
        <div className="relative max-w-md flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Buscar lead, conversa ou integração" />
        </div>
        <Button variant="outline" size="icon" aria-label="Notificações">
          <Bell className="h-4 w-4" />
        </Button>
        <div className="hidden max-w-56 truncate rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-sm md:block">
          {organizationName}
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
