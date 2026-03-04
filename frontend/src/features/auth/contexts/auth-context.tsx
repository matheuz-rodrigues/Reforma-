'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { authService } from '../services/auth-service';
import type { User } from '../types';

interface AuthContextData {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: { email: string; password: string }) => Promise<void>;
    register: (data: { name: string; email: string; password: string; confirmPassword: string }) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Ao montar, verificar se existe token e restaurar sessão
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            authService
                .getProfile()
                .then((profile) => setUser(profile))
                .catch(() => {
                    // Token inválido/expirado — limpar
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                })
                .finally(() => setIsLoading(false));
        } else {
            setIsLoading(false);
        }
    }, []);

    const login = useCallback(async (credentials: { email: string; password: string }) => {
        const response = await authService.login(credentials);
        localStorage.setItem('accessToken', response.tokens.accessToken);
        if (response.tokens.refreshToken) {
            localStorage.setItem('refreshToken', response.tokens.refreshToken);
        }
        setUser(response.user);
    }, []);

    const register = useCallback(async (data: { name: string; email: string; password: string; confirmPassword: string }) => {
        const response = await authService.register(data);
        localStorage.setItem('accessToken', response.tokens.accessToken);
        if (response.tokens.refreshToken) {
            localStorage.setItem('refreshToken', response.tokens.refreshToken);
        }
        setUser(response.user);
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuthContext() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuthContext deve ser usado dentro de um AuthProvider');
    }
    return context;
}
