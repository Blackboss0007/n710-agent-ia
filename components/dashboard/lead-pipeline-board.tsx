"use client";

import { useMemo, useState } from "react";
import { CircleDollarSign, GripVertical } from "lucide-react";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Card } from "@/components/ui/card";
import { cn, formatCurrency } from "@/lib/utils";
import type { Lead, LeadStatus } from "@/types/domain";

const columns: Array<{ key: LeadStatus; label: string }> = [
  { key: "new", label: "Novos" },
  { key: "qualified", label: "Qualificados" },
  { key: "scheduled", label: "Agendados" },
  { key: "won", label: "Ganhos" },
  { key: "lost", label: "Perdidos" }
];

export function LeadPipelineBoard({ leads }: { leads: Lead[] }) {
  const [board, setBoard] = useState(leads);

  const grouped = useMemo(() => {
    return columns.map((column) => ({
      ...column,
      items: board.filter((lead) => lead.status === column.key)
    }));
  }, [board]);

  function moveLead(leadId: string, status: LeadStatus) {
    setBoard((current) =>
      current.map((lead) => (lead.id === leadId ? { ...lead, status } : lead))
    );
  }

  if (leads.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-4 xl:grid-cols-5">
      {grouped.map((column) => (
        <Card
          key={column.key}
          className="min-h-[280px] p-4"
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            const leadId = event.dataTransfer.getData("text/plain");
            if (leadId) moveLead(leadId, column.key);
          }}
        >
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-white/38">{column.label}</p>
              <p className="mt-2 text-lg font-semibold text-white">{column.items.length}</p>
            </div>
            <div className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-xs text-muted-foreground">
              drag
            </div>
          </div>
          <div className="space-y-3">
            {column.items.map((lead) => (
              <div
                key={lead.id}
                draggable
                onDragStart={(event) => event.dataTransfer.setData("text/plain", lead.id)}
                className={cn("rounded-md border border-white/10 bg-white/[0.03] p-4 transition hover:border-white/20 hover:bg-white/[0.05]")}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-white">{lead.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{lead.source}</p>
                  </div>
                  <GripVertical className="h-4 w-4 shrink-0 text-white/30" />
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <StatusBadge value="" tone={lead.temperature} />
                  <span className="rounded-full border border-white/10 px-2 py-1 text-[11px] uppercase tracking-[0.16em] text-white/46">
                    {lead.niche}
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between gap-3 text-xs text-muted-foreground">
                  <span>{lead.lastInteraction}</span>
                  <span className="inline-flex items-center gap-1 text-white/75">
                    <CircleDollarSign className="h-3.5 w-3.5 text-cyan" />
                    {formatCurrency(lead.potentialValue)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}
