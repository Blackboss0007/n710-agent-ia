import { Bot, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Textarea } from "@/components/ui/textarea";
import type { Conversation } from "@/types/domain";

export function ChatWindow({ conversation }: { conversation: Conversation | null }) {
  if (!conversation) {
    return (
      <Card className="min-h-[620px] p-4">
        <EmptyState
          title="Selecione uma conversa"
          description="Quando houver mensagens reais do WhatsApp ou Instagram, o historico completo e o resumo da IA aparecerao aqui."
        />
      </Card>
    );
  }

  return (
    <Card className="flex min-h-[620px] flex-col">
      <div className="flex items-center justify-between border-b border-white/10 p-5">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-white/40">live thread</p>
          <h2 className="mt-2 font-semibold text-white">{conversation.leadName}</h2>
          <p className="mt-2 text-sm text-muted-foreground">Resumo IA: {conversation.summary}</p>
        </div>
        <Button variant="gold">Assumir atendimento</Button>
      </div>
      <div className="flex-1 space-y-4 overflow-auto p-5">
        {conversation.messages.length === 0 ? (
          <EmptyState title="Sem mensagens" description="Esta conversa ainda nao tem mensagens salvas." />
        ) : null}
        {conversation.messages.map((message) => {
          const fromAgent = message.role === "agent";
          return (
            <div key={message.id} className={`flex gap-3 ${fromAgent ? "justify-end" : "justify-start"}`}>
              {!fromAgent ? (
                <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/[0.05]">
                  <UserRound className="h-4 w-4" />
                </div>
              ) : null}
              <div className={`max-w-[78%] rounded-lg border p-3 text-sm ${fromAgent ? "border-primary/20 bg-primary/12" : "border-white/10 bg-white/[0.05]"}`}>
                <p>{message.content}</p>
                <span className="mt-2 block text-xs text-muted-foreground">{message.createdAt}</span>
              </div>
              {fromAgent ? (
                <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-primary/20 bg-primary/14">
                  <Bot className="h-4 w-4" />
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
      <div className="border-t border-white/10 p-5">
        <Textarea placeholder="Responder manualmente..." />
        <div className="mt-3 flex flex-wrap gap-2">
          {conversation.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-white/10 px-3 py-1 text-xs text-muted-foreground">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
}
