import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DomainExceptionFilter } from './shared/filters/domain-exception.filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Prefixo global para todas as rotas: /api

    // Habilitar CORS
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
