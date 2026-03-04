import { IsString, IsNotEmpty, IsNumber, IsOptional, IsEnum, IsArray } from 'class-validator';

export class CreateAdvertisementDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNumber()
    @IsNotEmpty()
    price: number;

    @IsNumber()
    @IsOptional()
    originalPrice?: number;

    @IsString()
    @IsNotEmpty()
    category: string;

    @IsEnum(['novo', 'usado', 'sobra'])
    @IsNotEmpty()
    condition: 'novo' | 'usado' | 'sobra';

    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty()
    images: string[];

    @IsString()
    @IsOptional()
    location?: string;
}
