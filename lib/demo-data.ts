import type { Agent, Automation, Conversation, Integration, Lead, Plan } from "@/types/domain";

export const plans: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    price: 497,
    description: "Para empresas que querem colocar o primeiro vendedor de IA em produção.",
    features: ["1 agente IA", "1 empresa", "Histórico de conversas", "Base de conhecimento", "Painel básico"]
  },
  {
    id: "pro",
    name: "Pro",
    price: 997,
    description: "Para times que precisam de follow-up, fluxos e personalização.",
    highlighted: true,
    features: ["Tudo do Starter", "Follow-up automático", "Múltiplos fluxos", "Relatórios", "Personalização avançada"]
  },
  {
    id: "scale",
    name: "Scale",
    price: 1997,
    description: "Para operações com múltiplas unidades, integrações e suporte prioritário.",
    features: ["Múltiplos agentes", "Múltiplas unidades", "Integrações avançadas", "Suporte prioritário"]
  }
];

export const demoAgents: Agent[] = [
  {
    id: "agent-odonto",
    name: "Nina Odonto",
    niche: "Clínica odontológica",
    voiceTone: "Consultivo, acolhedor e objetivo",
    goal: "Converter leads de implante e alinhadores em avaliações agendadas.",
    isActive: true
  },
  {
    id: "agent-estetica",
    name: "Luna Estética",
    niche: "Clínica estética",
    voiceTone: "Sofisticado, seguro e persuasivo",
    goal: "Qualificar interesse em harmonização e fechar avaliação.",
    isActive: true
  },
  {
    id: "agent-imob",
    name: "Atlas Imóveis",
    niche: "Imobiliária",
    voiceTone: "Profissional, prático e orientado a investimento",
    goal: "Entender perfil do comprador e agendar visita.",
    isActive: false
  }
];

export const demoLeads: Lead[] = [
  {
    id: "lead-1",
    name: "Mariana Alves",
    phone: "+55 11 98888-1201",
    email: "mariana@email.com",
    niche: "Odontologia",
    status: "scheduled",
    temperature: "hot",
    source: "WhatsApp",
    lastInteraction: "Hoje, 10:42",
    potentialValue: 7800,
    notes: "Quer implante, pediu parcelamento e agendou avaliação."
  },
  {
    id: "lead-2",
    name: "Carlos Mendes",
    phone: "+55 21 97777-3488",
    email: "carlos@email.com",
    niche: "Imobiliária",
    status: "qualified",
    temperature: "warm",
    source: "Instagram",
    lastInteraction: "Hoje, 09:18",
    potentialValue: 420000,
    notes: "Procura apartamento até R$450k perto do metrô."
  },
  {
    id: "lead-3",
    name: "Bianca Rocha",
    phone: "+55 31 96666-4481",
    email: "bianca@email.com",
    niche: "Estética",
    status: "new",
    temperature: "hot",
    source: "WhatsApp",
    lastInteraction: "Ontem, 18:05",
    potentialValue: 2400,
    notes: "Perguntou disponibilidade para bioestimulador."
  },
  {
    id: "lead-4",
    name: "Rafael Nunes",
    phone: "+55 41 95555-6750",
    email: "rafael@email.com",
    niche: "Marketing",
    status: "qualified",
    temperature: "warm",
    source: "Landing page",
    lastInteraction: "Ontem, 14:21",
    potentialValue: 12000,
    notes: "Quer tráfego pago para clínica local."
  },
  {
    id: "lead-5",
    name: "Paula Martins",
    phone: "+55 51 94444-0912",
    email: "paula@email.com",
    niche: "Odontologia",
    status: "lost",
    temperature: "cold",
    source: "WhatsApp",
    lastInteraction: "14/05/2026",
    potentialValue: 1800,
    notes: "Achou caro, entrou no fluxo de recuperação."
  },
  {
    id: "lead-6",
    name: "Eduardo Lima",
    phone: "+55 85 93333-6420",
    email: "eduardo@email.com",
    niche: "Imobiliária",
    status: "new",
    temperature: "cold",
    source: "Instagram",
    lastInteraction: "13/05/2026",
    potentialValue: 350000,
    notes: "Ainda pesquisando bairros."
  },
  {
    id: "lead-7",
    name: "Fernanda Reis",
    phone: "+55 61 92222-1199",
    email: "fernanda@email.com",
    niche: "Estética",
    status: "won",
    temperature: "hot",
    source: "WhatsApp",
    lastInteraction: "12/05/2026",
    potentialValue: 3600,
    notes: "Fechou pacote de tratamento facial."
  },
  {
    id: "lead-8",
    name: "Thiago Barros",
    phone: "+55 27 91111-5028",
    email: "thiago@email.com",
    niche: "Prestador de serviço",
    status: "qualified",
    temperature: "warm",
    source: "Indicação",
    lastInteraction: "11/05/2026",
    potentialValue: 5600,
    notes: "Precisa de orçamento formal."
  },
  {
    id: "lead-9",
    name: "Juliana Costa",
    phone: "+55 47 90000-7711",
    email: "juliana@email.com",
    niche: "Clínica",
    status: "scheduled",
    temperature: "hot",
    source: "WhatsApp",
    lastInteraction: "10/05/2026",
    potentialValue: 1300,
    notes: "Consulta confirmada para quinta-feira."
  },
  {
    id: "lead-10",
    name: "Bruno Teixeira",
    phone: "+55 19 98989-8044",
    email: "bruno@email.com",
    niche: "Agência",
    status: "new",
    temperature: "cold",
    source: "Landing page",
    lastInteraction: "09/05/2026",
    potentialValue: 9000,
    notes: "Baixou material e ainda não respondeu follow-up."
  }
];

