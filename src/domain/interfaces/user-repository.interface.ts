import { IRepository } from './repository.interface';
import { User } from '../entities/user.entity';

export interface IUserRepository extends IRepository<User> {
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    create(user: User): Promise<User>;
} 