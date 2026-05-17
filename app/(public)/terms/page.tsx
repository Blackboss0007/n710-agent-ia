export default function TermsPage() {
  return <LegalPage title="Termos de uso" />;
}

function LegalPage({ title }: { title: string }) {
  return (
    <main className="container max-w-3xl py-16">
      <h1 className="text-4xl font-semibold">{title}</h1>
      <div className="mt-8 space-y-5 text-muted-foreground">
        <p>Este documento é um modelo inicial para operação do N710 AI Sales Agent e deve ser revisado por assessoria jurídica antes da publicação.</p>
        <p>O cliente é responsável pelas informações inseridas na base de conhecimento, pelas políticas comerciais e pelo uso adequado dos canais integrados.</p>
        <p>A plataforma fornece automação e apoio comercial, sem substituir análise profissional humana em temas médicos, jurídicos, financeiros ou regulatórios.</p>
      </div>
    </main>
  );
}
