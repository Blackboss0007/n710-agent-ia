import {
  AlertTriangle,
  ArrowUpRight,
  CalendarCheck,
  Flame,
  MessageSquare,
  Target,
  TrendingUp,
  Users,
  Wallet
} from "lucide-react";
import { ConversationList } from "@/components/dashboard/conversation-list";
import { MetricCard } from "@/components/dashboard/metric-card";
import { PerformanceChart } from "@/components/dashboard/performance-chart";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardData } from "@/lib/dashboard/queries";
import { formatCurrency } from "@/lib/utils";

export default async function DashboardPage() {
  const { organization, metrics, agentOnline, recentConversations, performance } = await getDashboardData();

  const insights = [
    {
      title: "Pressao de pipeline",
      value: `${metrics.hotLeads} leads`,
      description: "oportunidades quentes exigindo acompanhamento curto"
    },
    {
      title: "Receita em jogo",
      value: formatCurrency(metrics.revenue),
      description: "pipeline potencial calculado a partir do valor estimado"
    },
    {
      title: "Acao sugerida",
      value: metrics.alerts > 0 ? "Priorizar handoff" : "Fluxo estavel",
      description: "a IA sinaliza quando convem mover a conversa para humano"
    }
  ];

  return (
    <div className="space-y-6">
      <section className="hero-outline rounded-lg px-6 py-8 md:px-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <div className="eyebrow-chip">command center</div>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-5xl">Operacao comercial viva</h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-muted-foreground">
              Visao executiva da operacao {organization?.name ? `de ${organization.name}` : "conectada ao Supabase"}, com sinais de pipeline, respostas, agenda e carga do agente em um unico fluxo.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <StatusBadge value={agentOnline ? "Agente IA online" : "Agente IA offline"} tone={agentOnline ? "active" : "inactive"} />
            <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/72">
              ultima leitura: tempo real
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Total de leads" value={String(metrics.totalLeads)} detail="base comercial do tenant" icon={Users} />
        <MetricCard title="Conversas ativas" value={String(metrics.activeConversations)} detail="atendimento em andamento" icon={MessageSquare} />
        <MetricCard title="Taxa de conversao" value={`${metrics.conversionRate.toFixed(1)}%`} detail="ganhos sobre total de leads" icon={Target} />
        <MetricCard title="Agendamentos" value={String(metrics.scheduledLeads)} detail="visitas ou consultas em fila" icon={CalendarCheck} />
        <MetricCard title="Receita estimada" value={formatCurrency(metrics.revenue)} detail="potencial somado do pipeline" icon={Wallet} />
        <MetricCard title="Leads quentes" value={String(metrics.hotLeads)} detail="janela curta para agir" icon={Flame} />
        <MetricCard title="Leads frios" value={String(metrics.coldLeads)} detail="prontos para fluxo de recuperacao" icon={TrendingUp} />
        <MetricCard title="Alertas importantes" value={String(metrics.alerts)} detail="pedem contexto humano imediato" icon={AlertTriangle} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
        <Card>
          <CardHeader>
            <p className="text-xs uppercase tracking-[0.18em] text-white/40">analytics</p>
            <CardTitle className="mt-2 text-2xl">Performance em sete dias</CardTitle>
          </CardHeader>
          <CardContent>
            <PerformanceChart data={performance} />
          </CardContent>
        </Card>

        <div className="grid gap-5">
          <Card>
            <CardHeader>
              <p className="text-xs uppercase tracking-[0.18em] text-white/40">ai insights</p>
              <CardTitle className="mt-2 text-2xl">Sinais priorizados</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {insights.map((item) => (
                <div key={item.title} className="surface-muted px-4 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm text-white">{item.title}</p>
                    <ArrowUpRight className="h-4 w-4 text-cyan" />
                  </div>
                  <p className="mt-3 text-xl font-semibold text-white">{item.value}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <ConversationList conversations={recentConversations} />
        </div>
      </div>
    </div>
  );
}
