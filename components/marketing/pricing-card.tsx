import { Check } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, formatCurrency } from "@/lib/utils";
import type { Plan } from "@/types/domain";

export function PricingCard({ plan }: { plan: Plan }) {
  return (
    <Card className={cn("h-full", plan.highlighted && "border-primary/30 bg-[linear-gradient(180deg,rgba(139,92,246,0.16),rgba(255,255,255,0.02))]")}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">{plan.name}</CardTitle>
          {plan.highlighted ? (
            <span className="rounded-full border border-primary/20 bg-primary/12 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-white">
              mais escolhido
            </span>
          ) : null}
        </div>
        <p className="text-sm leading-7 text-muted-foreground">{plan.description}</p>
      </CardHeader>
      <CardContent className="flex h-full flex-col">
        <div className="mb-6">
          <span className="text-4xl font-semibold text-white">{formatCurrency(plan.price)}</span>
          <span className="ml-1 text-muted-foreground">/mes</span>
        </div>
        <ul className="space-y-3 text-sm">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-white/82">
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-cyan/20 bg-cyan/10">
                <Check className="h-3.5 w-3.5 text-cyan" />
              </span>
              {feature}
            </li>
          ))}
        </ul>
        <Button className="mt-8 w-full" variant={plan.highlighted ? "default" : "outline"} asChild>
          <Link href="/register">Comecar agora</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
