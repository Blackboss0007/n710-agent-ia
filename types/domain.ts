export type LeadTemperature = "hot" | "warm" | "cold";
export type LeadStatus = "new" | "qualified" | "scheduled" | "won" | "lost";
export type ConversationStatus = "active" | "waiting" | "human" | "closed";

export type Plan = {
  id: "starter" | "pro" | "scale";
  name: string;
  price: number;
  description: string;
  features: string[];
  highlighted?: boolean;
};

export type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string;
  niche: string;
  status: LeadStatus;
  temperature: LeadTemperature;
  source: string;
  lastInteraction: string;
  potentialValue: number;
  notes: string;
};

export type Message = {
  id: string;
  role: "lead" | "agent" | "human" | "system";
  content: string;
  createdAt: string;
};

export type Conversation = {
  id: string;
  leadName: string;
  channel: "whatsapp" | "instagram";
  status: ConversationStatus;
  temperature: LeadTemperature;
  summary: string;
  tags: string[];
  messages: Message[];
};

export type Agent = {
  id: string;
  name: string;
  niche: string;
  voiceTone: string;
  goal: string;
  isActive: boolean;
};

export type Automation = {
  id: string;
  name: string;
  trigger: string;
  wait: string;
  message: string;
  enabled: boolean;
};

export type Integration = {
  id: string;
  name: string;
  description: string;
  status: "connected" | "available" | "soon";
};
