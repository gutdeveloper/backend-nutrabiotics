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
    this.id = props.id || this.generateId();
    this.firstName = props.firstName;
    this.lastName = props.lastName;
    
    if (!this.isValidEmail(props.email)) {
      throw new Error("Invalid email format");
    }
    this.email = props.email;
    
    if (!this.isValidPassword(props.password)) {
      throw new Error("Password must be at least 6 characters");
    }
    this.password = props.password;
    
    this.role = props.role || UserRole.USER;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidPassword(password: string): boolean {
    return password.length >= 6;
  }

  private generateId(): string {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
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
}
