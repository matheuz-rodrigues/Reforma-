import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserOrmEntity } from '../../../../infra/database/typeorm/entities/user.orm-entity';

@Entity('advertisements')
export class AdvertisementOrmEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column('text')
    description: string;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    originalPrice?: number;

    @Column()
    category: string;

    @Column({ type: 'enum', enum: ['novo', 'usado', 'sobra'] })
    condition: 'novo' | 'usado' | 'sobra';

    @Column()
    sellerId: string;

    @ManyToOne(() => UserOrmEntity)
    @JoinColumn({ name: 'sellerId' })
    seller: UserOrmEntity;

    @Column({ type: 'enum', enum: ['ativo', 'inativo', 'vendido'], default: 'ativo' })
    status: 'ativo' | 'inativo' | 'vendido';

    @Column('simple-array')
    images: string[];

    @Column({ nullable: true })
    location?: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
