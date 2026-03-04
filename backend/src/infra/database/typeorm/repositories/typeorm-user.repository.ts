import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUserRepository } from '../../../../domain/user/repositories/user.repository';
import { UserEntity } from '../../../../domain/user/entities/user.entity';
import { UserOrmEntity } from '../entities/user.orm-entity';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class TypeormUserRepository implements IUserRepository {
    constructor(
        @InjectRepository(UserOrmEntity)
        private readonly userRepo: Repository<UserOrmEntity>,
    ) { }

    async findById(id: string): Promise<UserEntity | null> {
        const user = await this.userRepo.findOne({ where: { id } });
        return user ? UserMapper.toDomain(user) : null;
    }

    async findByEmail(email: string): Promise<UserEntity | null> {
        const user = await this.userRepo.findOne({ where: { email } });
        return user ? UserMapper.toDomain(user) : null;
    }

    async create(data: { name: string; email: string; password: string }): Promise<UserEntity> {
        const ormEntity = this.userRepo.create(data);
        const saved = await this.userRepo.save(ormEntity);
        return UserMapper.toDomain(saved);
    }

    async update(id: string, data: Partial<UserEntity>): Promise<UserEntity> {
        await this.userRepo.update(id, data);
        const updated = await this.userRepo.findOne({ where: { id } });
        return UserMapper.toDomain(updated);
    }
}
