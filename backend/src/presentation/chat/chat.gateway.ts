import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';
import { SendMessageUseCase } from '../../application/chat/use-cases/send-message.use-case';
import { GetConversationUseCase } from '../../application/chat/use-cases/get-conversation.use-case';
import { GetRecentConversationsUseCase } from '../../application/chat/use-cases/get-recent-conversations.use-case';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
    namespace: '/chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    // mapa de userId -> socketId
    private connectedUsers = new Map<string, string>();

    constructor(
        private readonly sendMessageUseCase: SendMessageUseCase,
        private readonly getConversationUseCase: GetConversationUseCase,
        private readonly getRecentConversationsUseCase: GetRecentConversationsUseCase,
    ) { }

    handleConnection(client: Socket) {
        try {
            const token =
                (client.handshake.auth?.token as string) ||
                (client.handshake.headers?.authorization as string)?.replace('Bearer ', '');

            if (!token) {
                client.disconnect();
                return;
            }

            const payload = jwt.verify(token, process.env.JWT_SECRET || 'reforma-plus-secret-key') as { sub: string };
            const userId = payload.sub;

            client.data.userId = userId;
            client.join(`user:${userId}`);
            this.connectedUsers.set(userId, client.id);

            console.log(`Chat: usuário ${userId} conectado`);
        } catch {
            client.disconnect();
        }
    }

    handleDisconnect(client: Socket) {
        const userId = client.data?.userId;
        if (userId) {
            this.connectedUsers.delete(userId);
            console.log(`Chat: usuário ${userId} desconectado`);
        }
    }

    @SubscribeMessage('send_message')
    async handleSendMessage(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { receiverId: string; content: string },
    ) {
        const senderId = client.data.userId;
        if (!senderId || !data.receiverId || !data.content?.trim()) return;

        const message = await this.sendMessageUseCase.execute(senderId, data.receiverId, data.content.trim());

        // Retorna para o próprio remetente (todas as abas dele e a atual)
        this.server.to(`user:${senderId}`).emit('new_message', message);

        // Emite para o destinatário
        if (senderId !== data.receiverId) {
            this.server.to(`user:${data.receiverId}`).emit('new_message', message);
        }

        return message;
    }

    @SubscribeMessage('get_conversation')
    async handleGetConversation(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { otherUserId: string },
    ) {
        const userId = client.data.userId;
        if (!userId || !data.otherUserId) return;

        const messages = await this.getConversationUseCase.execute(userId, data.otherUserId);
        client.emit('conversation_history', messages);
        return messages;
    }

    @SubscribeMessage('mark_read')
    async handleMarkRead(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { senderId: string },
    ) {
        const receiverId = client.data.userId;
        if (!receiverId || !data.senderId) return;

        await this.getConversationUseCase['messageRepository']?.markAsRead(data.senderId, receiverId);
    }

    @SubscribeMessage('get_recent_conversations')
    async handleGetRecentConversations(@ConnectedSocket() client: Socket) {
        const userId = client.data.userId;
        if (!userId) return;

        const conversations = await this.getRecentConversationsUseCase.execute(userId);
        client.emit('recent_conversations', conversations);
        return conversations;
    }
}
