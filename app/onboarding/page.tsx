import { redirect } from "next/navigation";
import { completeOnboardingAction } from "@/app/onboarding/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getTenantContext } from "@/lib/dashboard/queries";
import { getPublicEnvStatus } from "@/lib/env/public";

export default async function OnboardingPage() {
  const envStatus = getPublicEnvStatus();

  if (!envStatus.ok) {
    redirect("/login?message=Configure o Supabase antes de concluir o onboarding.");
  }

  const { organization, profile, schemaIssue } = await getTenantContext();

  if (schemaIssue) {
    redirect("/dashboard");
  }

  if (!organization) {
    redirect("/login");
  }

  const isComplete =
    profile?.onboarding_completed ||
    Boolean((organization.metadata as { onboarding_completed?: boolean } | null)?.onboarding_completed);

  if (isComplete) {
    redirect("/dashboard");
  }

  return (
    <main className="container max-w-5xl py-12">
      <section className="hero-outline rounded-lg px-6 py-8 md:px-8">
        <div className="max-w-3xl">
          <div className="eyebrow-chip">onboarding sequence</div>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white">Configure sua operacao inicial</h1>
          <p className="mt-4 text-base leading-8 text-muted-foreground">
            Defina a identidade comercial da empresa e libere o painel com um agente IA pronto para atender com contexto.
          </p>
        </div>
      </section>

      <Card className="mt-6">
        <CardHeader>
          <p className="text-xs uppercase tracking-[0.18em] text-white/40">setup</p>
          <CardTitle className="mt-2 text-2xl">Configuracao inicial</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={completeOnboardingAction} className="grid gap-5">
            <div className="grid gap-4 md:grid-cols-2">
              <Field name="owner_name" label="Nome do responsavel" defaultValue={profile?.full_name ?? ""} />
              <Field name="company_name" label="Nome da empresa" defaultValue={organization.name} />
              <Field name="segment" label="Nicho" defaultValue={organization.segment ?? ""} />
              <Field name="website" label="Site" defaultValue={organization.website ?? ""} />
              <Field name="whatsapp_phone" label="WhatsApp" defaultValue={organization.whatsapp_phone ?? ""} />
              <Field name="agent_name" label="Nome do agente IA" defaultValue="N710 Sales Agent" />
              <Field name="voice_tone" label="Tom de voz" defaultValue="Humano, profissional e persuasivo" />
              <Field name="business_hours" label="Horario de atendimento" defaultValue="Segunda a sexta, 08:00 as 18:00" />
            </div>

            <Area name="products_services" label="Servicos e produtos" defaultValue="" />
            <Area name="common_objections" label="Objecoes comuns" defaultValue="" />
            <Area
              name="initial_message"
              label="Mensagem inicial"
              defaultValue={`Ola! Sou o agente da ${organization.name}. Como posso te ajudar hoje?`}
            />

            <div>
              <Button type="submit">Finalizar onboarding</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}

function Field({ name, label, defaultValue }: { name: string; label: string; defaultValue: string }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} defaultValue={defaultValue} />
    </div>
  );
}

function Area({ name, label, defaultValue }: { name: string; label: string; defaultValue: string }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Textarea id={name} name={name} defaultValue={defaultValue} />
    </div>
  );
}
