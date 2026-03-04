import { UserEntity } from '../../../../domain/user/entities/user.entity';
import { UserOrmEntity } from '../entities/user.orm-entity';

export class UserMapper {
    static toDomain(ormEntity: UserOrmEntity): UserEntity {
        return {
            id: ormEntity.id,
            name: ormEntity.name,
            email: ormEntity.email,
            password: ormEntity.password,
            createdAt: ormEntity.createdAt,
            updatedAt: ormEntity.updatedAt,
        };
    }

    static toOrm(domainEntity: Partial<UserEntity>): Partial<UserOrmEntity> {
        const ormEntity = new UserOrmEntity();
        if (domainEntity.id) ormEntity.id = domainEntity.id;
        if (domainEntity.name) ormEntity.name = domainEntity.name;
        if (domainEntity.email) ormEntity.email = domainEntity.email;
        if (domainEntity.password) ormEntity.password = domainEntity.password;
        return ormEntity;
    }
}
