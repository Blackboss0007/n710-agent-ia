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
  { href: "/dashboard/automations", label: "Automações", icon: Workflow },
  { href: "/dashboard/integrations", label: "Integrações", icon: Cable },
  { href: "/dashboard/plans", label: "Planos", icon: CreditCard },
  { href: "/dashboard/settings", label: "Configurações", icon: Settings }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-72 shrink-0 border-r border-white/10 bg-black/30 p-4 lg:block">
      <Link href="/" className="mb-8 flex items-center gap-3 rounded-md px-2 py-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-white shadow-glow">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <p className="font-semibold">N710</p>
          <p className="text-xs text-muted-foreground">AI Sales Agent</p>
        </div>
      </Link>
      <nav className="space-y-1">
        {items.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground",
                active && "bg-white/[0.08] text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
