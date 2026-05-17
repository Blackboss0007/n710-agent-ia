begin;

create extension if not exists "pgcrypto";
create extension if not exists "citext";

do $$
begin
  create type public.member_role as enum ('owner', 'admin', 'agent', 'viewer');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.subscription_status as enum ('trialing', 'active', 'past_due', 'canceled');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.lead_status as enum ('new', 'qualified', 'scheduled', 'won', 'lost');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.lead_temperature as enum ('hot', 'warm', 'cold');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.conversation_status as enum ('active', 'waiting', 'human', 'closed');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.message_role as enum ('lead', 'agent', 'human', 'system');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.message_direction as enum ('inbound', 'outbound', 'internal');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.integration_status as enum ('connected', 'available', 'soon', 'error');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.automation_status as enum ('active', 'inactive');
exception when duplicate_object then null;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email citext not null unique,
  full_name text,
  avatar_url text,
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  owner_profile_id uuid references public.profiles(id) on delete set null,
  segment text,
  website text,
  whatsapp_phone text,
  metadata jsonb not null default '{"onboarding_completed": false}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.organization_members (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  role public.member_role not null default 'viewer',
  invited_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  primary key (organization_id, profile_id)
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  provider text not null default 'manual',
  provider_customer_id text,
  provider_subscription_id text,
  plan text not null default 'starter',
  status public.subscription_status not null default 'trialing',
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (provider, provider_subscription_id)
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  provider text not null,
  transaction_id text,
  provider_payment_id text,
  provider_customer_id text,
  amount numeric(12,2) not null default 0 check (amount >= 0),
  currency text not null default 'BRL',
  status text not null,
  raw_payload jsonb not null default '{}',
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  unique (provider, transaction_id),
  unique (provider, provider_payment_id)
);

create table if not exists public.agents (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  niche text,
  voice_tone text,
  goal text,
  products_services text,
  common_objections text,
  forbidden_answers text,
  human_handoff_rules text,
  business_hours text,
  initial_message text,
  custom_prompt text,
  model text not null default 'gpt-4o-mini',
  temperature numeric(3,2) not null default 0.35 check (temperature >= 0 and temperature <= 2),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, id)
);

create table if not exists public.knowledge_base (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  agent_id uuid,
  title text not null,
  content text not null,
  category text not null default 'general',
  source_type text not null default 'manual',
  file_path text,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, id),
  constraint knowledge_base_agent_org_fk
    foreign key (organization_id, agent_id)
    references public.agents(organization_id, id)
    on delete cascade
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  phone text,
  email citext,
  niche text,
  status public.lead_status not null default 'new',
  temperature public.lead_temperature not null default 'cold',
  source text,
  last_interaction_at timestamptz,
  potential_value numeric(12,2) not null default 0 check (potential_value >= 0),
  notes text,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, id),
  unique nulls not distinct (organization_id, phone)
);

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  lead_id uuid,
  agent_id uuid,
  channel text not null default 'whatsapp',
  provider_conversation_id text,
  status public.conversation_status not null default 'active',
  summary text,
  tags text[] not null default '{}',
  human_assigned_profile_id uuid references public.profiles(id) on delete set null,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, id),
  unique nulls not distinct (organization_id, lead_id, channel),
  constraint conversations_lead_org_fk
    foreign key (organization_id, lead_id)
    references public.leads(organization_id, id)
    on delete set null,
  constraint conversations_agent_org_fk
    foreign key (organization_id, agent_id)
    references public.agents(organization_id, id)
    on delete set null
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  conversation_id uuid not null,
  direction public.message_direction not null,
  role public.message_role not null,
  content text not null,
  provider_message_id text,
  tokens_used integer not null default 0 check (tokens_used >= 0),
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  constraint messages_conversation_org_fk
    foreign key (organization_id, conversation_id)
    references public.conversations(organization_id, id)
    on delete cascade
);

