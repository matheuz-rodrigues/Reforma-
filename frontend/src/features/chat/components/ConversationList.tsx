'use client';

import { useChatContext } from '../contexts/chat-context';
import { MessageCircle, X } from 'lucide-react';

export function ConversationList() {
    const {
        recentConversations,
        isConversationListOpen,
        toggleConversationList,
        openChat,
        totalUnread
    } = useChatContext();

    if (!isConversationListOpen) return null;

    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        const today = new Date();
        if (date.toDateString() === today.toDateString()) {
            return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        }
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    };

    return (
        <div className="fixed bottom-20 right-4 z-40 flex flex-col w-80 h-[400px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-primary" />
                    Mensagens
                    {totalUnread > 0 && (
                        <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {totalUnread}
                        </span>
                    )}
                </h3>
                <button
                    onClick={toggleConversationList}
                    className="h-7 w-7 rounded-full hover:bg-gray-200 flex items-center justify-center transition-colors text-gray-500"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto">
                {recentConversations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground gap-2 p-4">
                        <MessageCircle className="h-8 w-8 text-gray-300" />
                        <p className="text-sm">Nenhuma conversa recente.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {recentConversations.map((conv) => (
                            <button
                                key={conv.userId}
                                onClick={() => openChat(conv.userId, conv.userName)}
                                className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors text-left"
                            >
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary shrink-0 relative">
                                    {conv.userName.charAt(0).toUpperCase()}
                                    {conv.unreadCount > 0 && (
                                        <div className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full border-2 border-white" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-0.5">
                                        <p className="text-sm font-semibold text-gray-900 truncate pr-2">
                                            {conv.userName}
                                        </p>
                                        <span className="text-[10px] text-gray-400 shrink-0">
                                            {formatTime(conv.lastMessageAt)}
                                        </span>
                                    </div>
                                    <p className={`text-xs truncate ${conv.unreadCount > 0 ? 'font-semibold text-gray-800' : 'text-gray-500'}`}>
                                        {conv.lastMessage}
                                    </p>
                                </div>
                                {conv.unreadCount > 0 && (
                                    <div className="shrink-0 h-5 min-w-[20px] rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center px-1">
                                        {conv.unreadCount}
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
