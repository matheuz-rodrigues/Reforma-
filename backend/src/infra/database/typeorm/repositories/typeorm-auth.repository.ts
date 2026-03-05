import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IAuthRepository } from '../../../../domain/auth/repositories/auth.repository';
import { AuthTokens } from '../../../../domain/auth/entities/auth-token.entity';
import { UserOrmEntity } from '../entities/user.orm-entity';
import { IHashService } from '../../../../shared/constants/injection-tokens';
import { Inject } from '@nestjs/common';
import { HASH_SERVICE } from '../../../../shared/constants/injection-tokens';

@Injectable()
export class TypeormAuthRepository implements IAuthRepository {
    constructor(
        @InjectRepository(UserOrmEntity)
        private readonly userRepo: Repository<UserOrmEntity>,
        private readonly jwtService: JwtService,
        @Inject(HASH_SERVICE)
        private readonly hashService: IHashService,
    ) { }

    async validateCredentials(
        email: string,
        password: string,
    ): Promise<{ id: string; name: string; email: string } | null> {
        const user = await this.userRepo.findOne({ where: { email } });

        if (!user) return null;

        const isValid = await this.hashService.compare(password, user.password);

        if (!isValid) return null;

        return { id: user.id, name: user.name, email: user.email };
    }

    async findById(id: string): Promise<{ id: string; name: string; email: string } | null> {
        const user = await this.userRepo.findOne({ where: { id } });
        if (!user) return null;
        return { id: user.id, name: user.name, email: user.email };
    }

    async generateTokens(userId: string): Promise<AuthTokens> {
        const payload = { sub: userId };

        const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

        return { accessToken, refreshToken };
    }

    async refreshToken(token: string): Promise<AuthTokens> {
        const payload = this.jwtService.verify(token);
        return this.generateTokens(payload.sub);
    }

    async revokeToken(_token: string): Promise<void> {
        // TODO: Implementar blacklist de tokens (Redis, banco, etc.)
    }
}
