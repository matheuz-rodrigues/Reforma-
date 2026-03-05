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
    sellerName?: string;
    status: 'ativo' | 'inativo' | 'vendido';
    images: string[];
    location?: string;
    latitude?: number;
    longitude?: number;
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
    latitude?: number;
    longitude?: number;
}

export const marketplaceService = {
    async getAdvertisements(filters?: { category?: string; status?: string; page?: number; limit?: number }): Promise<{ data: Advertisement[], total: number }> {
        return apiClient.get<{ data: Advertisement[], total: number }>('/advertisements', { params: filters });
    },

    async createAdvertisement(data: CreateAdvertisementDTO | FormData): Promise<Advertisement> {
        return apiClient.post<Advertisement>('/advertisements', data);
    },

    async getAdvertisementById(id: string): Promise<Advertisement> {
        return apiClient.get<Advertisement>(`/advertisements/${id}`);
    },

    async deleteAdvertisement(id: string): Promise<void> {
        return apiClient.delete(`/advertisements/${id}`);
    },
};
