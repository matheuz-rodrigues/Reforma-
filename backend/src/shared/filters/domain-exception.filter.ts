import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { InvalidCredentialsException } from '../../domain/auth/exceptions/invalid-credentials.exception';
import { TokenExpiredException } from '../../domain/auth/exceptions/token-expired.exception';

@Catch(InvalidCredentialsException, TokenExpiredException)
export class DomainExceptionFilter implements ExceptionFilter {
    private readonly exceptionStatusMap = new Map<string, HttpStatus>([
        ['InvalidCredentialsException', HttpStatus.UNAUTHORIZED],
        ['TokenExpiredException', HttpStatus.UNAUTHORIZED],
        ['UserNotFoundException', HttpStatus.NOT_FOUND],
        ['ProductNotFoundException', HttpStatus.NOT_FOUND],
    ]);

    catch(exception: Error, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        const status = this.exceptionStatusMap.get(exception.name) || HttpStatus.INTERNAL_SERVER_ERROR;

        response.status(status).json({
            statusCode: status,
            message: exception.message,
            error: exception.name,
            timestamp: new Date().toISOString(),
        });
    }
}
