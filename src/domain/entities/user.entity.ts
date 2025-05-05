import { generateId } from '../utils/id-generator';
import { isValidEmail } from '../utils/validators';

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

interface UserProps {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: UserRole;
}

export class User {
  public readonly id: string;
  public readonly firstName: string;
  public readonly lastName: string;
  public readonly email: string;
  private readonly password: string;
  private readonly role: UserRole;

  constructor(props: UserProps) {
    this.id = props.id || generateId();
    this.firstName = props.firstName;
    this.lastName = props.lastName;
    
    if (!isValidEmail(props.email)) {
      throw new Error("Invalid email format");
    }
    this.email = props.email;
    
    if (!this.isValidPassword(props.password)) {
      throw new Error("Password must be at least 6 characters");
    }
    this.password = props.password;
    
    this.role = props.role || UserRole.USER;
  }

  private isValidPassword(password: string): boolean {
    return password.length >= 6;
  }

  getId(): string {
    return this.id;
  }

  getPassword(): string {
    return this.password;
  }

  getRole(): UserRole {
    return this.role;
  }

  toJSON() {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      role: this.role
    };
  }
}
