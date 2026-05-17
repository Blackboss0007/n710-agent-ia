import { AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SetupAlert({
  title,
  description,
  missing
}: {
  title: string;
  description: string;
  missing: string[];
}) {
  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-400" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-muted-foreground">
        <p>{description}</p>
        <div className="rounded-md border border-white/10 bg-white/[0.04] p-3">
          Variaveis faltando: {missing.join(", ")}
        </div>
      </CardContent>
    </Card>
  );
}
