export default function PrivacyPage() {
  return (
    <main className="container max-w-3xl py-16">
      <h1 className="text-4xl font-semibold">Política de privacidade</h1>
      <div className="mt-8 space-y-5 text-muted-foreground">
        <p>Este modelo descreve a coleta de dados de conta, leads, conversas e integrações necessárias para funcionamento do SaaS.</p>
        <p>Os dados são segregados por organização no Supabase com Row Level Security e devem ser tratados conforme a LGPD.</p>
        <p>Revise retenção, bases legais, subprocessadores e canais de atendimento antes de publicar em produção.</p>
      </div>
    </main>
  );
}
