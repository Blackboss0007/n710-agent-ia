export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-0 dashboard-grid opacity-80" />
      <div className="absolute inset-x-0 top-0 h-64 bg-[linear-gradient(180deg,rgba(115,81,255,0.24),transparent)]" />
      <div className="relative grid min-h-screen lg:grid-cols-[1.1fr_0.9fr]">
        <section className="hidden border-r border-white/10 lg:flex lg:flex-col lg:justify-between lg:p-10 xl:p-14">
          <div>
            <div className="eyebrow-chip">N710 AI command center</div>
            <h1 className="mt-8 max-w-xl text-5xl font-semibold leading-tight text-white">
              Seu time comercial agora opera com a disciplina visual e a velocidade de uma fintech premium.
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-8 text-muted-foreground">
              Centralize atendimento, follow-up, qualificacao e transferencia humana em uma experiencia institucional, enxuta e preparada para escala.
            </p>
          </div>
          <div className="grid gap-4 xl:grid-cols-2">
            <div className="hero-outline rounded-lg p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-white/45">status global</p>
              <div className="mt-4 flex items-end justify-between">
                <div>
                  <p className="text-3xl font-semibold text-white">97.8%</p>
                  <p className="mt-2 text-sm text-muted-foreground">conversas atendidas sem atraso</p>
                </div>
                <div className="h-12 w-12 rounded-md border border-emerald-400/20 bg-emerald-400/10" />
              </div>
            </div>
            <div className="hero-outline rounded-lg p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-white/45">stack ativa</p>
              <p className="mt-4 text-lg font-medium text-white">Supabase, OpenAI, WhatsApp e webhooks Cakto</p>
              <p className="mt-2 text-sm text-muted-foreground">com auth SSR, isolamento por tenant e fallback resiliente.</p>
            </div>
          </div>
        </section>
        <section className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-10">
          <div className="w-full max-w-xl">{children}</div>
        </section>
      </div>
    </main>
  );
}
