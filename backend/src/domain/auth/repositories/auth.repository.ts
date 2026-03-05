import { AuthTokens } from '../entities/auth-token.entity';

export interface IAuthRepository {
    validateCredentials(email: string, password: string): Promise<{ id: string; name: string; email: string } | null>;
    findById(id: string): Promise<{ id: string; name: string; email: string } | null>;
    generateTokens(userId: string): Promise<AuthTokens>;
    refreshToken(token: string): Promise<AuthTokens>;
    revokeToken(token: string): Promise<void>;
}
