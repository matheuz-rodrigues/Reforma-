'use client';

import { MessageCircle } from 'lucide-react';
import { useChatContext } from '../contexts/chat-context';

export function ChatFAB() {
    const { toggleConversationList, totalUnread, activeConversation } = useChatContext();

    // Se a aba de chat ativa estiver aberta, escondemos o FAB para não poluir
    if (activeConversation) return null;

    return (
        <button
            onClick={toggleConversationList}
            className="fixed bottom-4 right-4 z-40 h-14 w-14 rounded-full bg-primary text-white shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center"
            title="Abrir mensagens"
        >
            <MessageCircle className="h-6 w-6" />
            {totalUnread > 0 && (
                <div className="absolute -top-1 -right-1 h-5 min-w-[20px] bg-red-500 rounded-full border-2 border-white text-white text-[10px] font-bold flex items-center justify-center px-1">
                    {totalUnread}
                </div>
            )}
        </button>
    );
}
