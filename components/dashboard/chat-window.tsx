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
          description="Quando houver mensagens reais do WhatsApp ou Instagram, o histórico completo e o resumo da IA aparecerão aqui."
        />
      </Card>
    );
  }

  return (
    <Card className="flex min-h-[620px] flex-col">
      <div className="flex items-center justify-between border-b border-white/10 p-4">
        <div>
          <h2 className="font-semibold">{conversation.leadName}</h2>
          <p className="text-sm text-muted-foreground">Resumo IA: {conversation.summary}</p>
        </div>
        <Button variant="gold">Assumir atendimento</Button>
      </div>
      <div className="flex-1 space-y-4 overflow-auto p-4">
        {conversation.messages.length === 0 ? (
          <EmptyState title="Sem mensagens" description="Esta conversa ainda não tem mensagens salvas." />
        ) : null}
        {conversation.messages.map((message) => {
          const fromAgent = message.role === "agent";
          return (
            <div key={message.id} className={`flex gap-3 ${fromAgent ? "justify-end" : "justify-start"}`}>
              {!fromAgent ? (
                <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white/[0.06]">
                  <UserRound className="h-4 w-4" />
                </div>
              ) : null}
              <div className={`max-w-[78%] rounded-lg border p-3 text-sm ${fromAgent ? "border-violet/30 bg-violet/15" : "border-white/10 bg-white/[0.05]"}`}>
                <p>{message.content}</p>
                <span className="mt-2 block text-xs text-muted-foreground">{message.createdAt}</span>
              </div>
              {fromAgent ? (
                <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary">
                  <Bot className="h-4 w-4" />
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
      <div className="border-t border-white/10 p-4">
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
