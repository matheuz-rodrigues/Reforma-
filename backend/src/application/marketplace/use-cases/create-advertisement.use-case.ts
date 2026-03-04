import { Injectable, Inject } from '@nestjs/common';
import { IAdvertisementRepository } from '../../../domain/marketplace/repositories/advertisement.repository';
import { AdvertisementEntity } from '../../../domain/marketplace/entities/advertisement.entity';

interface CreateAdvertisementDTO {
    title: string;
    description: string;
    price: number;
    originalPrice?: number;
    category: string;
    condition: 'novo' | 'usado' | 'sobra';
    sellerId: string;
    location?: string;
    images: string[];
}

@Injectable()
export class CreateAdvertisementUseCase {
    constructor(
        @Inject('IAdvertisementRepository')
        private readonly advertisementRepository: IAdvertisementRepository,
    ) { }

    async execute(data: CreateAdvertisementDTO): Promise<AdvertisementEntity> {
        // Here we could add validation, like checking if the seller exists

        return this.advertisementRepository.create({
            title: data.title,
            description: data.description,
            price: data.price,
            originalPrice: data.originalPrice,
            category: data.category,
            condition: data.condition,
            sellerId: data.sellerId,
            status: 'ativo',
            images: data.images,
            location: data.location,
        });
    }
}
