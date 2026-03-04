import { Inject, Injectable, ConflictException } from '@nestjs/common';
import { IAuthRepository } from '../../../domain/auth/repositories/auth.repository';
import { AuthTokens } from '../../../domain/auth/entities/auth-token.entity';
import { AUTH_REPOSITORY } from '../../../shared/constants/injection-tokens';
import { IUserRepository } from '../../../domain/user/repositories/user.repository';
import { USER_REPOSITORY } from '../../../shared/constants/injection-tokens';
import { IHashService } from '../../../shared/constants/injection-tokens';
import { HASH_SERVICE } from '../../../shared/constants/injection-tokens';

interface RegisterInput {
    name: string;
    email: string;
    password: string;
}

export interface RegisterOutput {
    user: { id: string; name: string; email: string };
    tokens: AuthTokens;
}

@Injectable()
export class RegisterUseCase {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
        @Inject(AUTH_REPOSITORY)
        private readonly authRepository: IAuthRepository,
        @Inject(HASH_SERVICE)
        private readonly hashService: IHashService,
    ) { }

    async execute(input: RegisterInput): Promise<RegisterOutput> {
        const existingUser = await this.userRepository.findByEmail(input.email);

        if (existingUser) {
            throw new ConflictException('Email já cadastrado');
        }

        const hashedPassword = await this.hashService.hash(input.password);

        const user = await this.userRepository.create({
            name: input.name,
            email: input.email,
            password: hashedPassword,
        });

        const tokens = await this.authRepository.generateTokens(user.id);

        return {
            user: { id: user.id, name: user.name, email: user.email },
            tokens,
        };
    }
}
