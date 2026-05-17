import { Check } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, formatCurrency } from "@/lib/utils";
import type { Plan } from "@/types/domain";

export function PricingCard({ plan }: { plan: Plan }) {
  return (
    <Card className={cn(plan.highlighted && "border-violet/50 shadow-glow")}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {plan.name}
          {plan.highlighted ? <span className="rounded-full bg-violet/20 px-2 py-1 text-xs text-violet">Mais vendido</span> : null}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{plan.description}</p>
      </CardHeader>
      <CardContent>
        <div className="mb-5">
          <span className="text-3xl font-semibold">{formatCurrency(plan.price)}</span>
          <span className="text-muted-foreground">/mês</span>
        </div>
        <ul className="space-y-3 text-sm">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-gold" />
              {feature}
            </li>
          ))}
        </ul>
        <Button className="mt-6 w-full" variant={plan.highlighted ? "default" : "outline"} asChild>
          <Link href="/register">Começar agora</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
