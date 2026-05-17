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
      <div className="flex flex-col gap-3 border-b border-white/10 p-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-semibold">Leads</h2>
          <p className="text-sm text-muted-foreground">Filtros, busca e exportação CSV preparados para dados reais.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="w-56 pl-9" placeholder="Buscar" />
          </div>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            CSV
          </Button>
        </div>
      </div>
      {leads.length === 0 ? (
        <div className="p-4">
          <EmptyState title="Nenhum lead encontrado" description="Leads reais serão criados pelo webhook ou por importações futuras." />
        </div>
      ) : null}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Contato</TableHead>
            <TableHead>Nicho</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Temperatura</TableHead>
            <TableHead>Origem</TableHead>
            <TableHead>Última interação</TableHead>
            <TableHead>Valor potencial</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <TableRow key={lead.id}>
              <TableCell>
                <div className="font-medium">{lead.name}</div>
                <div className="text-xs text-muted-foreground">{lead.notes}</div>
              </TableCell>
              <TableCell>
                <div>{lead.phone}</div>
                <div className="text-xs text-muted-foreground">{lead.email}</div>
              </TableCell>
              <TableCell>{lead.niche}</TableCell>
              <TableCell>{lead.status}</TableCell>
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
    </Card>
  );
}
