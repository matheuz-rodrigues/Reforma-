import { Module } from '@nestjs/common';
import { DatabaseModule } from './infra/database/database.module';
import { AuthModule } from './presentation/auth/auth.module';
import { MarketplaceModule } from './presentation/marketplace/marketplace.module';
import { ChatModule } from './presentation/chat/chat.module';

@Module({
    imports: [
        DatabaseModule,
        AuthModule,
        MarketplaceModule,
        ChatModule,
    ],
})
export class AppModule { }

