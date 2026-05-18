import { PricingCard } from "@/components/marketing/pricing-card";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { plans } from "@/lib/demo-data";

export default function PricingPage() {
  return (
    <main className="container py-20">
      <Reveal>
        <SectionHeading
          eyebrow="pricing architecture"
          title="Planos desenhados para vender com clareza."
          description="Cada tier combina posicionamento premium, leitura simples de valor e espaco para sua futura camada de billing."
        />
      </Reveal>
      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {plans.map((plan) => (
          <PricingCard key={plan.id} plan={plan} />
        ))}
      </div>
    </main>
  );
}
