import { UserRole } from '../../../domain/entities/user.entity';

export interface IRegisterDTO {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
} 