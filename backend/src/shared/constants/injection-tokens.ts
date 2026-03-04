// ===== Repository Tokens =====
export const USER_REPOSITORY = Symbol('USER_REPOSITORY');
export const AUTH_REPOSITORY = Symbol('AUTH_REPOSITORY');
export const PRODUCT_REPOSITORY = Symbol('PRODUCT_REPOSITORY');

// ===== Service Tokens =====
export const HASH_SERVICE = Symbol('HASH_SERVICE');

// ===== Interface para Hash Service =====
export interface IHashService {
    hash(value: string): Promise<string>;
    compare(value: string, hash: string): Promise<boolean>;
}
