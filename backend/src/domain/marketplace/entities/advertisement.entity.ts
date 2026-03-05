export interface AdvertisementEntity {
    id: string;
    title: string;
    description: string;
    price: number;
    originalPrice?: number;
    category: string;
    condition: 'novo' | 'usado' | 'sobra';
    sellerId: string;
    status: 'ativo' | 'inativo' | 'vendido';
    images: string[];
    location?: string;
    latitude?: number;
    longitude?: number;
    createdAt: Date;
    updatedAt: Date;
}
