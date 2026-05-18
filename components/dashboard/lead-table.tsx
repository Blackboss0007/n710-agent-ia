"use client";

import { Download, Search } from "lucide-react";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import type { Lead } from "@/types/domain";

export function LeadTable({ leads }: { leads: Lead[] }) {
  return (
    <Card>
      <div className="flex flex-col gap-3 border-b border-white/10 p-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-white/40">crm ledger</p>
          <h2 className="mt-2 font-semibold text-white">Leads</h2>
          <p className="mt-2 text-sm text-muted-foreground">Busca, leitura comercial e exportacao preparada para operacao real.</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="w-full pl-9 sm:w-64" placeholder="Buscar lead" />
          </div>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            CSV
          </Button>
        </div>
      </div>
      {leads.length === 0 ? (
        <div className="p-4">
          <EmptyState title="Nenhum lead encontrado" description="Leads reais serao criados pelo webhook ou por importacoes futuras." />
        </div>
      ) : null}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead>Nicho</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Temperatura</TableHead>
              <TableHead>Origem</TableHead>
              <TableHead>Ultima interacao</TableHead>
              <TableHead>Valor potencial</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell>
                  <div className="font-medium text-white">{lead.name}</div>
                  <div className="text-xs text-muted-foreground">{lead.notes}</div>
                </TableCell>
                <TableCell>
                  <div>{lead.phone}</div>
                  <div className="text-xs text-muted-foreground">{lead.email}</div>
                </TableCell>
                <TableCell>{lead.niche}</TableCell>
                <TableCell className="capitalize">{lead.status}</TableCell>
                <TableCell>
                  <StatusBadge value="" tone={lead.temperature} />
                </TableCell>
                <TableCell>{lead.source}</TableCell>
                <TableCell>{lead.lastInteraction}</TableCell>
                <TableCell>{formatCurrency(lead.potentialValue)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
