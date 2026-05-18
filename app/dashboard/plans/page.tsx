import { PricingCard } from "@/components/marketing/pricing-card";
import { plans } from "@/lib/demo-data";

export default function PlansPage() {
  return (
    <div className="space-y-6">
      <section className="hero-outline rounded-lg px-6 py-8">
        <div className="max-w-3xl">
          <div className="eyebrow-chip">pricing ops</div>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white">Planos</h1>
          <p className="mt-4 text-base leading-8 text-muted-foreground">
            Estrutura pronta para Stripe ou checkout Cakto com presentacao premium para venda direta.
          </p>
        </div>
      </section>
      <div className="grid gap-5 lg:grid-cols-3">
        {plans.map((plan) => (
          <PricingCard key={plan.id} plan={plan} />
        ))}
      </div>
    </div>
  );
}
