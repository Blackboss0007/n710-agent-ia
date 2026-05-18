"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bot,
  BrainCircuit,
  Cable,
  CreditCard,
  LayoutDashboard,
  MessageSquare,
  Orbit,
  Settings,
  Sparkles,
  Users,
  Workflow
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/conversations", label: "Conversas", icon: MessageSquare },
  { href: "/dashboard/leads", label: "Leads", icon: Users },
  { href: "/dashboard/agent", label: "Agente IA", icon: Bot },
  { href: "/dashboard/knowledge-base", label: "Base de Conhecimento", icon: BrainCircuit },
  { href: "/dashboard/automations", label: "Automacoes", icon: Workflow },
  { href: "/dashboard/integrations", label: "Integracoes", icon: Cable },
  { href: "/dashboard/plans", label: "Planos", icon: CreditCard },
  { href: "/dashboard/settings", label: "Configuracoes", icon: Settings }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      <aside className="hidden w-80 shrink-0 border-r border-white/10 bg-black/22 p-5 backdrop-blur-xl lg:block">
        <Link href="/" className="mb-8 flex items-center gap-3 rounded-md">
          <div className="flex h-11 w-11 items-center justify-center rounded-md border border-primary/30 bg-primary/20 text-white shadow-glow">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="font-display text-lg font-semibold text-white">N710 AI</p>
            <p className="text-xs uppercase tracking-[0.18em] text-white/40">sales command</p>
          </div>
        </Link>

        <div className="surface-muted mb-5 px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-white/40">engine</p>
              <p className="mt-2 font-medium text-white">Agent network online</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-md border border-cyan/20 bg-cyan/10 text-cyan">
              <Orbit className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Atendimento, qualificacao e follow-up coordenados em uma unica camada.
          </p>
        </div>

        <nav className="space-y-1.5">
          {items.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center justify-between rounded-md border border-transparent px-3 py-3 text-sm text-white/60 transition-all duration-200 hover:border-white/10 hover:bg-white/[0.04] hover:text-white",
                  active && "border-white/10 bg-white/[0.06] text-white"
                )}
              >
                <span className="flex items-center gap-3">
                  <span className={cn("flex h-9 w-9 items-center justify-center rounded-md border border-white/10 bg-white/[0.03]", active && "border-primary/20 bg-primary/12 text-white")}>
                    <Icon className="h-4 w-4" />
                  </span>
                  {item.label}
                </span>
                <span className={cn("h-2 w-2 rounded-full bg-transparent transition", active && "bg-cyan shadow-[0_0_16px_rgba(79,209,255,0.9)]")} />
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="fixed inset-x-0 bottom-4 z-40 px-4 lg:hidden">
        <div className="mx-auto flex max-w-xl items-center justify-between rounded-lg border border-white/10 bg-black/45 px-3 py-2 backdrop-blur-xl">
          {items.slice(0, 5).map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn("flex flex-1 flex-col items-center gap-1 rounded-md px-2 py-2 text-[11px] text-white/55", active && "text-white")}
              >
                <Icon className={cn("h-4 w-4", active && "text-cyan")} />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
