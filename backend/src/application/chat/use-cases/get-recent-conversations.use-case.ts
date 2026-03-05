import { Inject, Injectable } from '@nestjs/common';
import { IMessageRepository, RecentConversation } from '../../../domain/chat/repositories/message.repository';

@Injectable()
export class GetRecentConversationsUseCase {
    constructor(
        @Inject('IMessageRepository')
        private readonly messageRepository: IMessageRepository,
    ) { }

    async execute(userId: string): Promise<RecentConversation[]> {
        return this.messageRepository.getRecentConversations(userId);
    }
}
