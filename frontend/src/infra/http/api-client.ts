import env from '../config/env';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions {
    headers?: Record<string, string>;
    body?: unknown;
}

class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    private getAuthHeaders(): Record<string, string> {
        if (typeof window === 'undefined') return {};
        const token = localStorage.getItem('accessToken');
        return token ? { Authorization: `Bearer ${token}` } : {};
    }

    private async request<T>(method: HttpMethod, path: string, options?: RequestOptions): Promise<T> {
        const url = `${this.baseUrl}${path}`;

        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...this.getAuthHeaders(),
                ...options?.headers,
            },
            body: options?.body ? JSON.stringify(options.body) : undefined,
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
            throw new Error(error.message || `Erro ${response.status}`);
        }

        return response.json();
    }

    get<T>(path: string, options?: RequestOptions) {
        return this.request<T>('GET', path, options);
    }

    post<T>(path: string, body?: unknown, options?: RequestOptions) {
        return this.request<T>('POST', path, { ...options, body });
    }

    put<T>(path: string, body?: unknown, options?: RequestOptions) {
        return this.request<T>('PUT', path, { ...options, body });
    }

    patch<T>(path: string, body?: unknown, options?: RequestOptions) {
        return this.request<T>('PATCH', path, { ...options, body });
    }

    delete<T>(path: string, options?: RequestOptions) {
        return this.request<T>('DELETE', path, options);
    }
}

export const apiClient = new ApiClient(env.API_URL);
