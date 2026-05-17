import { PricingCard } from "@/components/marketing/pricing-card";
import { plans } from "@/lib/demo-data";

export default function PlansPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Planos</h1>
        <p className="text-muted-foreground">Estrutura pronta para Stripe ou checkout Cakto.</p>
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        {plans.map((plan) => (
          <PricingCard key={plan.id} plan={plan} />
        ))}
      </div>
    </div>
  );
}
