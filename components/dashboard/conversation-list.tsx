import { MessageCircle } from "lucide-react";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import type { Conversation } from "@/types/domain";

export function ConversationList({
  conversations,
  title = "Conversas recentes"
}: {
  conversations: Conversation[];
  title?: string;
}) {
  return (
    <Card className="overflow-hidden">
      <div className="border-b border-white/10 p-5">
        <p className="text-xs uppercase tracking-[0.18em] text-white/40">activity</p>
        <h2 className="mt-2 font-semibold text-white">{title}</h2>
      </div>
      {conversations.length === 0 ? (
        <div className="p-4">
          <EmptyState title="Nenhuma conversa ainda" description="As conversas aparecerao aqui quando o webhook do WhatsApp receber mensagens." />
        </div>
      ) : null}
      <div className="divide-y divide-white/10">
        {conversations.map((conversation) => (
          <div key={conversation.id} className="flex cursor-pointer gap-3 p-4 transition-colors hover:bg-white/[0.04]">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/[0.04] text-cyan">
              <MessageCircle className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-sm font-medium text-white">{conversation.leadName}</p>
                <StatusBadge value="" tone={conversation.temperature} />
              </div>
              <p className="mt-2 line-clamp-2 text-xs leading-6 text-muted-foreground">{conversation.summary}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