create table if not exists public.lead_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  lead_id uuid not null,
  event_type text not null,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  constraint lead_events_lead_org_fk
    foreign key (organization_id, lead_id)
    references public.leads(organization_id, id)
    on delete cascade
);

create table if not exists public.automations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  trigger_key text not null,
  wait_minutes integer not null default 0 check (wait_minutes >= 0),
  message text not null,
  status public.automation_status not null default 'active',
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, trigger_key)
);

create table if not exists public.integrations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  provider text not null,
  status public.integration_status not null default 'available',
  credentials jsonb not null default '{}',
  settings jsonb not null default '{}',
  last_error text,
  connected_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, provider)
);

create table if not exists public.webhooks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  provider text not null,
  event text not null,
  payload jsonb not null,
  headers jsonb not null default '{}',
  status text not null default 'received',
  error_message text,
  processed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  actor_profile_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_type text,
  entity_id uuid,
  ip_address inet,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists organizations_owner_idx on public.organizations(owner_profile_id);
create index if not exists organization_members_profile_idx on public.organization_members(profile_id);
create index if not exists subscriptions_org_status_idx on public.subscriptions(organization_id, status);
create index if not exists agents_org_active_idx on public.agents(organization_id, is_active);
create index if not exists knowledge_base_org_category_idx on public.knowledge_base(organization_id, category);
create index if not exists leads_org_status_idx on public.leads(organization_id, status);
create index if not exists leads_org_temperature_idx on public.leads(organization_id, temperature);
create index if not exists leads_org_source_idx on public.leads(organization_id, source);
create index if not exists leads_org_last_interaction_idx on public.leads(organization_id, last_interaction_at desc);
create index if not exists conversations_org_status_idx on public.conversations(organization_id, status);
create index if not exists conversations_org_updated_idx on public.conversations(organization_id, updated_at desc);
create index if not exists messages_conversation_created_idx on public.messages(conversation_id, created_at);
create index if not exists messages_org_created_idx on public.messages(organization_id, created_at desc);
create index if not exists lead_events_org_lead_created_idx on public.lead_events(organization_id, lead_id, created_at desc);
create index if not exists automations_org_status_idx on public.automations(organization_id, status);
create index if not exists integrations_org_provider_idx on public.integrations(organization_id, provider);
create index if not exists webhooks_provider_created_idx on public.webhooks(provider, created_at desc);
create index if not exists webhooks_org_created_idx on public.webhooks(organization_id, created_at desc);
create index if not exists payments_org_created_idx on public.payments(organization_id, created_at desc);
create index if not exists audit_logs_org_created_idx on public.audit_logs(organization_id, created_at desc);
create index if not exists audit_logs_action_idx on public.audit_logs(action);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
drop trigger if exists set_organizations_updated_at on public.organizations;
create trigger set_organizations_updated_at before update on public.organizations for each row execute function public.set_updated_at();
drop trigger if exists set_subscriptions_updated_at on public.subscriptions;
create trigger set_subscriptions_updated_at before update on public.subscriptions for each row execute function public.set_updated_at();
drop trigger if exists set_agents_updated_at on public.agents;
create trigger set_agents_updated_at before update on public.agents for each row execute function public.set_updated_at();
drop trigger if exists set_knowledge_base_updated_at on public.knowledge_base;
create trigger set_knowledge_base_updated_at before update on public.knowledge_base for each row execute function public.set_updated_at();
drop trigger if exists set_leads_updated_at on public.leads;
create trigger set_leads_updated_at before update on public.leads for each row execute function public.set_updated_at();
drop trigger if exists set_conversations_updated_at on public.conversations;
create trigger set_conversations_updated_at before update on public.conversations for each row execute function public.set_updated_at();
drop trigger if exists set_automations_updated_at on public.automations;
create trigger set_automations_updated_at before update on public.automations for each row execute function public.set_updated_at();
drop trigger if exists set_integrations_updated_at on public.integrations;
create trigger set_integrations_updated_at before update on public.integrations for each row execute function public.set_updated_at();

