import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../infra/database/database.module';
import { ChatGateway } from './chat.gateway';
import { SendMessageUseCase } from '../../application/chat/use-cases/send-message.use-case';
import { GetConversationUseCase } from '../../application/chat/use-cases/get-conversation.use-case';
import { GetRecentConversationsUseCase } from '../../application/chat/use-cases/get-recent-conversations.use-case';

@Module({
    imports: [DatabaseModule],
    providers: [
        ChatGateway,
        SendMessageUseCase,
        GetConversationUseCase,
        GetRecentConversationsUseCase,
    ],
})
export class ChatModule { }
