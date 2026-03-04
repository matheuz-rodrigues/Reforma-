import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOrmEntity } from './typeorm/entities/user.orm-entity';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT, 10) || 3306,
            username: process.env.MYSQL_USER || 'reforma_user',
            password: process.env.MYSQL_PASSWORD || 'reforma_password',
            database: process.env.MYSQL_DATABASE || 'reforma_plus',
            entities: [UserOrmEntity],
            synchronize: true, // Desabilitar em produção
        }),
        TypeOrmModule.forFeature([UserOrmEntity]),
    ],
    exports: [TypeOrmModule],
})
export class DatabaseModule { }
