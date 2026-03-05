import { Inject, Injectable } from '@nestjs/common';
import { IMessageRepository } from '../../../domain/chat/repositories/message.repository';
import { MessageEntity } from '../../../domain/chat/entities/message.entity';

@Injectable()
export class GetConversationUseCase {
    constructor(
        @Inject('IMessageRepository')
        private readonly messageRepository: IMessageRepository,
    ) { }

    async execute(userAId: string, userBId: string): Promise<MessageEntity[]> {
        await this.messageRepository.markAsRead(userBId, userAId);
        return this.messageRepository.findConversation(userAId, userBId);
    }
}
