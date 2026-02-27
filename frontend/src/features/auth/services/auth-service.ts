import { apiClient } from '@/infra';
import type { AuthTokens, LoginCredentials, RegisterData, User } from '../types';

export interface AuthResponse {
    user: User;
    tokens: AuthTokens;
}

export const authService = {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        return apiClient.post<AuthResponse>('/auth/login', credentials);
    },

    async register(data: RegisterData): Promise<AuthResponse> {
        return apiClient.post<AuthResponse>('/auth/register', {
            name: data.name,
            email: data.email,
            password: data.password,
        });
    },

    async logout(): Promise<void> {
        return apiClient.post<void>('/auth/logout');
    },

    async getProfile(): Promise<User> {
        return apiClient.get<User>('/auth/profile');
    },
};
