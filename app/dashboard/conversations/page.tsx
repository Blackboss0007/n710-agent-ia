import { ChatWindow } from "@/components/dashboard/chat-window";
import { ConversationList } from "@/components/dashboard/conversation-list";
import { getConversationsData } from "@/lib/dashboard/queries";

export default async function ConversationsPage() {
  const { conversations, selectedConversation } = await getConversationsData();

  return (
    <div className="space-y-6">
      <section className="hero-outline rounded-lg px-6 py-8">
        <div className="max-w-3xl">
          <div className="eyebrow-chip">conversation intelligence</div>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white">Conversas</h1>
          <p className="mt-4 text-base leading-8 text-muted-foreground">
            Threads, resumos de IA, tags e takeover humano em uma interface feita para leitura rapida e decisao.
          </p>
        </div>
      </section>
      <div className="grid gap-5 xl:grid-cols-[390px_1fr]">
        <ConversationList conversations={conversations} title="Fila priorizada" />
        <ChatWindow conversation={selectedConversation} />
      </div>
    </div>
  );
}
