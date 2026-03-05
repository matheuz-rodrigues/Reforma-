import { Injectable, Inject, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { IAdvertisementRepository } from '../../../domain/marketplace/repositories/advertisement.repository';

@Injectable()
export class DeleteAdvertisementUseCase {
    constructor(
        @Inject('IAdvertisementRepository')
        private readonly advertisementRepository: IAdvertisementRepository,
    ) { }

    async execute(id: string, userId: string): Promise<void> {
        const advertisement = await this.advertisementRepository.findById(id);

        if (!advertisement) {
            throw new NotFoundException('Anúncio não encontrado');
        }

        if (advertisement.sellerId !== userId) {
            throw new UnauthorizedException('Você não tem permissão para apagar este anúncio');
        }

        await this.advertisementRepository.delete(id);
    }
}
