import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IAdvertisementRepository } from '../../../../domain/marketplace/repositories/advertisement.repository';
import { AdvertisementEntity } from '../../../../domain/marketplace/entities/advertisement.entity';
import { AdvertisementOrmEntity } from '../entities/advertisement.orm-entity';

@Injectable()
export class TypeormAdvertisementRepository implements IAdvertisementRepository {
    constructor(
        @InjectRepository(AdvertisementOrmEntity)
        private readonly repository: Repository<AdvertisementOrmEntity>,
    ) { }

    private toDomain(ormEntity: AdvertisementOrmEntity): AdvertisementEntity {
        return {
            id: ormEntity.id,
            title: ormEntity.title,
            description: ormEntity.description,
            price: Number(ormEntity.price),
            originalPrice: ormEntity.originalPrice ? Number(ormEntity.originalPrice) : undefined,
            category: ormEntity.category,
            condition: ormEntity.condition,
            sellerId: ormEntity.sellerId,
            sellerName: ormEntity.seller?.name,
            status: ormEntity.status,
            images: ormEntity.images,
            location: ormEntity.location,
            latitude: ormEntity.latitude ? Number(ormEntity.latitude) : undefined,
            longitude: ormEntity.longitude ? Number(ormEntity.longitude) : undefined,
            createdAt: ormEntity.createdAt,
            updatedAt: ormEntity.updatedAt,
        };
    }

    async create(data: Omit<AdvertisementEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<AdvertisementEntity> {
        const entity = this.repository.create({
            title: data.title,
            description: data.description,
            price: data.price,
            originalPrice: data.originalPrice,
            category: data.category,
            condition: data.condition,
            sellerId: data.sellerId,
            status: data.status,
            images: data.images,
            location: data.location,
            latitude: data.latitude,
            longitude: data.longitude,
        });

        const saved = await this.repository.save(entity);
        return this.toDomain(saved);
    }

    async findById(id: string): Promise<AdvertisementEntity | null> {
        const entity = await this.repository.findOne({ where: { id } });
        if (!entity) return null;
        return this.toDomain(entity);
    }

    async findAll(filters?: { category?: string; status?: string; page?: number; limit?: number }): Promise<{ data: AdvertisementEntity[], total: number }> {
        const query = this.repository.createQueryBuilder('adv')
            .leftJoinAndSelect('adv.seller', 'seller');

        if (filters?.category) {
            query.andWhere('adv.category = :category', { category: filters.category });
        }

        if (filters?.status) {
            query.andWhere('adv.status = :status', { status: filters.status });
        } else {
            // Default to 'ativo' if not specified
            query.andWhere('adv.status = :status', { status: 'ativo' });
        }

        query.orderBy('adv.createdAt', 'DESC');

        if (filters?.page && filters?.limit) {
            const skip = (filters.page - 1) * filters.limit;
            query.skip(skip).take(filters.limit);
        }

        const [entities, total] = await query.getManyAndCount();
        return { data: entities.map(e => this.toDomain(e)), total };
    }

    async update(id: string, data: Partial<AdvertisementEntity>): Promise<AdvertisementEntity> {
        await this.repository.update(id, data);
        const updated = await this.findById(id);
        if (!updated) {
            throw new Error(`Advertisement with id ${id} not found after update`);
        }
        return updated;
    }

    async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }
}
