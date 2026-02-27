import { AuthTokens, LoginCredentials, RegisterData, User } from '../entities';

export interface IAuthRepository {
    login(credentials: LoginCredentials): Promise<{ user: User; tokens: AuthTokens }>;
    register(data: RegisterData): Promise<{ user: User; tokens: AuthTokens }>;
    logout(): Promise<void>;
    getProfile(): Promise<User>;
    refreshToken(refreshToken: string): Promise<AuthTokens>;
}
