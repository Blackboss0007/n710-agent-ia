import { Loader2 } from "lucide-react";

export function LoadingState({ label = "Carregando" }: { label?: string }) {
  return (
    <div className="flex min-h-40 items-center justify-center gap-3 text-sm text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin text-violet" />
      {label}
    </div>
  );
}
