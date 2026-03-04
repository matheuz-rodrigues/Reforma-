import { Injectable, Inject } from '@nestjs/common';
import { IAdvertisementRepository } from '../../../domain/marketplace/repositories/advertisement.repository';
import { AdvertisementEntity } from '../../../domain/marketplace/entities/advertisement.entity';

interface ListAdvertisementsParams {
    category?: string;
    status?: string;
}

@Injectable()
export class ListAdvertisementsUseCase {
    constructor(
        @Inject('IAdvertisementRepository')
        private readonly advertisementRepository: IAdvertisementRepository,
    ) { }

    async execute(params?: ListAdvertisementsParams): Promise<AdvertisementEntity[]> {
        return this.advertisementRepository.findAll(params);
    }
}
