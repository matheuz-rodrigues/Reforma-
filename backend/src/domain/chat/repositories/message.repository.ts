import { MessageEntity } from '../entities/message.entity';

export interface RecentConversation {
    userId: string;
    userName: string;
    lastMessage: string;
    lastMessageAt: Date;
    unreadCount: number;
}

export interface IMessageRepository {
    create(data: { senderId: string; receiverId: string; content: string }): Promise<MessageEntity>;
    findConversation(userAId: string, userBId: string): Promise<MessageEntity[]>;
    markAsRead(senderId: string, receiverId: string): Promise<void>;
    getUnreadCount(userId: string): Promise<number>;
    getRecentConversations(userId: string): Promise<RecentConversation[]>;
}
