import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IAuthRepository } from '../../../domain/auth/repositories/auth.repository';
import { AUTH_REPOSITORY } from '../../../shared/constants/injection-tokens';

@Injectable()
export class GetProfileUseCase {
    constructor(
        @Inject(AUTH_REPOSITORY)
        private readonly authRepository: IAuthRepository,
    ) { }

    async execute(userId: string): Promise<{ id: string; name: string; email: string }> {
        const user = await this.authRepository.findById(userId);
        if (!user) {
            throw new NotFoundException('Usuário não encontrado');
        }
        return user;
    }
}
