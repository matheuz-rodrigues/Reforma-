import { Inject, Injectable } from '@nestjs/common';
import { IMessageRepository } from '../../../domain/chat/repositories/message.repository';
import { MessageEntity } from '../../../domain/chat/entities/message.entity';

@Injectable()
export class SendMessageUseCase {
    constructor(
        @Inject('IMessageRepository')
        private readonly messageRepository: IMessageRepository,
    ) { }

    async execute(senderId: string, receiverId: string, content: string): Promise<MessageEntity> {
        return this.messageRepository.create({ senderId, receiverId, content });
    }
}
