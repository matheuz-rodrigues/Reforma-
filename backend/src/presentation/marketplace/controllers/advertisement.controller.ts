import { Controller, Post, Body, Get, Query, UseGuards, Request, UseInterceptors, UploadedFiles, Param, Delete } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CreateAdvertisementUseCase } from '../../../application/marketplace/use-cases/create-advertisement.use-case';
import { ListAdvertisementsUseCase } from '../../../application/marketplace/use-cases/list-advertisements.use-case';
import { GetAdvertisementUseCase } from '../../../application/marketplace/use-cases/get-advertisement.use-case';
import { DeleteAdvertisementUseCase } from '../../../application/marketplace/use-cases/delete-advertisement.use-case';
import { CreateAdvertisementDto } from '../dtos/create-advertisement.dto';
import { JwtAuthGuard } from '../../../infra/security/jwt/jwt.guard';

@Controller('advertisements')
export class AdvertisementController {
    constructor(
        private readonly createAdvertisementUseCase: CreateAdvertisementUseCase,
        private readonly listAdvertisementsUseCase: ListAdvertisementsUseCase,
        private readonly getAdvertisementUseCase: GetAdvertisementUseCase,
        private readonly deleteAdvertisementUseCase: DeleteAdvertisementUseCase,
    ) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    @UseInterceptors(FilesInterceptor('files', 10, {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
            },
        }),
    }))
    async create(
        @UploadedFiles() files: any[],
        @Body() createDto: CreateAdvertisementDto,
        @Request() req
    ) {
        // req.user is set by the JwtAuthGuard
        const sellerId = req.user.id;

        const imageUrls = files?.map(file => `/uploads/${file.filename}`) || [];

        return this.createAdvertisementUseCase.execute({
            ...createDto,
            sellerId,
            images: imageUrls,
        });
    }

    @Get()
    async findAll(
        @Query('category') category?: string,
        @Query('status') status?: string,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        return this.listAdvertisementsUseCase.execute({
            category,
            status,
            page: page ? parseInt(page, 10) : undefined,
            limit: limit ? parseInt(limit, 10) : undefined,
        });
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.getAdvertisementUseCase.execute(id);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async remove(@Param('id') id: string, @Request() req) {
        return this.deleteAdvertisementUseCase.execute(id, req.user.id);
    }
}
