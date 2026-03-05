import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IAdvertisementRepository } from '../../../domain/marketplace/repositories/advertisement.repository';
import { AdvertisementEntity } from '../../../domain/marketplace/entities/advertisement.entity';

@Injectable()
export class GetAdvertisementUseCase {
    constructor(
        @Inject('IAdvertisementRepository')
        private readonly advertisementRepository: IAdvertisementRepository,
    ) { }

    async execute(id: string): Promise<AdvertisementEntity> {
        const advertisement = await this.advertisementRepository.findById(id);

        if (!advertisement) {
            throw new NotFoundException('Anúncio não encontrado');
        }

        return advertisement;
    }
}
