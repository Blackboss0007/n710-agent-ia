# N710 AI Sales Agent

SaaS multi-tenant para empresas configurarem um vendedor digital de IA com Supabase, OpenAI, webhooks de pagamento e atendimento via WhatsApp.

## Stack

- Next.js 14 + App Router
- TypeScript
- Tailwind CSS
- Supabase Auth, Database, Storage e RLS
- OpenAI API
- Vercel para deploy

## O que ja esta pronto

- Cadastro, login, logout e recuperacao de senha
- Middleware com protecao de rotas privadas
- Fluxo `login -> onboarding -> dashboard`
- Criacao automatica de `profile`, `organization`, `organization_member`, `subscription`, `agent` e integracoes base apos signup
- Dashboard privado com dados reais do Supabase
- Configuracao do agente IA
- Base de conhecimento
- Webhook Cakto
- Webhook WhatsApp
- Build de producao validado

## Variaveis de ambiente

Use `.env.local.example` para desenvolvimento local e `.env.example` como referencia de producao.

### `.env.local`

```env
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=SUA_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=SUA_SERVICE_ROLE_KEY
OPENAI_API_KEY=SUA_OPENAI_KEY
CAKTO_WEBHOOK_SECRET=teste
WHATSAPP_WEBHOOK_SECRET=teste
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Producao

```env
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=SUA_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=SUA_SERVICE_ROLE_KEY
OPENAI_API_KEY=SUA_OPENAI_KEY
CAKTO_WEBHOOK_SECRET=seu-secret-real
WHATSAPP_WEBHOOK_SECRET=seu-secret-real
NEXT_PUBLIC_APP_URL=https://meu-dominio.com
```

Se alguma env obrigatoria estiver faltando, o projeto agora mostra erro claro de configuracao em vez de quebrar com mensagem confusa do Supabase.

## Rodando localmente

1. Instale as dependencias:

```bash
npm install
```

2. Crie o arquivo local:

```bash
cp .env.local.example .env.local
```

3. Preencha a URL e as chaves do Supabase.

4. Rode o schema e o seed no Supabase SQL Editor:

```text
supabase/schema.sql
supabase/seed.sql
```

5. Inicie o projeto:

```bash
npm run dev
```

6. Abra [http://localhost:3000](http://localhost:3000)

## Comandos principais

```bash
npm run dev
npm run lint
npm run typecheck
npm run build
```

## Configurando o Supabase

1. Crie um projeto em [Supabase](https://supabase.com/).
2. Va em `Settings -> API`.
3. Copie:
   - `Project URL` -> `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` -> `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` -> `SUPABASE_SERVICE_ROLE_KEY`
4. Abra `SQL Editor`.
5. Execute `supabase/schema.sql`.
6. Execute `supabase/seed.sql`.

## Configurando Auth no Supabase

Em `Authentication -> URL Configuration`:

- `Site URL`
  - local: `http://localhost:3000`
  - producao: `https://meu-dominio.com`
- `Redirect URLs`
  - `http://localhost:3000/api/auth/callback`
  - `https://meu-dominio.com/api/auth/callback`

## Fluxo de autenticacao

- Usuario sem login -> `/login`
- Usuario logado sem onboarding -> `/onboarding`
- Usuario logado com onboarding -> `/dashboard`

O projeto usa `@supabase/ssr` com clients separados para browser, server e admin, alem de middleware para manter a sessao sincronizada com cookies.

## Schema do banco

O arquivo [supabase/schema.sql](/C:/Users/scrip/Documents/agente%20ia/supabase/schema.sql) cria:

- `profiles`
- `organizations`
- `organization_members`
- `subscriptions`
- `payments`
- `agents`
- `knowledge_base`
- `leads`
- `lead_events`
- `conversations`
- `messages`
- `automations`
- `integrations`
- `webhooks`
- `audit_logs`

Inclui:

- UUIDs
- `created_at` e `updated_at`
- indexes
- foreign keys
- trigger de `updated_at`
- RLS por organizacao
- bucket privado para `knowledge-base`
- trigger para provisionamento automatico apos signup

## Onboarding

A rota `/onboarding` salva:

- nome da empresa
- nicho
- site
- WhatsApp
- nome do agente
- tom de voz
- horario de atendimento
- servicos
- objecoes comuns
- mensagem inicial

Ao finalizar:

- marca onboarding como concluido
- atualiza `profiles`
- atualiza `organizations`
- cria ou atualiza o agente principal
- cria integracoes base

## Dashboard

Rotas privadas:

- `/dashboard`
- `/dashboard/leads`
- `/dashboard/conversations`
- `/dashboard/agent`
- `/dashboard/knowledge-base`
- `/dashboard/automations`
- `/dashboard/integrations`
- `/dashboard/plans`
- `/dashboard/settings`

