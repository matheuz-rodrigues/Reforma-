import { AdvertisementEntity } from '../entities/advertisement.entity';

export interface IAdvertisementRepository {
    create(data: Omit<AdvertisementEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<AdvertisementEntity>;
    findById(id: string): Promise<AdvertisementEntity | null>;
    findAll(filters?: { category?: string; status?: string }): Promise<AdvertisementEntity[]>;
    update(id: string, data: Partial<AdvertisementEntity>): Promise<AdvertisementEntity>;
    delete(id: string): Promise<void>;
}