create or replace function public.current_org_ids()
returns setof uuid
language sql
security definer
stable
set search_path = public
as $$
  select organization_id
  from public.organization_members
  where profile_id = auth.uid();
$$;

create or replace function public.is_org_member(target_org_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1
    from public.organization_members
    where organization_id = target_org_id
      and profile_id = auth.uid()
  );
$$;

create or replace function public.is_org_admin(target_org_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1
    from public.organization_members
    where organization_id = target_org_id
      and profile_id = auth.uid()
      and role in ('owner', 'admin')
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  org_id uuid;
  profile_name text;
begin
  profile_name := coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1));

  insert into public.profiles (id, email, full_name, onboarding_completed)
  values (new.id, lower(new.email), profile_name, false)
  on conflict (id) do update
    set email = excluded.email,
        full_name = coalesce(public.profiles.full_name, excluded.full_name);

  insert into public.organizations (name, slug, owner_profile_id, metadata)
  values (
    profile_name || ' - Organizacao',
    'org-' || substr(new.id::text, 1, 8),
    new.id,
    '{"onboarding_completed": false}'::jsonb
  )
  on conflict (slug) do update set updated_at = now()
  returning id into org_id;

  insert into public.organization_members (organization_id, profile_id, role)
  values (org_id, new.id, 'owner')
  on conflict (organization_id, profile_id) do nothing;

  insert into public.subscriptions (organization_id, provider, plan, status)
  values (org_id, 'manual', 'starter', 'trialing')
  on conflict (provider, provider_subscription_id) do nothing;

  insert into public.agents (
    organization_id,
    name,
    niche,
    voice_tone,
    goal,
    custom_prompt,
    initial_message,
    is_active
  )
  values (
    org_id,
    'N710 Sales Agent',
    'Empresa local',
    'Humano, claro, objetivo e persuasivo',
    'Qualificar leads e conduzir para agendamento ou compra',
    'Voce e um vendedor digital profissional da empresa {{company_name}}. Seu objetivo e atender leads, responder duvidas, qualificar oportunidades, quebrar objecoes e conduzir o cliente para agendamento ou compra. Seja claro, humano, objetivo e persuasivo. Nunca invente informacoes. Quando nao souber responder, encaminhe para atendimento humano.',
    'Ola! Sou o agente da empresa. Como posso te ajudar hoje?',
    true
  )
  on conflict do nothing;

  insert into public.integrations (organization_id, provider, status)
  values
    (org_id, 'supabase', 'connected'),
    (org_id, 'openai', 'available'),
    (org_id, 'whatsapp', 'available'),
    (org_id, 'cakto', 'available')
  on conflict (organization_id, provider) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.subscriptions enable row level security;
alter table public.payments enable row level security;
alter table public.agents enable row level security;
alter table public.knowledge_base enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.leads enable row level security;
alter table public.lead_events enable row level security;
alter table public.automations enable row level security;
alter table public.integrations enable row level security;
alter table public.webhooks enable row level security;
alter table public.audit_logs enable row level security;

drop policy if exists "Profiles can read self" on public.profiles;
create policy "Profiles can read self" on public.profiles for select using (id = auth.uid());
drop policy if exists "Profiles can update self" on public.profiles;
create policy "Profiles can update self" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists "Members can read organizations" on public.organizations;
create policy "Members can read organizations" on public.organizations for select using (public.is_org_member(id));
drop policy if exists "Admins can update organizations" on public.organizations;
create policy "Admins can update organizations" on public.organizations for update using (public.is_org_admin(id)) with check (public.is_org_admin(id));

drop policy if exists "Members can read memberships" on public.organization_members;
create policy "Members can read memberships" on public.organization_members for select using (public.is_org_member(organization_id));
drop policy if exists "Admins can manage memberships" on public.organization_members;
create policy "Admins can manage memberships" on public.organization_members for all using (public.is_org_admin(organization_id)) with check (public.is_org_admin(organization_id));

