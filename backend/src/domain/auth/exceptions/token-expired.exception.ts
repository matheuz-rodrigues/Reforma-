export class TokenExpiredException extends Error {
    constructor() {
        super('Token expirado');
        this.name = 'TokenExpiredException';
    }
}
