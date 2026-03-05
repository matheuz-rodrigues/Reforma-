import { IsString, IsNotEmpty, IsNumber, IsOptional, IsEnum, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAdvertisementDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNumber()
    @IsNotEmpty()
    @Type(() => Number)
    price: number;

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    originalPrice?: number;

    @IsString()
    @IsNotEmpty()
    category: string;

    @IsEnum(['novo', 'usado', 'sobra'])
    @IsNotEmpty()
    condition: 'novo' | 'usado' | 'sobra';

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    images?: string[];

    @IsString()
    @IsOptional()
    location?: string;
}
