import { UserRole } from '../../../domain/entities/user.entity';

export interface RegisterDTO {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
} 