import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt.guard';

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'reforma-plus-secret-key',
            signOptions: { expiresIn: '1h' },
        }),
    ],
    providers: [JwtStrategy, JwtAuthGuard],
    exports: [JwtModule, PassportModule, JwtAuthGuard],
})
export class JwtConfigModule { }