Todos os paines possuem fallback para dados vazios, sem quebrar quando o tenant ainda nao tiver leads ou conversas.

## OpenAI

Arquivo principal: [lib/ai/openai.ts](/C:/Users/scrip/Documents/agente%20ia/lib/ai/openai.ts)

Funcoes disponiveis:

- `generateAgentResponse`
- `summarizeConversation`
- `classifyLeadTemperature`
- `extractLeadData`
- `suggestNextAction`

`OPENAI_API_KEY` e usada apenas no servidor.

## Webhook Cakto

Endpoint:

```http
POST /api/webhooks/cakto
```

Headers aceitos:

```http
X-Cakto-Signature: <CAKTO_WEBHOOK_SECRET>
Authorization: Bearer <CAKTO_WEBHOOK_SECRET>
```

O endpoint:

- valida secret
- ignora eventos fora dos aprovados
- evita duplicidade por `transaction_id`
- cria ou localiza usuario no Auth
- garante `profile`
- localiza organizacao do usuario
- cria ou atualiza `subscription`
- salva `payment`
- registra `webhook`, `integration` e `audit_log`

## Webhook WhatsApp

Endpoint:

```http
POST /api/webhooks/whatsapp
```

Headers aceitos:

```http
X-Whatsapp-Signature: <WHATSAPP_WEBHOOK_SECRET>
Authorization: Bearer <WHATSAPP_WEBHOOK_SECRET>
```

Payload minimo:

```json
{
  "tenant_slug": "clinica-prime",
  "from": "+5511999990000",
  "name": "Mariana",
  "message": "Quero saber sobre implantes",
  "provider_message_id": "wamid.123",
  "channel": "whatsapp"
}
```

O endpoint:

- valida secret
- evita mensagem duplicada
- identifica tenant
- cria ou atualiza lead
- cria conversa
- salva historico
- consulta configuracao do agente
- usa OpenAI para responder
- salva resposta, resumo, temperatura e proxima acao

## Deploy na Vercel

1. Suba o projeto para o GitHub.
2. Crie um projeto na Vercel e conecte o repositório.
3. Em `Project Settings -> Environment Variables`, adicione:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `OPENAI_API_KEY`
   - `CAKTO_WEBHOOK_SECRET`
   - `WHATSAPP_WEBHOOK_SECRET`
   - `NEXT_PUBLIC_APP_URL=https://meu-dominio.com`
4. Faça o deploy.
5. Atualize no Supabase:
   - `Site URL`
   - `Redirect URLs`
6. Teste login, onboarding e dashboard.

## Checklist de producao

- [ ] Projeto Supabase criado
- [ ] `schema.sql` executado
- [ ] `seed.sql` executado ou removido conforme ambiente
- [ ] Auth URLs configuradas
- [ ] Variaveis no Vercel configuradas
- [ ] Login testado
- [ ] Onboarding testado
- [ ] Dashboard carregando
- [ ] Webhook Cakto testado
- [ ] Webhook WhatsApp testado
- [ ] OpenAI respondendo
- [ ] `npm run build` sem falhas

## Como testar o login

1. Abra [http://localhost:3000](http://localhost:3000)
2. Va em `/register`
3. Crie a conta
4. Confirme o email, se o seu projeto estiver exigindo confirmacao
5. Faça login
6. Complete o onboarding
7. Acesse o dashboard

## Arquivos principais

- [middleware.ts](/C:/Users/scrip/Documents/agente%20ia/middleware.ts)
- [lib/supabase/browser.ts](/C:/Users/scrip/Documents/agente%20ia/lib/supabase/browser.ts)
- [lib/supabase/server.ts](/C:/Users/scrip/Documents/agente%20ia/lib/supabase/server.ts)
- [lib/supabase/admin.ts](/C:/Users/scrip/Documents/agente%20ia/lib/supabase/admin.ts)
- [app/api/auth/callback/route.ts](/C:/Users/scrip/Documents/agente%20ia/app/api/auth/callback/route.ts)
- [app/api/auth/logout/route.ts](/C:/Users/scrip/Documents/agente%20ia/app/api/auth/logout/route.ts)
- [app/onboarding/page.tsx](/C:/Users/scrip/Documents/agente%20ia/app/onboarding/page.tsx)
- [app/dashboard/page.tsx](/C:/Users/scrip/Documents/agente%20ia/app/dashboard/page.tsx)
- [app/api/webhooks/cakto/route.ts](/C:/Users/scrip/Documents/agente%20ia/app/api/webhooks/cakto/route.ts)
- [app/api/webhooks/whatsapp/route.ts](/C:/Users/scrip/Documents/agente%20ia/app/api/webhooks/whatsapp/route.ts)
