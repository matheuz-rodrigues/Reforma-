import { Inject, Injectable } from '@nestjs/common';
import { IAuthRepository } from '../../../domain/auth/repositories/auth.repository';
import { InvalidCredentialsException } from '../../../domain/auth/exceptions/invalid-credentials.exception';
import { AuthTokens } from '../../../domain/auth/entities/auth-token.entity';
import { AUTH_REPOSITORY } from '../../../shared/constants/injection-tokens';

interface LoginInput {
    email: string;
    password: string;
}

export interface LoginOutput {
    user: { id: string; name: string; email: string };
    tokens: AuthTokens;
}

@Injectable()
export class LoginUseCase {
    constructor(
        @Inject(AUTH_REPOSITORY)
        private readonly authRepository: IAuthRepository,
    ) { }

    async execute(input: LoginInput): Promise<LoginOutput> {
        const user = await this.authRepository.validateCredentials(
            input.email,
            input.password,
        );

        if (!user) {
            throw new InvalidCredentialsException();
        }

        const tokens = await this.authRepository.generateTokens(user.id);

        return { user, tokens };
    }
}
