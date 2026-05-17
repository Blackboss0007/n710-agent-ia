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
      <div className="border-b border-white/10 p-4">
        <h2 className="font-semibold">{title}</h2>
      </div>
      {conversations.length === 0 ? (
        <div className="p-4">
          <EmptyState title="Nenhuma conversa ainda" description="As conversas aparecerão aqui quando o webhook do WhatsApp receber mensagens." />
        </div>
      ) : null}
      <div className="divide-y divide-white/10">
        {conversations.map((conversation) => (
          <div key={conversation.id} className="flex cursor-pointer gap-3 p-4 transition-colors hover:bg-white/[0.04]">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-white/[0.06] text-violet">
              <MessageCircle className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-sm font-medium">{conversation.leadName}</p>
                <StatusBadge value="" tone={conversation.temperature} />
              </div>
              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{conversation.summary}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
