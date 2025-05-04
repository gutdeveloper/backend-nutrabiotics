import { PrismaUserRepository } from "./repositories/prisma.user.repository";
import { BcryptService } from "./services/bcrypt.service";

import { AuthController } from "./controllers/auth.controller";
import { AuthUseCase } from "../application/use-cases/auth.use-case";
import { JwtService } from "./services/token.service";

const userRepository = new PrismaUserRepository();

const bcryptService = new BcryptService();
const tokenService = new JwtService();

const authUseCase = new AuthUseCase(
  userRepository,
  bcryptService,
  tokenService
);

const authController = new AuthController(authUseCase);

export { authController };
