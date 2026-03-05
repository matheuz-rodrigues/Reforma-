'use client';

import { createContext, useContext, useEffect, useState, useCallback, useRef, type ReactNode } from 'react';
import { chatSocket, ChatMessage, RecentConversation } from '../services/chat.service';

interface ChatConversation {
    userId: string;
    userName: string;
    messages: ChatMessage[];
    unreadCount: number;
}

interface ChatContextData {
    openChat: (userId: string, userName: string) => void;
    closeChat: () => void;
    activeConversation: { userId: string; userName: string } | null;
    messages: ChatMessage[];
    sendMessage: (content: string) => void;
    totalUnread: number;
    isConnected: boolean;
    recentConversations: RecentConversation[];
    isConversationListOpen: boolean;
    toggleConversationList: () => void;
}

const ChatContext = createContext<ChatContextData>({} as ChatContextData);

export function ChatProvider({ children, token, currentUserId }: { children: ReactNode; token: string | null; currentUserId: string | null }) {
    const [activeConversation, setActiveConversation] = useState<{ userId: string; userName: string } | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [recentConversations, setRecentConversations] = useState<RecentConversation[]>([]);
    const [isConversationListOpen, setIsConversationListOpen] = useState(false);
    const [totalUnread, setTotalUnread] = useState(0);
    const [isConnected, setIsConnected] = useState(false);
    const unreadRef = useRef<Map<string, number>>(new Map());

    useEffect(() => {
        if (!token || !currentUserId) return;

        const socket = chatSocket.connect(token);

        socket.on('connect', () => setIsConnected(true));
        socket.on('disconnect', () => setIsConnected(false));

        const handleNewMessage = (msg: ChatMessage) => {
            // Se a mensagem é para a conversa ativa, adiciona direto
            setMessages(prev => {
                const isActiveConv =
                    (msg.senderId === currentUserId && msg.receiverId === activeConversationRef.current?.userId) ||
                    (msg.receiverId === currentUserId && msg.senderId === activeConversationRef.current?.userId);

                if (isActiveConv) return [...prev, msg];
                return prev;
            });

            // Contagem de não lidas para conversas inativas e atualiza lista global
            if (msg.receiverId === currentUserId && msg.senderId !== activeConversationRef.current?.userId) {
                unreadRef.current.set(msg.senderId, (unreadRef.current.get(msg.senderId) || 0) + 1);
                setTotalUnread(Array.from(unreadRef.current.values()).reduce((a, b) => a + b, 0));
            }

            // Sempre atualiza as conversas recentes ao chegar mensagem
            chatSocket.getRecentConversations();
        };

        chatSocket.onNewMessage(handleNewMessage);

        chatSocket.onConversationHistory((msgs) => {
            setMessages(msgs);
        });

        chatSocket.onRecentConversations((convs) => {
            setRecentConversations(convs);
            setTotalUnread(convs.reduce((sum, c) => sum + c.unreadCount, 0));
        });

        return () => {
            chatSocket.offNewMessage(handleNewMessage);
            chatSocket.offConversationHistory(() => { });
            chatSocket.offRecentConversations(() => { });
            chatSocket.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token, currentUserId]);

    // Ref para acessar o estado atual da conversa ativa dentro do handler
    const activeConversationRef = useRef(activeConversation);
    useEffect(() => { activeConversationRef.current = activeConversation; }, [activeConversation]);

    const openChat = useCallback((userId: string, userName: string) => {
        setActiveConversation({ userId, userName });
        setIsConversationListOpen(false);
        setMessages([]);
        // Limpa não lidas desta conversa no estado local
        setRecentConversations(prev => prev.map(c => c.userId === userId ? { ...c, unreadCount: 0 } : c));
        setTotalUnread(recentConversations.reduce((sum, c) => sum + (c.userId === userId ? 0 : c.unreadCount), 0));
        unreadRef.current.delete(userId);

        chatSocket.getConversation(userId);
    }, [recentConversations]);

    const closeChat = useCallback(() => {
        setActiveConversation(null);
        setMessages([]);
        chatSocket.getRecentConversations();
    }, []);

    const toggleConversationList = useCallback(() => {
        if (!isConversationListOpen && isConnected) {
            chatSocket.getRecentConversations();
        }
        setIsConversationListOpen(prev => !prev);
    }, [isConversationListOpen, isConnected]);

    const sendMessage = useCallback((content: string) => {
        if (!activeConversationRef.current) return;
        chatSocket.sendMessage(activeConversationRef.current.userId, content);
    }, []);

    return (
        <ChatContext.Provider value={{
            openChat, closeChat, activeConversation, messages, sendMessage, totalUnread, isConnected,
            recentConversations, isConversationListOpen, toggleConversationList
        }}>
            {children}
        </ChatContext.Provider>
    );
}

export function useChatContext() {
    return useContext(ChatContext);
}
