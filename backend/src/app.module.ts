import { Module } from '@nestjs/common';
import { DatabaseModule } from './infra/database/database.module';
import { AuthModule } from './presentation/auth/auth.module';
import { MarketplaceModule } from './presentation/marketplace/marketplace.module';

@Module({
    imports: [
        DatabaseModule,
        AuthModule,
        MarketplaceModule,
    ],
})
export class AppModule { }
