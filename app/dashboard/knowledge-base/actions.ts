"use server";

import { revalidatePath } from "next/cache";
import { requireOrganization } from "@/lib/dashboard/queries";

const categories = [
  "company",
  "products",
  "pricing",
  "guarantees",
  "hours",
  "location",
  "differentials",
  "policies"
];

export async function saveKnowledgeBaseAction(formData: FormData) {
  const { supabase, organization } = await requireOrganization();
  if (!organization) return;

  const agentId = getValue(formData, "agent_id") || null;

  for (const category of categories) {
    const id = getValue(formData, `id:${category}`);
    const title = getValue(formData, `title:${category}`);
    const content = getValue(formData, `content:${category}`);

    if (!content) continue;

    const payload = {
      organization_id: organization.id,
      agent_id: agentId,
      title,
      content,
      category,
      source_type: "manual"
    };

    const result = id
      ? await supabase.from("knowledge_base").update(payload).eq("id", id).eq("organization_id", organization.id)
      : await supabase.from("knowledge_base").insert(payload);

    if (result.error) {
      throw new Error(result.error.message);
    }
  }

  revalidatePath("/dashboard/knowledge-base");
}

export async function addQuestionAnswerAction(formData: FormData) {
  const { supabase, organization } = await requireOrganization();
  if (!organization) return;

  const question = getValue(formData, "question");
  const answer = getValue(formData, "answer");
  const agentId = getValue(formData, "agent_id") || null;

  if (!question || !answer) return;

  const { error } = await supabase.from("knowledge_base").insert({
    organization_id: organization.id,
    agent_id: agentId,
    title: question,
    content: answer,
    category: "qa",
    source_type: "manual"
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/knowledge-base");
}

export async function uploadKnowledgeDocumentAction(formData: FormData) {
  const { supabase, organization } = await requireOrganization();
  if (!organization) return;

  const file = formData.get("file");
  const agentId = getValue(formData, "agent_id") || null;

  if (!(file instanceof File) || file.size === 0) return;

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const path = `${organization.id}/${Date.now()}-${safeName}`;
  const upload = await supabase.storage.from("knowledge-base").upload(path, file, {
    upsert: false,
    contentType: file.type || "application/octet-stream"
  });

  if (upload.error) {
    throw new Error(upload.error.message);
  }

  const { error } = await supabase.from("knowledge_base").insert({
    organization_id: organization.id,
    agent_id: agentId,
    title: file.name,
    content: `Documento enviado para treinamento: ${file.name}`,
    category: "document",
    source_type: "upload",
    file_path: path,
    metadata: {
      size: file.size,
      type: file.type
    }
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/knowledge-base");
}

function getValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}
