import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserOrmEntity } from './user.orm-entity';

@Entity('messages')
export class MessageOrmEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    senderId: string;

    @ManyToOne(() => UserOrmEntity)
    @JoinColumn({ name: 'senderId' })
    sender: UserOrmEntity;

    @Column()
    receiverId: string;

    @ManyToOne(() => UserOrmEntity)
    @JoinColumn({ name: 'receiverId' })
    receiver: UserOrmEntity;

    @Column('text')
    content: string;

    @Column({ default: false })
    read: boolean;

    @CreateDateColumn()
    createdAt: Date;
}
