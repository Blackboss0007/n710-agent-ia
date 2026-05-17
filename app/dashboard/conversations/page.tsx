import { ChatWindow } from "@/components/dashboard/chat-window";
import { ConversationList } from "@/components/dashboard/conversation-list";
import { getConversationsData } from "@/lib/dashboard/queries";

export default async function ConversationsPage() {
  const { conversations, selectedConversation } = await getConversationsData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Conversas</h1>
        <p className="text-muted-foreground">Historico completo, resumo IA, tags e controle humano com mensagens reais.</p>
      </div>
      <div className="grid gap-5 xl:grid-cols-[390px_1fr]">
        <ConversationList conversations={conversations} title="Conversas" />
        <ChatWindow conversation={selectedConversation} />
      </div>
    </div>
  );
}
