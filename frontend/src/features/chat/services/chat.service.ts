import { io, Socket } from 'socket.io-client';

export interface ChatMessage {
    id: string;
    senderId: string;
    receiverId: string;
    content: string;
    read: boolean;
    createdAt: string;
}

export interface RecentConversation {
    userId: string;
    userName: string;
    lastMessage: string;
    lastMessageAt: string;
    unreadCount: number;
}

let socket: Socket | null = null;

export const chatSocket = {
    connect(token: string) {
        if (socket?.connected) return socket;

        socket = io(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/chat`, {
            auth: { token },
            transports: ['websocket'],
        });

        return socket;
    },

    disconnect() {
        socket?.disconnect();
        socket = null;
    },

    onNewMessage(callback: (msg: ChatMessage) => void) {
        socket?.on('new_message', callback);
    },

    offNewMessage(callback: (msg: ChatMessage) => void) {
        socket?.off('new_message', callback);
    },

    onConversationHistory(callback: (msgs: ChatMessage[]) => void) {
        socket?.on('conversation_history', callback);
    },

    offConversationHistory(callback: (msgs: ChatMessage[]) => void) {
        socket?.off('conversation_history', callback);
    },

    sendMessage(receiverId: string, content: string) {
        socket?.emit('send_message', { receiverId, content });
    },

    getConversation(otherUserId: string) {
        socket?.emit('get_conversation', { otherUserId });
    },

    getRecentConversations() {
        socket?.emit('get_recent_conversations');
    },

    onRecentConversations(callback: (convs: RecentConversation[]) => void) {
        socket?.on('recent_conversations', callback);
    },

    offRecentConversations(callback: (convs: RecentConversation[]) => void) {
        socket?.off('recent_conversations', callback);
    },

    isConnected() {
        return socket?.connected ?? false;
    },
};
