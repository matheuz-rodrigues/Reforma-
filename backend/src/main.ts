import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { DomainExceptionFilter } from './shared/filters/domain-exception.filter';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    // Servir arquivos estáticos (fotos dos produtos)
    app.useStaticAssets(join(__dirname, '..', 'uploads'), {
        prefix: '/uploads/',
    });

    // Prefixo global para todas as rotas: /api

    app.enableCors();

    // Pipe de validação global (class-validator)
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    // Filtro global para exceções de domínio
    app.useGlobalFilters(new DomainExceptionFilter());

    await app.listen(3001);
    console.log('🚀 Backend rodando na porta 3001');
}

bootstrap();
