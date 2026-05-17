import Link from "next/link";
import { Save } from "lucide-react";
import { saveSettingsAction } from "@/app/dashboard/settings/actions";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSettingsData } from "@/lib/dashboard/queries";

export default async function SettingsPage() {
  const { organization, plan, statuses } = await getSettingsData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Configuracoes</h1>
        <p className="text-muted-foreground">Dados da empresa, plano atual, status das integracoes e logout.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Organizacao</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={saveSettingsAction} className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da empresa</Label>
              <Input id="name" name="name" defaultValue={organization?.name ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="segment">Segmento</Label>
              <Input id="segment" name="segment" defaultValue={organization?.segment ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp_phone">WhatsApp principal</Label>
              <Input id="whatsapp_phone" name="whatsapp_phone" defaultValue={organization?.whatsapp_phone ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">URL publica</Label>
              <Input id="website" name="website" defaultValue={organization?.website ?? ""} />
            </div>
            <div className="md:col-span-2">
              <Button className="w-fit" type="submit">
                <Save className="mr-2 h-4 w-4" />
                Salvar configuracoes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Plano atual</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Plano</span>
              <span>{plan?.plan ?? "starter"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Status</span>
              <StatusBadge value={plan?.status ?? "trialing"} tone={plan?.status === "active" ? "active" : "available"} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status tecnico</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <StatusRow label="Supabase" tone="connected" value={statuses.supabase} />
            <StatusRow label="OpenAI" tone={statuses.openai === "connected" ? "connected" : "available"} value={statuses.openai} />
            <StatusRow label="WhatsApp" tone={statuses.whatsapp === "connected" ? "connected" : "available"} value={statuses.whatsapp} />
            <StatusRow label="Cakto" tone={statuses.cakto === "connected" ? "connected" : "available"} value={statuses.cakto} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Acesso</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button variant="outline" asChild>
            <Link href="/dashboard/integrations">Abrir integracoes</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/api/auth/logout">Sair</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function StatusRow({
  label,
  value,
  tone
}: {
  label: string;
  value: string;
  tone: "connected" | "available";
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <StatusBadge value={value} tone={tone} />
    </div>
  );
}
