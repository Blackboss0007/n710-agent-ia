export default function PrivacyPage() {
  return (
    <main className="container max-w-4xl py-20">
      <div className="hero-outline rounded-lg p-8 md:p-10">
        <h1 className="text-4xl font-semibold">Politica de privacidade</h1>
        <div className="mt-8 space-y-5 text-muted-foreground">
          <p>Este modelo descreve a coleta de dados de conta, leads, conversas e integracoes necessarias para funcionamento do SaaS.</p>
          <p>Os dados sao segregados por organizacao no Supabase com Row Level Security e devem ser tratados conforme a LGPD.</p>
          <p>Revise retencao, bases legais, subprocessadores e canais de atendimento antes de publicar em producao.</p>
        </div>
      </div>
    </main>
  );
}
