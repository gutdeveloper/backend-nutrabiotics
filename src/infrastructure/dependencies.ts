import { PrismaUserRepository } from "./repositories/prisma.user.repository";
import { BcryptService } from "./services/bcrypt.service";

import { AuthController } from "./controllers/auth.controller";
import { AuthUseCase } from "../application/use-cases/auth.use-case";
import { JwtService } from "./services/token.service";
import { PrismaProductRepository } from "./repositories/prisma.product.repository";
import { ProductController } from "./controllers/product.controller";
import { ProductUseCase } from "../application/use-cases/product.use-case";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const userRepository = new PrismaUserRepository();
const productRepository = new PrismaProductRepository(prisma);

const bcryptService = new BcryptService();
const tokenService = new JwtService();

const authUseCase = new AuthUseCase(
  userRepository,
  bcryptService,
  tokenService
);

const productUseCase = new ProductUseCase(productRepository);

const authController = new AuthController(authUseCase);
const productController = new ProductController(productUseCase);

export { authController, productController };
