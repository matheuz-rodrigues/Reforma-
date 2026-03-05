import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOrmEntity } from './typeorm/entities/user.orm-entity';
import { AdvertisementOrmEntity } from './typeorm/entities/advertisement.orm-entity';
import { MessageOrmEntity } from './typeorm/entities/message.orm-entity';
import { TypeormAdvertisementRepository } from './typeorm/repositories/typeorm-advertisement.repository';
import { TypeormMessageRepository } from './typeorm/repositories/typeorm-message.repository';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT, 10) || 3306,
            username: process.env.MYSQL_USER || 'reforma_user',
            password: process.env.MYSQL_PASSWORD || 'reforma_password',
            database: process.env.MYSQL_DATABASE || 'reforma_plus',
            entities: [UserOrmEntity, AdvertisementOrmEntity, MessageOrmEntity],
            synchronize: true, // Desabilitar em produção
        }),
        TypeOrmModule.forFeature([UserOrmEntity, AdvertisementOrmEntity, MessageOrmEntity]),
    ],
    providers: [
        {
            provide: 'IAdvertisementRepository',
            useClass: TypeormAdvertisementRepository,
        },
        {
            provide: 'IMessageRepository',
            useClass: TypeormMessageRepository,
        },
    ],
    exports: [TypeOrmModule, 'IAdvertisementRepository', 'IMessageRepository'],
})
export class DatabaseModule { }
