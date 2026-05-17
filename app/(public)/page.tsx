import Link from "next/link";
import { ArrowRight, Bot, CalendarCheck, CheckCircle2, Clock, MessageSquare, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PricingCard } from "@/components/marketing/pricing-card";
import { plans } from "@/lib/demo-data";

const niches = ["Dentistas", "Clínicas", "Estética", "Imobiliárias", "Empresas locais", "Agências", "Prestadores de serviço"];
const features = [
  { icon: MessageSquare, title: "Atendimento WhatsApp", text: "Respostas rápidas, contexto da conversa e transferência para humano." },
  { icon: Bot, title: "Vendedor IA treinável", text: "Prompt, tom de voz, objeções, produtos e políticas da empresa." },
  { icon: CalendarCheck, title: "Agendamento e follow-up", text: "Condução do lead para consulta, reunião, proposta ou compra." },
  { icon: TrendingUp, title: "Qualificação comercial", text: "Classificação de temperatura, extração de dados e próxima ação." }
];

export default function LandingPage() {
  return (
    <main className="overflow-hidden">
      <section className="relative min-h-[92vh] border-b border-white/10 subtle-grid">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,rgba(139,92,246,.22),transparent_30%),linear-gradient(180deg,rgba(0,0,0,.15),#08090d_90%)]" />
        <div className="container relative flex min-h-[92vh] flex-col justify-center py-24">
          <div className="max-w-4xl animate-fade-up">
            <span className="inline-flex items-center rounded-full border border-gold/25 bg-gold/10 px-3 py-1 text-sm text-gold">
              <Sparkles className="mr-2 h-4 w-4" />
              N710 AI Sales Agent
            </span>
            <h1 className="mt-6 max-w-5xl text-4xl font-semibold tracking-tight text-white md:text-6xl">
              Contrate um vendedor de IA que atende seus clientes 24h por dia
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
              Automatize WhatsApp, Instagram, agendamentos, qualificação, quebra de objeções e follow-up com uma plataforma SaaS multi-tenant feita para vender todos os dias.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/register">
                  Começar agora
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/dashboard">Ver demonstração</Link>
              </Button>
            </div>
          </div>
          <div className="mt-14 grid gap-4 md:grid-cols-3">
            {["Leads respondidos em segundos", "Follow-up sem esquecimento", "Dados separados por organização"].map((item) => (
              <div key={item} className="rounded-lg border border-white/10 bg-white/[0.04] p-4 text-sm text-muted-foreground">
                <CheckCircle2 className="mb-3 h-5 w-5 text-gold" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-20">
        <div className="grid gap-5 lg:grid-cols-2">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold">O problema</h2>
              <p className="mt-4 text-muted-foreground">
                Empresas perdem vendas porque demoram para responder, esquecem follow-ups, não qualificam o contato e deixam oportunidades quentes se perderem no WhatsApp.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold">A solução</h2>
              <p className="mt-4 text-muted-foreground">
                O N710 coloca um agente de IA treinado com sua base comercial para responder, qualificar, contornar objeções e acionar o time humano quando a venda pedir.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.025] py-20">
        <div className="container">
          <h2 className="text-3xl font-semibold">Funcionalidades para operação real</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {features.map((feature) => (
              <Card key={feature.title}>
                <CardContent className="p-5">
                  <feature.icon className="h-6 w-6 text-violet" />
                  <h3 className="mt-4 font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{feature.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-20">
        <h2 className="text-3xl font-semibold">Feito para nichos que vivem de atendimento rápido</h2>
        <div className="mt-8 flex flex-wrap gap-3">
          {niches.map((niche) => (
            <span key={niche} className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-muted-foreground">
              {niche}
            </span>
          ))}
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {[
            ["Mais velocidade", "Reduza o tempo da primeira resposta e aumente as chances de conversão."],
            ["Mais controle", "Acompanhe leads, conversas, origem, temperatura e valor potencial."],
            ["Mais escala", "Atenda fora do horário comercial sem contratar uma equipe maior."]
          ].map(([title, text]) => (
            <Card key={title}>
              <CardContent className="p-5">
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.025] py-20">
        <div className="container">
          <h2 className="text-3xl font-semibold">Prova social</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {["Clínica odontológica", "Imobiliária boutique", "Agência local"].map((company, index) => (
              <Card key={company}>
                <CardContent className="p-5">
                  <p className="text-sm text-muted-foreground">
                    “Placeholder de depoimento: a operação reduziu tempo de resposta, recuperou leads e aumentou agendamentos qualificados.”
                  </p>
                  <p className="mt-4 font-medium">Cliente {index + 1}</p>
                  <p className="text-xs text-muted-foreground">{company}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-20">
        <h2 className="text-3xl font-semibold">Planos</h2>
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {plans.map((plan) => (
            <PricingCard key={plan.id} plan={plan} />
          ))}
        </div>
      </section>

      <section className="container pb-20">
        <h2 className="text-3xl font-semibold">FAQ</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {[
            ["Funciona com WhatsApp?", "Sim. A estrutura de webhook está pronta para integrar com o provedor escolhido."],
            ["A IA pode chamar um humano?", "Sim. Existem regras de transferência configuráveis no agente."],
            ["A compra pela Cakto libera acesso?", "Sim. O webhook cria usuário, organização, assinatura e pagamento."],
            ["É multi-tenant?", "Sim. O schema e os serviços separam dados por organização."]
          ].map(([question, answer]) => (
            <Card key={question}>
              <CardContent className="p-5">
                <h3 className="font-semibold">{question}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="container pb-24">
        <div className="rounded-lg border border-violet/30 bg-violet/10 p-8 md:p-12">
          <Clock className="h-8 w-8 text-gold" />
          <h2 className="mt-5 max-w-2xl text-3xl font-semibold">Seu próximo lead não precisa esperar o horário comercial.</h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">Coloque um vendedor digital treinado para atender, qualificar e conduzir oportunidades enquanto seu time foca nos fechamentos.</p>
          <Button className="mt-7" size="lg" asChild>
            <Link href="/register">Começar agora</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
