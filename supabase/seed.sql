begin;

insert into public.profiles (id, email, full_name, onboarding_completed)
values
  ('00000000-0000-0000-0000-000000000001', 'demo@n710.ai', 'Demo N710', true)
on conflict (id) do update
set email = excluded.email,
    full_name = excluded.full_name,
    onboarding_completed = excluded.onboarding_completed;

insert into public.organizations (id, name, slug, owner_profile_id, segment, website, whatsapp_phone, metadata)
values
  ('10000000-0000-0000-0000-000000000001', 'Clinica Odontologica Prime', 'clinica-prime', '00000000-0000-0000-0000-000000000001', 'Odontologia', 'https://clinicaprime.example', '+55 11 98888-0000', '{"onboarding_completed": true}'::jsonb),
  ('10000000-0000-0000-0000-000000000002', 'Clinica Estetica Aurora', 'estetica-aurora', '00000000-0000-0000-0000-000000000001', 'Estetica', 'https://aurora.example', '+55 11 97777-0000', '{"onboarding_completed": true}'::jsonb),
  ('10000000-0000-0000-0000-000000000003', 'Imobiliaria Atlas', 'atlas-imoveis', '00000000-0000-0000-0000-000000000001', 'Imobiliaria', 'https://atlas.example', '+55 11 96666-0000', '{"onboarding_completed": true}'::jsonb),
  ('10000000-0000-0000-0000-000000000004', 'Agencia Norte Growth', 'norte-growth', '00000000-0000-0000-0000-000000000001', 'Agencia de marketing', 'https://nortegrowth.example', '+55 11 95555-0000', '{"onboarding_completed": true}'::jsonb)
on conflict (id) do update
set name = excluded.name,
    slug = excluded.slug,
    segment = excluded.segment,
    website = excluded.website,
    whatsapp_phone = excluded.whatsapp_phone,
    metadata = excluded.metadata;

insert into public.organization_members (organization_id, profile_id, role)
values
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'owner')
on conflict do nothing;

insert into public.subscriptions (organization_id, provider, provider_subscription_id, plan, status, metadata)
values ('10000000-0000-0000-0000-000000000001', 'cakto', 'sub_demo_001', 'pro', 'active', '{"source":"seed"}')
on conflict (provider, provider_subscription_id) do update
set plan = excluded.plan,
    status = excluded.status,
    metadata = excluded.metadata;

insert into public.agents (
  id,
  organization_id,
  name,
  niche,
  voice_tone,
  goal,
  products_services,
  common_objections,
  forbidden_answers,
  human_handoff_rules,
  business_hours,
  initial_message,
  custom_prompt,
  is_active
)
values
  ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Nina Odonto', 'Clinica odontologica', 'Consultivo, acolhedor e objetivo', 'Converter leads de implante e alinhadores em avaliacoes agendadas.', 'Implantes, alinhadores, clareamento e lentes dentais.', 'Preco, medo, parcelamento e tempo de tratamento.', 'Nao prometer resultado clinico nem inventar preco.', 'Encaminhar emergencias, reclamacoes e fechamento financeiro.', 'Segunda a sexta, 08:00 as 20:00', 'Ola! Sou a Nina da Clinica Prime. Como posso te ajudar?', 'Voce e um vendedor digital profissional da empresa {{company_name}}...', true),
  ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', 'Luna Estetica', 'Clinica estetica', 'Sofisticado, seguro e persuasivo', 'Agendar avaliacoes de estetica facial.', 'Harmonizacao, bioestimulador e skinbooster.', 'Medo, preco e naturalidade do resultado.', 'Nao fazer promessas medicas.', 'Encaminhar duvidas clinicas especificas.', 'Segunda a sabado, 09:00 as 19:00', 'Ola! Sou a Luna. Quer agendar uma avaliacao?', 'Voce e um vendedor digital profissional da empresa {{company_name}}...', true),
  ('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000003', 'Atlas Imoveis', 'Imobiliaria', 'Profissional e orientado a investimento', 'Qualificar compradores e agendar visitas.', 'Apartamentos, casas e imoveis comerciais.', 'Financiamento, localizacao e entrada.', 'Nao prometer aprovacao bancaria.', 'Encaminhar negociacao formal.', 'Todos os dias, 08:00 as 22:00', 'Ola! Que tipo de imovel voce procura?', 'Voce e um vendedor digital profissional da empresa {{company_name}}...', true)
