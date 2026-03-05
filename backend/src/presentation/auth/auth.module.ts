import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { LoginUseCase } from '../../application/auth/use-cases/login.use-case';
import { RegisterUseCase } from '../../application/auth/use-cases/register.use-case';
import { RefreshTokenUseCase } from '../../application/auth/use-cases/refresh-token.use-case';
import { GetProfileUseCase } from '../../application/auth/use-cases/get-profile.use-case';
import { TypeormUserRepository } from '../../infra/database/typeorm/repositories/typeorm-user.repository';
import { TypeormAuthRepository } from '../../infra/database/typeorm/repositories/typeorm-auth.repository';
import { BcryptService } from '../../infra/security/bcrypt/bcrypt.service';
import { UserOrmEntity } from '../../infra/database/typeorm/entities/user.orm-entity';
import { JwtConfigModule } from '../../infra/security/jwt/jwt.module';
import { AUTH_REPOSITORY, USER_REPOSITORY, HASH_SERVICE } from '../../shared/constants/injection-tokens';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserOrmEntity]),
        JwtConfigModule,
    ],
    controllers: [AuthController],
    providers: [
        // Use Cases
        LoginUseCase,
        RegisterUseCase,
        RefreshTokenUseCase,
        GetProfileUseCase,

        // Repository bindings (Interface -> Implementation)
        {
            provide: USER_REPOSITORY,
            useClass: TypeormUserRepository,
        },
        {
            provide: AUTH_REPOSITORY,
            useClass: TypeormAuthRepository,
        },

        // Service bindings
        {
            provide: HASH_SERVICE,
            useClass: BcryptService,
        },
    ],
})
export class AuthModule { }
