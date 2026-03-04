import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { LoginUseCase } from '../../application/auth/use-cases/login.use-case';
import { RegisterUseCase } from '../../application/auth/use-cases/register.use-case';
import { RefreshTokenUseCase } from '../../application/auth/use-cases/refresh-token.use-case';
import { LoginDto } from '../../application/auth/dtos/login.dto';
import { RegisterDto } from '../../application/auth/dtos/register.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly loginUseCase: LoginUseCase,
        private readonly registerUseCase: RegisterUseCase,
        private readonly refreshTokenUseCase: RefreshTokenUseCase,
    ) { }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() dto: LoginDto) {
        return this.loginUseCase.execute(dto);
    }

    @Post('register')
    async register(@Body() dto: RegisterDto) {
        return this.registerUseCase.execute(dto);
    }

    @Post('refresh')    
    @HttpCode(HttpStatus.OK)
    async refresh(@Body('refreshToken') refreshToken: string) {
        return this.refreshTokenUseCase.execute(refreshToken);
    }
}
