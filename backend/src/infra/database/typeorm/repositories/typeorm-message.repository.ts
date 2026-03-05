import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IMessageRepository, RecentConversation } from '../../../../domain/chat/repositories/message.repository';
import { MessageEntity } from '../../../../domain/chat/entities/message.entity';
import { MessageOrmEntity } from '../entities/message.orm-entity';

@Injectable()
export class TypeormMessageRepository implements IMessageRepository {
    constructor(
        @InjectRepository(MessageOrmEntity)
        private readonly repo: Repository<MessageOrmEntity>,
    ) { }

    private toDomain(orm: MessageOrmEntity): MessageEntity {
        return {
            id: orm.id,
            senderId: orm.senderId,
            receiverId: orm.receiverId,
            content: orm.content,
            read: orm.read,
            createdAt: orm.createdAt,
        };
    }

    async create(data: { senderId: string; receiverId: string; content: string }): Promise<MessageEntity> {
        const msg = this.repo.create({ ...data, read: false });
        const saved = await this.repo.save(msg);
        return this.toDomain(saved);
    }

    async findConversation(userAId: string, userBId: string): Promise<MessageEntity[]> {
        const msgs = await this.repo
            .createQueryBuilder('msg')
            .where(
                '(msg.senderId = :a AND msg.receiverId = :b) OR (msg.senderId = :b AND msg.receiverId = :a)',
                { a: userAId, b: userBId },
            )
            .orderBy('msg.createdAt', 'ASC')
            .getMany();
        return msgs.map(m => this.toDomain(m));
    }

    async markAsRead(senderId: string, receiverId: string): Promise<void> {
        await this.repo.update(
            { senderId, receiverId, read: false },
            { read: true },
        );
    }

    async getUnreadCount(userId: string): Promise<number> {
        return this.repo.count({ where: { receiverId: userId, read: false } });
    }

    async getRecentConversations(userId: string): Promise<RecentConversation[]> {
        // Busca todos os parceiros únicos de conversa com a última mensagem
        const rows = await this.repo
            .createQueryBuilder('msg')
            .select([
                'CASE WHEN msg.senderId = :userId THEN msg.receiverId ELSE msg.senderId END AS partnerId',
                'MAX(msg.createdAt) AS lastAt',
            ])
            .where('msg.senderId = :userId OR msg.receiverId = :userId', { userId })
            .groupBy('partnerId')
            .orderBy('lastAt', 'DESC')
            .setParameter('userId', userId)
            .getRawMany();

        const results: RecentConversation[] = [];

        for (const row of rows) {
            const partnerId = row.partnerId;

            // Última mensagem da conversa
            const lastMsg = await this.repo.findOne({
                where: [
                    { senderId: userId, receiverId: partnerId },
                    { senderId: partnerId, receiverId: userId },
                ],
                order: { createdAt: 'DESC' },
                relations: ['sender', 'receiver'],
            });

            if (!lastMsg) continue;

            const partner = lastMsg.senderId === userId ? lastMsg.receiver : lastMsg.sender;

            const unreadCount = await this.repo.count({
                where: { senderId: partnerId, receiverId: userId, read: false },
            });

            results.push({
                userId: partnerId,
                userName: partner?.name || 'Usuário',
                lastMessage: lastMsg.content,
                lastMessageAt: lastMsg.createdAt,
                unreadCount,
            });
        }

        return results;
    }
}