export const demoConversations: Conversation[] = demoLeads.slice(0, 10).map((lead, index) => ({
  id: `conv-${index + 1}`,
  leadName: lead.name,
  channel: index % 3 === 0 ? "instagram" : "whatsapp",
  status: index % 4 === 0 ? "human" : index % 2 === 0 ? "active" : "waiting",
  temperature: lead.temperature,
  summary: lead.notes,
  tags: [lead.niche, lead.status, lead.temperature],
  messages: [
    {
      id: `m-${index}-1`,
      role: "lead",
      content: "Olá, queria entender melhor como funciona e quais são os valores.",
      createdAt: "10:32"
    },
    {
      id: `m-${index}-2`,
      role: "agent",
      content: "Claro. Para te orientar melhor, posso te fazer duas perguntas rápidas sobre o que você precisa?",
      createdAt: "10:33"
    },
    {
      id: `m-${index}-3`,
      role: "lead",
      content: "Pode sim. Tenho interesse em resolver ainda essa semana.",
      createdAt: "10:34"
    }
  ]
}));

export const demoAutomations: Automation[] = [
  {
    id: "auto-new-lead",
    name: "Novo lead",
    trigger: "lead.created",
    wait: "Imediato",
    message: "Boas-vindas, qualificação inicial e pergunta de intenção.",
    enabled: true
  },
  {
    id: "auto-no-reply",
    name: "Lead sem resposta",
    trigger: "message.no_reply",
    wait: "2 horas",
    message: "Follow-up curto retomando o benefício principal.",
    enabled: true
  },
  {
    id: "auto-budget",
    name: "Recuperação de orçamento",
    trigger: "proposal.sent",
    wait: "24 horas",
    message: "Quebra de objeção com urgência e chamada para decisão.",
    enabled: true
  },
  {
    id: "auto-confirmation",
    name: "Confirmação de consulta",
    trigger: "appointment.created",
    wait: "1 dia antes",
    message: "Confirma presença, horário, endereço e instruções.",
    enabled: true
  },
  {
    id: "auto-aftercare",
    name: "Pós-atendimento",
    trigger: "appointment.finished",
    wait: "3 horas",
    message: "Coleta feedback, próximos passos e oportunidade adicional.",
    enabled: false
  },
  {
    id: "auto-sales-follow-up",
    name: "Follow-up de venda",
    trigger: "lead.qualified",
    wait: "48 horas",
    message: "Retoma intenção, prova social e CTA para compra/agendamento.",
    enabled: true
  }
];

export const demoIntegrations: Integration[] = [
  {
    id: "whatsapp",
    name: "WhatsApp Webhook",
    description: "Receba mensagens, gere respostas com IA e devolva ao provedor WhatsApp.",
    status: "connected"
  },
  {
    id: "instagram",
    name: "Instagram Webhook",
    description: "Preparado para mensagens diretas e automações futuras.",
    status: "soon"
  },
  {
    id: "cakto",
    name: "Cakto",
    description: "Liberação automática de acesso após compra aprovada.",
    status: "available"
  },
  {
    id: "calendar",
    name: "Google Calendar",
    description: "Agenda automática de consultas e reuniões.",
    status: "soon"
  },
  {
    id: "crm",
    name: "CRM externo",
    description: "Sincronização com funil comercial e oportunidades.",
    status: "soon"
  }
];
