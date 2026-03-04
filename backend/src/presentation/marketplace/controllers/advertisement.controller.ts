import { Controller, Post, Body, Get, Query, UseGuards, Request } from '@nestjs/common';
import { CreateAdvertisementUseCase } from '../../../application/marketplace/use-cases/create-advertisement.use-case';
import { ListAdvertisementsUseCase } from '../../../application/marketplace/use-cases/list-advertisements.use-case';
import { CreateAdvertisementDto } from '../dtos/create-advertisement.dto';
import { JwtAuthGuard } from '../../../infra/security/jwt/jwt.guard';

@Controller('advertisements')
export class AdvertisementController {
    constructor(
        private readonly createAdvertisementUseCase: CreateAdvertisementUseCase,
        private readonly listAdvertisementsUseCase: ListAdvertisementsUseCase,
    ) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Body() createDto: CreateAdvertisementDto, @Request() req) {
        // req.user is set by the JwtAuthGuard
        const sellerId = req.user.id;

        return this.createAdvertisementUseCase.execute({
            ...createDto,
            sellerId,
        });
    }

    @Get()
    async findAll(
        @Query('category') category?: string,
        @Query('status') status?: string,
    ) {
        return this.listAdvertisementsUseCase.execute({ category, status });
    }
}
