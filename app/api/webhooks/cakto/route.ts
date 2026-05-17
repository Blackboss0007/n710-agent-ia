import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { rateLimit, validateSharedSecret } from "@/lib/webhooks/security";

export const runtime = "nodejs";

const caktoPayloadSchema = z.object({
  event: z.string(),
  transaction_id: z.string().optional(),
  customer: z.object({
    email: z.string().email(),
    name: z.string().min(1).optional(),
    phone: z.string().optional()
  }),
  subscription: z.object({
    id: z.string().optional(),
    plan: z.string().optional(),
    status: z.string().optional()
  }).optional(),
  payment: z.object({
    id: z.string().optional(),
    amount: z.number().optional(),
    currency: z.string().optional(),
    status: z.string().optional()
  }).optional()
});

const approvedEvents = new Set(["purchase.approved", "order.approved", "payment.approved", "subscription.created"]);

export async function POST(request: Request) {
  if (!rateLimit(`cakto:${request.headers.get("x-forwarded-for") ?? "local"}`, 40)) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  const secretError = validateSharedSecret(request, "CAKTO_WEBHOOK_SECRET", ["x-cakto-signature", "authorization"]);
  if (secretError) return secretError;

  const rawPayload = await request.json();
  const parsed = caktoPayloadSchema.safeParse(rawPayload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload.", issues: parsed.error.flatten() }, { status: 400 });
  }

  const payload = parsed.data;
  if (!approvedEvents.has(payload.event)) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const supabase = createSupabaseAdminClient();
  const email = payload.customer.email.toLowerCase();
  const displayName = payload.customer.name || email.split("@")[0];
  const transactionId = payload.transaction_id || payload.payment?.id || payload.subscription?.id || `${payload.event}:${email}`;

  const existingPayment = await supabase
    .from("payments")
    .select("id, organization_id")
    .eq("provider", "cakto")
    .eq("transaction_id", transactionId)
    .maybeSingle();

  if (existingPayment.data) {
    return NextResponse.json({ ok: true, duplicate: true, organization_id: existingPayment.data.organization_id });
  }

  let authUserId: string | undefined;
  const createUser = await supabase.auth.admin.createUser({
    email,
    email_confirm: true,
    user_metadata: { name: displayName, phone: payload.customer.phone }
  });

  if (createUser.data.user) {
    authUserId = createUser.data.user.id;
  } else {
    const { data } = await supabase.auth.admin.listUsers();
    authUserId = data.users.find((user) => user.email?.toLowerCase() === email)?.id;
  }

  if (!authUserId) {
    return NextResponse.json({ error: "Could not create or locate user." }, { status: 500 });
  }

  await supabase.from("profiles").upsert({
    id: authUserId,
    email,
    full_name: displayName
  });

  const membership = await supabase
    .from("organization_members")
    .select("organization_id, organizations(id, name)")
    .eq("profile_id", authUserId)
    .limit(1)
    .maybeSingle();

  const existingOrganization = Array.isArray(membership.data?.organizations)
    ? membership.data?.organizations[0]
    : membership.data?.organizations;

  const organizationId = membership.data?.organization_id || existingOrganization?.id;

  if (!organizationId) {
    return NextResponse.json({ error: "Organization could not be resolved for this user." }, { status: 500 });
  }

  await supabase.from("subscriptions").upsert({
    organization_id: organizationId,
    provider: "cakto",
    provider_subscription_id: payload.subscription?.id,
    plan: payload.subscription?.plan || "starter",
    status: payload.subscription?.status || "active",
    metadata: rawPayload
  }, { onConflict: "provider,provider_subscription_id" });

  await supabase.from("payments").insert({
    organization_id: organizationId,
    provider: "cakto",
    transaction_id: transactionId,
    provider_payment_id: payload.payment?.id,
    amount: payload.payment?.amount ?? 0,
    currency: payload.payment?.currency ?? "BRL",
    status: payload.payment?.status || "approved",
    raw_payload: rawPayload,
    paid_at: new Date().toISOString()
  });

  await supabase.from("integrations").upsert({
    organization_id: organizationId,
    provider: "cakto",
    status: "connected",
    connected_at: new Date().toISOString(),
    settings: { webhook: "/api/webhooks/cakto" }
  }, { onConflict: "organization_id,provider" });

  await supabase.from("webhooks").insert({
    organization_id: organizationId,
    provider: "cakto",
    event: payload.event,
    payload: rawPayload,
    headers: {
      "x-cakto-signature": request.headers.get("x-cakto-signature")
    },
    status: "processed",
    processed_at: new Date().toISOString()
  });

  await supabase.from("audit_logs").insert({
    organization_id: organizationId,
    actor_profile_id: authUserId,
    action: "cakto.purchase_approved",
    entity_type: "payment",
    metadata: { transaction_id: transactionId, event: payload.event }
  });

  return NextResponse.json({ ok: true, user_id: authUserId, organization_id: organizationId });
}
