import OpenAI from "openai";
import { z } from "zod";

export const baseAgentPrompt =
  "Você é um vendedor digital profissional da empresa {{company_name}}. Seu objetivo é atender leads, responder dúvidas, qualificar oportunidades, quebrar objeções e conduzir o cliente para agendamento ou compra. Seja claro, humano, objetivo e persuasivo. Nunca invente informações. Quando não souber responder, encaminhe para atendimento humano.";

const leadDataSchema = z.object({
  name: z.string().nullable(),
  phone: z.string().nullable(),
  email: z.string().nullable(),
  interest: z.string().nullable(),
  budget: z.string().nullable(),
  urgency: z.string().nullable()
});

export type AgentContext = {
  companyName: string;
  agentName: string;
  voiceTone: string;
  goal: string;
  productsServices: string;
  objections: string;
  forbiddenAnswers: string;
  humanHandoffRules: string;
  knowledgeBase: string;
  conversationHistory: Array<{ role: "lead" | "agent" | "human"; content: string }>;
  userMessage: string;
};

function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  return new OpenAI({ apiKey });
}

async function generateText(system: string, user: string, temperature = 0.4) {
  const client = getOpenAIClient();
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  const completion = await client.chat.completions.create({
    model,
    temperature,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user }
    ]
  });

  return completion.choices[0]?.message.content?.trim() || "";
}

export async function generateAgentResponse(context: AgentContext) {
  const system = `${baseAgentPrompt.replace("{{company_name}}", context.companyName)}

Agente: ${context.agentName}
Tom de voz: ${context.voiceTone}
Objetivo principal: ${context.goal}
Produtos/serviços: ${context.productsServices}
Objeções comuns: ${context.objections}
Respostas proibidas: ${context.forbiddenAnswers}
Quando chamar humano: ${context.humanHandoffRules}
Base de conhecimento:
${context.knowledgeBase}

Regras:
- Responda em português do Brasil.
- Seja breve, humano e comercial.
- Faça no máximo uma pergunta por mensagem.
- Se faltar informação crítica, diga que vai encaminhar para atendimento humano.`;

  const history = context.conversationHistory
    .slice(-12)
    .map((message) => `${message.role}: ${message.content}`)
    .join("\n");

  return generateText(
    system,
    `Histórico:\n${history}\n\nMensagem atual do lead:\n${context.userMessage}\n\nGere a próxima resposta do agente.`,
    0.35
  );
}

export async function summarizeConversation(messages: Array<{ role: string; content: string }>) {
  return generateText(
    "Resuma conversas comerciais em português com foco em intenção, objeções, dados coletados e próxima ação.",
    messages.map((message) => `${message.role}: ${message.content}`).join("\n"),
    0.2
  );
}

export async function classifyLeadTemperature(messages: Array<{ role: string; content: string }>) {
  const result = await generateText(
    "Classifique a temperatura de um lead como apenas uma palavra: hot, warm ou cold.",
    messages.map((message) => `${message.role}: ${message.content}`).join("\n"),
    0
  );

  if (result.toLowerCase().includes("hot")) return "hot";
  if (result.toLowerCase().includes("warm")) return "warm";
  return "cold";
}

export async function extractLeadData(messages: Array<{ role: string; content: string }>) {
  const result = await generateText(
    "Extraia dados comerciais do lead e responda somente JSON válido com name, phone, email, interest, budget e urgency.",
    messages.map((message) => `${message.role}: ${message.content}`).join("\n"),
    0
  );

  try {
    return leadDataSchema.parse(JSON.parse(result));
  } catch {
    return leadDataSchema.parse({
      name: null,
      phone: null,
      email: null,
      interest: null,
      budget: null,
      urgency: null
    });
  }
}

export async function suggestNextAction(messages: Array<{ role: string; content: string }>) {
  return generateText(
    "Sugira a próxima melhor ação comercial em uma frase objetiva.",
    messages.map((message) => `${message.role}: ${message.content}`).join("\n"),
    0.25
  );
}