on conflict (id) do update
set name = excluded.name,
    goal = excluded.goal,
    voice_tone = excluded.voice_tone,
    products_services = excluded.products_services,
    common_objections = excluded.common_objections,
    forbidden_answers = excluded.forbidden_answers,
    human_handoff_rules = excluded.human_handoff_rules,
    business_hours = excluded.business_hours,
    initial_message = excluded.initial_message,
    custom_prompt = excluded.custom_prompt,
    is_active = excluded.is_active;

insert into public.knowledge_base (organization_id, agent_id, title, category, content, source_type)
values
  ('10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'Precos', 'pricing', 'Avaliacao inicial a partir de R$150. Implantes tem orcamento personalizado apos avaliacao.', 'manual'),
  ('10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'Localizacao', 'location', 'A clinica fica proxima a Avenida Paulista, com estacionamento conveniado.', 'manual'),
  ('10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'Garantias', 'policies', 'Garantias dependem do procedimento e sao explicadas no contrato de tratamento.', 'manual')
on conflict do nothing;

insert into public.leads (id, organization_id, name, phone, email, niche, status, temperature, source, last_interaction_at, potential_value, notes)
values
  ('30000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','Mariana Alves','+55 11 98888-1201','mariana@email.com','Odontologia','scheduled','hot','WhatsApp',now(),7800,'Quer implante e agendou avaliacao.'),
  ('30000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000001','Carlos Mendes','+55 21 97777-3488','carlos@email.com','Imobiliaria','qualified','warm','Instagram',now() - interval '1 hour',420000,'Procura apartamento ate R$450k.'),
  ('30000000-0000-0000-0000-000000000003','10000000-0000-0000-0000-000000000001','Bianca Rocha','+55 31 96666-4481','bianca@email.com','Estetica','new','hot','WhatsApp',now() - interval '1 day',2400,'Interesse em bioestimulador.'),
  ('30000000-0000-0000-0000-000000000004','10000000-0000-0000-0000-000000000001','Rafael Nunes','+55 41 95555-6750','rafael@email.com','Marketing','qualified','warm','Landing page',now() - interval '1 day',12000,'Quer trafego pago.'),
  ('30000000-0000-0000-0000-000000000005','10000000-0000-0000-0000-000000000001','Paula Martins','+55 51 94444-0912','paula@email.com','Odontologia','lost','cold','WhatsApp',now() - interval '2 days',1800,'Entrou em recuperacao.'),
  ('30000000-0000-0000-0000-000000000006','10000000-0000-0000-0000-000000000001','Eduardo Lima','+55 85 93333-6420','eduardo@email.com','Imobiliaria','new','cold','Instagram',now() - interval '3 days',350000,'Ainda pesquisando bairros.'),
  ('30000000-0000-0000-0000-000000000007','10000000-0000-0000-0000-000000000001','Fernanda Reis','+55 61 92222-1199','fernanda@email.com','Estetica','won','hot','WhatsApp',now() - interval '4 days',3600,'Fechou pacote facial.'),
  ('30000000-0000-0000-0000-000000000008','10000000-0000-0000-0000-000000000001','Thiago Barros','+55 27 91111-5028','thiago@email.com','Servicos','qualified','warm','Indicacao',now() - interval '5 days',5600,'Precisa de orcamento formal.'),
  ('30000000-0000-0000-0000-000000000009','10000000-0000-0000-0000-000000000001','Juliana Costa','+55 47 90000-7711','juliana@email.com','Clinica','scheduled','hot','WhatsApp',now() - interval '6 days',1300,'Consulta confirmada.'),
  ('30000000-0000-0000-0000-000000000010','10000000-0000-0000-0000-000000000001','Bruno Teixeira','+55 19 98989-8044','bruno@email.com','Agencia','new','cold','Landing page',now() - interval '7 days',9000,'Ainda nao respondeu follow-up.')
on conflict (id) do nothing;

insert into public.conversations (id, organization_id, lead_id, agent_id, channel, status, summary, tags)
select
  gen_random_uuid(),
  l.organization_id,
  l.id,
  '20000000-0000-0000-0000-000000000001',
  'whatsapp',
  'active',
  l.notes,
  array[l.niche, l.status::text, l.temperature::text]
from public.leads l
where l.organization_id = '10000000-0000-0000-0000-000000000001'
on conflict do nothing;

insert into public.messages (organization_id, conversation_id, direction, role, content)
select organization_id, id, 'inbound', 'lead', 'Ola, queria entender melhor como funciona e quais sao os valores.'
from public.conversations
where organization_id = '10000000-0000-0000-0000-000000000001'
on conflict do nothing;

insert into public.messages (organization_id, conversation_id, direction, role, content)
select organization_id, id, 'outbound', 'agent', 'Claro. Para te orientar melhor, posso te fazer duas perguntas rapidas sobre o que voce precisa?'
from public.conversations
where organization_id = '10000000-0000-0000-0000-000000000001'
on conflict do nothing;

insert into public.messages (organization_id, conversation_id, direction, role, content)
select organization_id, id, 'inbound', 'lead', 'Pode sim. Tenho interesse em resolver ainda essa semana.'
from public.conversations
where organization_id = '10000000-0000-0000-0000-000000000001'
on conflict do nothing;

insert into public.automations (organization_id, name, trigger_key, wait_minutes, message, status)
values
  ('10000000-0000-0000-0000-000000000001','Novo lead','lead.created',0,'Mensagem inicial de boas-vindas e qualificacao.','active'),
  ('10000000-0000-0000-0000-000000000001','Lead sem resposta','message.no_reply',120,'Retomar beneficio principal e CTA.','active'),
  ('10000000-0000-0000-0000-000000000001','Recuperacao de orcamento','proposal.sent',1440,'Retomar proposta e remover objecao principal.','active'),
  ('10000000-0000-0000-0000-000000000001','Confirmacao de consulta','appointment.created',1440,'Confirmar consulta e instrucoes.','active'),
  ('10000000-0000-0000-0000-000000000001','Pos-atendimento','appointment.finished',180,'Pedir feedback e proxima acao.','inactive'),
  ('10000000-0000-0000-0000-000000000001','Follow-up de venda','lead.qualified',2880,'Retomar intencao e CTA de fechamento.','active')
on conflict (organization_id, trigger_key) do update
set name = excluded.name,
    wait_minutes = excluded.wait_minutes,
    message = excluded.message,
    status = excluded.status;

insert into public.integrations (organization_id, provider, status, settings, connected_at)
values
  ('10000000-0000-0000-0000-000000000001','supabase','connected','{}',now()),
  ('10000000-0000-0000-0000-000000000001','openai','available','{}',null),
  ('10000000-0000-0000-0000-000000000001','whatsapp','connected','{"webhook":"/api/webhooks/whatsapp"}',now()),
  ('10000000-0000-0000-0000-000000000001','cakto','available','{"webhook":"/api/webhooks/cakto"}',null),
  ('10000000-0000-0000-0000-000000000001','google_calendar','soon','{}',null),
  ('10000000-0000-0000-0000-000000000001','external_crm','soon','{}',null)
on conflict (organization_id, provider) do update
set status = excluded.status,
    settings = excluded.settings,
    connected_at = excluded.connected_at;

commit;
