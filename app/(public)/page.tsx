import Link from "next/link";
import {
  ArrowRight,
  Bot,
  BrainCircuit,
  CalendarRange,
  CheckCircle2,
  ChevronRight,
  MessageSquareText,
  Orbit,
  ShieldCheck,
  Sparkles,
  TrendingUp
} from "lucide-react";
import { PricingCard } from "@/components/marketing/pricing-card";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { plans } from "@/lib/demo-data";

const stats = [
  { label: "resposta inicial", value: "< 30s" },
  { label: "follow-ups orquestrados", value: "24/7" },
  { label: "leads qualificados", value: "+41%" }
];

const solutionCards = [
  {
    icon: MessageSquareText,
    title: "Orquestracao de conversas",
    text: "WhatsApp, Instagram e handoff humano com contexto preservado."
  },
  {
    icon: BrainCircuit,
    title: "IA treinada com o seu negocio",
    text: "Tom de voz, politicas, produtos, objecoes e regras comerciais."
  },
  {
    icon: CalendarRange,
    title: "Agenda e follow-up",
    text: "Agendamentos, lembretes e recuperacao de oportunidades mornas."
  },
  {
    icon: TrendingUp,
    title: "Leitura comercial em tempo real",
    text: "Temperatura, proxima acao, risco e performance por canal."
  }
];

const niches = ["Dentistas", "Clinicas", "Estetica", "Imobiliarias", "Empresas locais", "Agencias", "Prestadores"];

const faq = [
  ["Funciona com atendimento real no WhatsApp?", "Sim. O fluxo usa webhook e prepara resposta pronta para o provedor escolhido."],
  ["Posso transferir para humano?", "Sim. O agente respeita regras de handoff e sinaliza quando deve sair de cena."],
  ["Os dados ficam separados por cliente?", "Sim. O projeto foi desenhado como multi-tenant com segregacao por organizacao."],
  ["Consigo monetizar com planos?", "Sim. A estrutura de planos, subscription e webhook de compra ja esta pronta para evolucao."]
];