drop policy if exists "Members can read subscriptions" on public.subscriptions;
create policy "Members can read subscriptions" on public.subscriptions for select using (public.is_org_member(organization_id));
drop policy if exists "Admins can manage subscriptions" on public.subscriptions;
create policy "Admins can manage subscriptions" on public.subscriptions for all using (public.is_org_admin(organization_id)) with check (public.is_org_admin(organization_id));

drop policy if exists "Members can read payments" on public.payments;
create policy "Members can read payments" on public.payments for select using (public.is_org_member(organization_id));

drop policy if exists "Members can manage agents" on public.agents;
create policy "Members can manage agents" on public.agents for all using (public.is_org_member(organization_id)) with check (public.is_org_member(organization_id));
drop policy if exists "Members can manage knowledge" on public.knowledge_base;
create policy "Members can manage knowledge" on public.knowledge_base for all using (public.is_org_member(organization_id)) with check (public.is_org_member(organization_id));
drop policy if exists "Members can manage conversations" on public.conversations;
create policy "Members can manage conversations" on public.conversations for all using (public.is_org_member(organization_id)) with check (public.is_org_member(organization_id));
drop policy if exists "Members can manage messages" on public.messages;
create policy "Members can manage messages" on public.messages for all using (public.is_org_member(organization_id)) with check (public.is_org_member(organization_id));
drop policy if exists "Members can manage leads" on public.leads;
create policy "Members can manage leads" on public.leads for all using (public.is_org_member(organization_id)) with check (public.is_org_member(organization_id));
drop policy if exists "Members can manage lead events" on public.lead_events;
create policy "Members can manage lead events" on public.lead_events for all using (public.is_org_member(organization_id)) with check (public.is_org_member(organization_id));
drop policy if exists "Members can manage automations" on public.automations;
create policy "Members can manage automations" on public.automations for all using (public.is_org_member(organization_id)) with check (public.is_org_member(organization_id));
drop policy if exists "Members can manage integrations" on public.integrations;
create policy "Members can manage integrations" on public.integrations for all using (public.is_org_member(organization_id)) with check (public.is_org_member(organization_id));
drop policy if exists "Members can read webhooks" on public.webhooks;
create policy "Members can read webhooks" on public.webhooks for select using (organization_id is null or public.is_org_member(organization_id));
drop policy if exists "Admins can manage webhooks" on public.webhooks;
create policy "Admins can manage webhooks" on public.webhooks for all using (organization_id is null or public.is_org_admin(organization_id)) with check (organization_id is null or public.is_org_admin(organization_id));
drop policy if exists "Members can read audit logs" on public.audit_logs;
create policy "Members can read audit logs" on public.audit_logs for select using (organization_id is null or public.is_org_member(organization_id));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'knowledge-base',
  'knowledge-base',
  false,
  20971520,
  array[
    'application/pdf',
    'text/plain',
    'text/markdown',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Members can read organization files" on storage.objects;
create policy "Members can read organization files"
on storage.objects for select
using (
  bucket_id = 'knowledge-base'
  and (storage.foldername(name))[1] in (select id::text from public.current_org_ids() as id)
);

drop policy if exists "Members can upload organization files" on storage.objects;
create policy "Members can upload organization files"
on storage.objects for insert
with check (
  bucket_id = 'knowledge-base'
  and (storage.foldername(name))[1] in (select id::text from public.current_org_ids() as id)
);

drop policy if exists "Members can update organization files" on storage.objects;
create policy "Members can update organization files"
on storage.objects for update
using (
  bucket_id = 'knowledge-base'
  and (storage.foldername(name))[1] in (select id::text from public.current_org_ids() as id)
)
with check (
  bucket_id = 'knowledge-base'
  and (storage.foldername(name))[1] in (select id::text from public.current_org_ids() as id)
);

drop policy if exists "Members can delete organization files" on storage.objects;
create policy "Members can delete organization files"
on storage.objects for delete
using (
  bucket_id = 'knowledge-base'
  and (storage.foldername(name))[1] in (select id::text from public.current_org_ids() as id)
);

commit;
