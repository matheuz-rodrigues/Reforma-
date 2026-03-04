import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IHashService } from '../../../shared/constants/injection-tokens';

@Injectable()
export class BcryptService implements IHashService {
    private readonly SALT_ROUNDS = 10;

    async hash(value: string): Promise<string> {
        return bcrypt.hash(value, this.SALT_ROUNDS);
    }

    async compare(value: string, hash: string): Promise<boolean> {
        return bcrypt.compare(value, hash);
    }
}
