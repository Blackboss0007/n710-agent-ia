import { PricingCard } from "@/components/marketing/pricing-card";
import { plans } from "@/lib/demo-data";

export default function PricingPage() {
  return (
    <main className="container py-16">
      <h1 className="text-4xl font-semibold">Planos N710</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">Escolha o plano ideal para automatizar atendimento, qualificação e follow-up comercial.</p>
      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        {plans.map((plan) => (
          <PricingCard key={plan.id} plan={plan} />
        ))}
      </div>
    </main>
  );
}
