import { User, UserRole } from "../../domain/entities/user.entity";
import { IUserRepository } from "../../domain/interfaces/user-repository.interface";
import { IHash } from "../../domain/interfaces/hash.interface";
import { IToken } from "../../domain/interfaces/token.interface";
import { UnauthorizedError } from "../../domain/errors/unauthorized.error";
import { ConflictError } from "../../domain/errors/conflict.error";
import { IRegisterDTO } from "../dtos/auth/register.dto";
import { ILoginDTO } from "../dtos/auth/login.dto";

/**
 * Caso de uso para la autenticación de usuarios
 */
export class AuthUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hashService: IHash,
    private readonly tokenService: IToken
  ) {}
  /**
   * Registra un nuevo usuario
   * @param dto - Datos del usuario a registrar
   * @returns {Promise<{ user: ReturnType<User['toJSON']>; token: string }>} - Usuario registrado y token de autenticación
   */
  async register(
    dto: IRegisterDTO
  ): Promise<{ user: ReturnType<User["toJSON"]>; token: string }> {
    const { firstName, lastName, email, password } = dto;
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) throw new ConflictError("Email already in use");
    const hashedPassword = await this.hashService.hash(password);
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    const savedUser = await this.userRepository.create(user);
    const token = await this.tokenService.generate({
      id: savedUser.getId(),
      email,
      role: UserRole.USER,
    });
    return { user: savedUser.toJSON(), token };
  }

  /**
   * Inicia sesión de un usuario
   * @param dto - Datos del usuario a iniciar sesión
   * @returns {Promise<{ user: ReturnType<User['toJSON']>; token: string }>} - Usuario autenticado y token de autenticación
   */
  async login(
    dto: ILoginDTO
  ): Promise<{ user: ReturnType<User["toJSON"]>; token: string }> {
    const { email, password } = dto;
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new UnauthorizedError("Invalid credentials");
    const isValidPassword = await this.hashService.compare(
      password,
      user.getPassword()
    );
    if (!isValidPassword) throw new UnauthorizedError("Invalid credentials");
    const token = await this.tokenService.generate({
      id: user.getId(),
      email,
      role: user.getRole(),
    });
    return { user: user.toJSON(), token };
  }
}
