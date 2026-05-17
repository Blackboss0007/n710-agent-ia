import { AlertTriangle, CalendarCheck, Flame, MessageSquare, Target, TrendingUp, Users, Wallet } from "lucide-react";
import { ConversationList } from "@/components/dashboard/conversation-list";
import { MetricCard } from "@/components/dashboard/metric-card";
import { PerformanceChart } from "@/components/dashboard/performance-chart";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardData } from "@/lib/dashboard/queries";
import { formatCurrency } from "@/lib/utils";

export default async function DashboardPage() {
  const { organization, metrics, agentOnline, recentConversations, performance } = await getDashboardData();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Dashboard</h1>
          <p className="text-muted-foreground">
            Visao comercial da operacao {organization?.name ? `de ${organization.name}` : "conectada ao Supabase"}.
          </p>
        </div>
        <StatusBadge value={agentOnline ? "Agente IA online" : "Agente IA offline"} tone={agentOnline ? "active" : "inactive"} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Total de leads" value={String(metrics.totalLeads)} detail="base real do tenant" icon={Users} />
        <MetricCard title="Conversas ativas" value={String(metrics.activeConversations)} detail="status active" icon={MessageSquare} />
        <MetricCard title="Taxa de conversao" value={`${metrics.conversionRate.toFixed(1)}%`} detail="leads ganhos / total" icon={Target} />
        <MetricCard title="Agendamentos" value={String(metrics.scheduledLeads)} detail="leads scheduled" icon={CalendarCheck} />
        <MetricCard title="Receita estimada" value={formatCurrency(metrics.revenue)} detail="pipeline potencial" icon={Wallet} />
        <MetricCard title="Leads quentes" value={String(metrics.hotLeads)} detail="prioridade alta" icon={Flame} />
        <MetricCard title="Leads frios" value={String(metrics.coldLeads)} detail="em recuperacao" icon={TrendingUp} />
        <MetricCard title="Alertas importantes" value={String(metrics.alerts)} detail="pedem acao humana" icon={AlertTriangle} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_420px]">
        <Card>
          <CardHeader>
            <CardTitle>Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <PerformanceChart data={performance} />
          </CardContent>
        </Card>
        <ConversationList conversations={recentConversations} />
      </div>
    </div>
  );
}
