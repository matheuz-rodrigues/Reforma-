import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../infra/database/database.module';
import { AdvertisementController } from './controllers/advertisement.controller';
import { CreateAdvertisementUseCase } from '../../application/marketplace/use-cases/create-advertisement.use-case';
import { ListAdvertisementsUseCase } from '../../application/marketplace/use-cases/list-advertisements.use-case';

@Module({
    imports: [DatabaseModule],
    controllers: [AdvertisementController],
    providers: [
        CreateAdvertisementUseCase,
        ListAdvertisementsUseCase,
    ],
})
export class MarketplaceModule { }
