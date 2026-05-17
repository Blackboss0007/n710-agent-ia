import { FileUp, Plus, Save } from "lucide-react";
import {
  addQuestionAnswerAction,
  saveKnowledgeBaseAction,
  uploadKnowledgeDocumentAction
} from "@/app/dashboard/knowledge-base/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { KnowledgeBaseRow } from "@/lib/dashboard/queries";

const fields = [
  { category: "company", title: "Informacoes da empresa" },
  { category: "products", title: "Produtos e servicos" },
  { category: "pricing", title: "Precos" },
  { category: "guarantees", title: "Garantias" },
  { category: "hours", title: "Horarios" },
  { category: "location", title: "Localizacao" },
  { category: "differentials", title: "Diferenciais" },
  { category: "policies", title: "Politicas" }
];

export function KnowledgeBaseEditor({
  items,
  agentId
}: {
  items: KnowledgeBaseRow[];
  agentId: string | null;
}) {
  const qaItems = items.filter((item) => item.category === "qa");
  const documentItems = items.filter((item) => item.category === "document");

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
      <Card>
        <CardHeader>
          <CardTitle>Base de Conhecimento</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={saveKnowledgeBaseAction} className="grid gap-4">
            <input type="hidden" name="agent_id" value={agentId ?? ""} />
            {fields.map((field) => {
              const item = items.find((candidate) => candidate.category === field.category);

              return (
                <div key={field.category} className="space-y-2">
                  <input type="hidden" name={`id:${field.category}`} value={item?.id ?? ""} />
                  <input type="hidden" name={`title:${field.category}`} value={field.title} />
                  <Label htmlFor={`content:${field.category}`}>{field.title}</Label>
                  <Textarea
                    id={`content:${field.category}`}
                    name={`content:${field.category}`}
                    defaultValue={item?.content ?? ""}
                    placeholder={`Adicione ${field.title.toLowerCase()} para treinar a IA.`}
                  />
                </div>
              );
            })}
            <Button type="submit" className="w-fit">
              <Save className="mr-2 h-4 w-4" />
              Salvar base
            </Button>
          </form>

          <form action={addQuestionAnswerAction} className="mt-6 grid gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-4">
            <input type="hidden" name="agent_id" value={agentId ?? ""} />
            <Label>Perguntas e respostas</Label>
            <div className="grid gap-3 md:grid-cols-2">
              <Input name="question" placeholder="Pergunta frequente" />
              <Input name="answer" placeholder="Resposta aprovada" />
            </div>
            <Button type="submit" variant="outline" className="w-fit">
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Q&A
            </Button>
            {qaItems.length > 0 ? (
              <div className="mt-2 divide-y divide-white/10 rounded-md border border-white/10">
                {qaItems.map((item) => (
                  <div key={item.id} className="p-3">
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{item.content}</p>
                  </div>
                ))}
              </div>
            ) : null}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upload de documentos</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={uploadKnowledgeDocumentAction} className="flex min-h-60 flex-col items-center justify-center rounded-lg border border-dashed border-white/15 bg-white/[0.03] p-6 text-center">
            <input type="hidden" name="agent_id" value={agentId ?? ""} />
            <FileUp className="mb-3 h-9 w-9 text-violet" />
            <p className="font-medium">Enviar PDFs, DOCX ou TXT</p>
            <p className="mt-1 text-sm text-muted-foreground">Os arquivos sao salvos no Supabase Storage privado e vinculados a organizacao.</p>
            <Input className="mt-5" name="file" type="file" accept=".pdf,.txt,.md,.docx" />
            <Button className="mt-4" type="submit" variant="gold">
              Enviar documento
            </Button>
          </form>
          {documentItems.length > 0 ? (
            <div className="mt-5 space-y-2">
              <p className="text-sm font-medium">Documentos enviados</p>
              {documentItems.map((item) => (
                <div key={item.id} className="rounded-md border border-white/10 bg-white/[0.03] p-3 text-sm">
                  <p>{item.title}</p>
                  <p className="mt-1 truncate text-xs text-muted-foreground">{item.file_path}</p>
                </div>
              ))}
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
