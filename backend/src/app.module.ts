import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT, 10) || 3306,
            username: process.env.MYSQL_USER || 'reforma_user',
            password: process.env.MYSQL_PASSWORD || 'reforma_password',
            database: process.env.MYSQL_DATABASE || 'reforma_plus',
            autoLoadEntities: true,
            synchronize: true, // Desabilitar em produção
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
