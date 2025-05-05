import { PrismaClient } from "@prisma/client";
import { User, UserRole } from "../../domain/entities/user.entity";
import { UserRepository } from "../../domain/interfaces/user-repository.interface";

export class PrismaUserRepository implements UserRepository {

  constructor(private readonly prisma: PrismaClient) {}

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) return null;

    return new User({ ...user, role: user.role as UserRole });
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) return null;

    return new User({ ...user, role: user.role as UserRole });
  }

  async create(user: User): Promise<User> {
    const createdUser = await this.prisma.user.create({
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: user.getPassword(),
        role: user.getRole(),
      },
    });

    return new User({ ...createdUser, role: createdUser.role as UserRole });
  }
}
