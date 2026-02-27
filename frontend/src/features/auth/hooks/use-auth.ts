'use client';

import { useState, useCallback } from 'react';
import { authService } from '../services/auth-service';
import type { LoginCredentials, RegisterData, User } from '../types';

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const login = useCallback(async (credentials: LoginCredentials) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await authService.login(credentials);
            localStorage.setItem('accessToken', response.tokens.accessToken);
            if (response.tokens.refreshToken) {
                localStorage.setItem('refreshToken', response.tokens.refreshToken);
            }
            setUser(response.user);
            return response;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erro ao fazer login';
            setError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const register = useCallback(async (data: RegisterData) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await authService.register(data);
            localStorage.setItem('accessToken', response.tokens.accessToken);
            if (response.tokens.refreshToken) {
                localStorage.setItem('refreshToken', response.tokens.refreshToken);
            }
            setUser(response.user);
            return response;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erro ao criar conta';
            setError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setUser(null);
    }, []);

    return { user, isLoading, error, login, register, logout, setError };
}