export default function LandingPage() {
  return (
    <main className="overflow-hidden">
      <section className="relative border-b border-white/10">
        <div className="absolute inset-0 dashboard-grid opacity-60" />
        <div className="absolute inset-x-0 top-0 h-[520px] bg-[linear-gradient(180deg,rgba(115,81,255,0.22),transparent)]" />
        <div className="container relative py-6">
          <header className="flex items-center justify-between rounded-lg border border-white/10 bg-black/20 px-4 py-3 backdrop-blur-xl">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-md border border-primary/30 bg-primary/20 shadow-glow">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-display text-lg font-semibold text-white">N710 AI</p>
                <p className="text-xs uppercase tracking-[0.18em] text-white/45">sales command</p>
              </div>
            </Link>
            <nav className="hidden items-center gap-6 text-sm text-white/65 lg:flex">
              <Link href="/pricing" className="transition hover:text-white">
                Planos
              </Link>
              <Link href="/login" className="transition hover:text-white">
                Login
              </Link>
              <Button asChild>
                <Link href="/register">Comecar agora</Link>
              </Button>
            </nav>
          </header>
        </div>

        <div className="container relative grid min-h-[calc(100vh-92px)] items-center gap-10 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
          <Reveal>
            <div className="max-w-3xl">
              <div className="eyebrow-chip">
                <Orbit className="h-3.5 w-3.5 text-cyan" />
                n710 ai revenue layer
              </div>
              <h1 className="mt-6 text-5xl font-semibold leading-[1.02] tracking-tight md:text-6xl xl:text-7xl">
                <span className="text-gradient">Contrate um vendedor de IA</span> que atende seus clientes 24h por dia
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">
                N710 AI transforma canais como WhatsApp e Instagram em um cockpit comercial com agentes treinados,
                follow-up automatico, agenda e leitura de pipeline em tempo real.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" asChild>
                  <Link href="/register">
                    Comecar agora
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/dashboard">Ver demonstracao</Link>
                </Button>
              </div>
              <div className="mt-10 grid gap-3 sm:grid-cols-3">
                {stats.map((item) => (
                  <div key={item.label} className="surface-muted px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-white/40">{item.label}</p>
                    <p className="mt-3 text-2xl font-semibold text-white">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="hero-outline rounded-lg p-4 md:p-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-white/45">ai revenue cockpit</p>
                  <h2 className="mt-2 text-xl font-semibold text-white">Operacao viva</h2>
                </div>
                <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs uppercase tracking-[0.16em] text-emerald-300">
                  online
                </div>
              </div>
              <div className="mt-6 grid gap-4">
                <div className="surface-muted p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white">Leads quentes em fila</p>
                      <p className="mt-2 text-3xl font-semibold text-white">128</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-md border border-cyan/20 bg-cyan/10">
                      <TrendingUp className="h-5 w-5 text-cyan" />
                    </div>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="surface-muted p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-white/40">automacao</p>
                    <p className="mt-3 text-lg font-medium text-white">follow-up contextual</p>
                    <p className="mt-2 text-sm text-muted-foreground">reativa propostas esquecidas com prova social e CTA.</p>
                  </div>
                  <div className="surface-muted p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-white/40">roteamento</p>
                    <p className="mt-3 text-lg font-medium text-white">humano no momento certo</p>
                    <p className="mt-2 text-sm text-muted-foreground">sobe para consultor apenas quando aumenta chance de fechamento.</p>
                  </div>
                </div>
                <div className="surface-muted p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md border border-primary/20 bg-primary/14">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-white">Agente N710 Prime</p>
                      <p className="text-sm text-muted-foreground">Objetivo: qualificar e levar para agendamento</p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-3">
                    {[
                      "Lead perguntou prazo e condicao de pagamento.",
                      "IA respondeu com proposta consultiva e pediu duas informacoes.",
                      "Proxima acao sugerida: oferecer agenda desta semana."
                    ].map((line, index) => (
                      <div key={line} className="flex items-start gap-3 rounded-md border border-white/10 bg-black/20 px-3 py-3">
                        <div className="mt-0.5 text-xs uppercase tracking-[0.18em] text-white/35">0{index + 1}</div>
                        <p className="text-sm text-white/82">{line}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="container py-24">
        <Reveal>
          <SectionHeading
            eyebrow="visao executiva"
            title="Um produto com cara de infraestrutura critica, nao de automacao improvisada."
            description="A interface foi desenhada para liderancas comerciais que precisam enxergar operacao, risco, agenda, qualidade do atendimento e intensidade de pipeline em um unico lugar."
          />
        </Reveal>
        <div className="mt-10 grid gap-4 lg:grid-cols-4">
          {solutionCards.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.06}>
              <div className="surface-panel h-full p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-md border border-white/10 bg-white/[0.04] text-cyan">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-black/12 py-24">
        <div className="container grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <Reveal>
            <SectionHeading
              eyebrow="nichos prontos"
              title="Feito para operacoes que nao podem perder tempo de resposta."
              description="Clinicas, imobiliarias, agencias e negocios locais ganham ritmo, padrao de atendimento e memoria operacional."
            />
            <div className="mt-8 flex flex-wrap gap-3">
              {niches.map((niche) => (
                <span key={niche} className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/72">
                  {niche}
                </span>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                ["Atendimento instantaneo", "Leads novos recebem contexto e direcionamento sem fila."],
                ["Memoria comercial", "Historico, notas e recomendacoes ficam visiveis para o time."],
                ["Operacao escalavel", "Mais canais e mais unidades sem perder consistencia."],
                ["Leitura gerencial", "Dashboard com sinais claros para decidir proxima acao."]
              ].map(([title, text]) => (
                <div key={title} className="surface-panel p-5">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-cyan" />
                    <h3 className="font-semibold text-white">{title}</h3>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{text}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="container py-24">
        <Reveal>
          <SectionHeading
            eyebrow="social proof"
            title="Estrutura pensada para parecer confiavel desde o primeiro clique."
            description="Use depoimentos reais depois. Por enquanto, o layout ja reserva um espaco institucional e crivel para prova social."
            align="center"
          />
        </Reveal>
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {["Clinica odontologica premium", "Imobiliaria boutique", "Agencia de performance"].map((company, index) => (
            <Reveal key={company} delay={index * 0.08}>
              <div className="surface-panel h-full p-6">
                <p className="text-sm leading-7 text-white/76">
                  &ldquo;O atendimento ficou consistente, o follow-up ganhou disciplina e o time passou a receber oportunidades melhor preparadas para o fechamento.&rdquo;
                </p>
                <div className="mt-6 border-t border-white/10 pt-4">
                  <p className="font-medium text-white">Cliente {index + 1}</p>
                  <p className="text-sm text-muted-foreground">{company}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-black/12 py-24">
        <div className="container">
          <Reveal>
            <SectionHeading
              eyebrow="pricing"
              title="Planos com linguagem de produto premium e base pronta para monetizacao."
              description="O design comercial acompanha o posicionamento: claro no valor, direto no escopo e com boa leitura para venda high-ticket."
            />
          </Reveal>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {plans.map((plan, index) => (
              <Reveal key={plan.id} delay={index * 0.05}>
                <PricingCard plan={plan} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-24">
        <Reveal>
          <SectionHeading eyebrow="faq" title="Perguntas que aparecem antes de fechar." description="Uma camada de clareza para decisores que querem entender rapido como o produto opera." />
        </Reveal>
        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          {faq.map(([question, answer], index) => (
            <Reveal key={question} delay={index * 0.05}>
              <div className="surface-panel h-full p-6">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-lg font-semibold text-white">{question}</h3>
                  <ChevronRight className="mt-1 h-4 w-4 text-white/40" />
                </div>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{answer}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container pb-24">
        <Reveal>
          <div className="hero-outline rounded-lg px-6 py-10 md:px-10 md:py-12">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <div className="eyebrow-chip">
                  <ShieldCheck className="h-3.5 w-3.5 text-cyan" />
                  pronto para vender
                </div>
                <h2 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-5xl">
                  Coloque sua operacao comercial em um padrao visual e operacional que transmite escala.
                </h2>
                <p className="mt-4 text-lg leading-8 text-muted-foreground">
                  N710 AI foi desenhado para parecer produto grande, vender como produto grande e crescer como produto grande.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button size="lg" asChild>
                  <Link href="/register">Comecar agora</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/pricing">Ver planos</Link>
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
