import { Inject, Injectable } from '@nestjs/common';
import { IAuthRepository } from '../../../domain/auth/repositories/auth.repository';
import { AuthTokens } from '../../../domain/auth/entities/auth-token.entity';
import { TokenExpiredException } from '../../../domain/auth/exceptions/token-expired.exception';
import { AUTH_REPOSITORY } from '../../../shared/constants/injection-tokens';

@Injectable()
export class RefreshTokenUseCase {
    constructor(
        @Inject(AUTH_REPOSITORY)
        private readonly authRepository: IAuthRepository,
    ) { }

    async execute(refreshToken: string): Promise<AuthTokens> {
        try {
            return await this.authRepository.refreshToken(refreshToken);
        } catch {
            throw new TokenExpiredException();
        }
    }
}
