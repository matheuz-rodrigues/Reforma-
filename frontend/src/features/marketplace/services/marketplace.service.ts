import { apiClient } from '@/infra/http/api-client';

export interface Advertisement {
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
    createdAt: string;
    updatedAt: string;
}

export interface CreateAdvertisementDTO {
    title: string;
    description: string;
    price: number;
    originalPrice?: number;
    category: string;
    condition: 'novo' | 'usado' | 'sobra';
    images: string[];
    location?: string;
}

export const marketplaceService = {
    async getAdvertisements(filters?: { category?: string; status?: string }): Promise<Advertisement[]> {
        return apiClient.get<Advertisement[]>('/advertisements', { body: filters }); // TODO: API Client doesn't have a params option, passing in body might not work for GET. Let's cast to any for now or modify API client
    },

    async createAdvertisement(data: CreateAdvertisementDTO | FormData): Promise<Advertisement> {
        return apiClient.post<Advertisement>('/advertisements', data);
    },
};
