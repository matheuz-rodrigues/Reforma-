import { AdvertisementEntity } from '../entities/advertisement.entity';

export interface IAdvertisementRepository {
    create(data: Omit<AdvertisementEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<AdvertisementEntity>;
    findById(id: string): Promise<AdvertisementEntity | null>;
    findAll(filters?: { category?: string; status?: string; page?: number; limit?: number }): Promise<{ data: AdvertisementEntity[], total: number }>;
    update(id: string, data: Partial<AdvertisementEntity>): Promise<AdvertisementEntity>;
    delete(id: string): Promise<void>;
}
