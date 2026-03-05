import env from '../config/env';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions {
    headers?: Record<string, string>;
    body?: unknown;
    params?: Record<string, string | number | boolean | undefined>;
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

    private buildUrl(path: string, params?: Record<string, string | number | boolean | undefined>): string {
        const url = new URL(`${this.baseUrl}${path}`);
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined) {
                    url.searchParams.append(key, String(value));
                }
            });
        }
        return url.toString();
    }

    private async request<T>(method: HttpMethod, path: string, options?: RequestOptions): Promise<T> {
        const url = this.buildUrl(path, options?.params);
        const isFormData = options?.body instanceof FormData;

        const headers: Record<string, string> = {
            ...this.getAuthHeaders(),
            ...options?.headers,
        };

        if (!isFormData) {
            headers['Content-Type'] = 'application/json';
        }

        const response = await fetch(url, {
            method,
            headers,
            body: isFormData ? (options?.body as FormData) : (options?.body ? JSON.stringify(options.body) : undefined),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
            throw new Error(error.message || `Erro ${response.status}`);
        }

        const text = await response.text();
        return text ? JSON.parse(text) : ({} as T);
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
