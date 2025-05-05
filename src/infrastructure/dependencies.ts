import { PrismaUserRepository } from "./repositories/prisma.user.repository";
import { BcryptService } from "./services/bcrypt.service";

import { AuthController } from "./controllers/auth.controller";
import { AuthUseCase } from "../application/use-cases/auth.use-case";
import { JwtService } from "./services/token.service";
import { PrismaProductRepository } from "./repositories/prisma.product.repository";
import { ProductController } from "./controllers/product.controller";
import { ProductUseCase } from "../application/use-cases/product.use-case";
import { PrismaClient } from "@prisma/client";
import { PrismaOrderRepository } from "./repositories/prisma.order.repository";
import { PrismaOrderProductRepository } from "./repositories/prisma.order-product.repository";
import { OrderUseCase } from "../application/use-cases/order.use-case";
import { OrderController } from "./controllers/order.controller";
import { PrismaTransaction } from "./repositories/prisma.transaction";

const prisma = new PrismaClient();
const userRepository = new PrismaUserRepository(prisma);
const productRepository = new PrismaProductRepository(prisma);
const orderRepository = new PrismaOrderRepository(prisma);
const transaction = new PrismaTransaction(prisma);

const bcryptService = new BcryptService();
const tokenService = new JwtService();

const authUseCase = new AuthUseCase(
  userRepository,
  bcryptService,
  tokenService
);

const productUseCase = new ProductUseCase(productRepository);

const orderUseCase = new OrderUseCase(
  orderRepository,
  userRepository,
  transaction
);

const authController = new AuthController(authUseCase);
const productController = new ProductController(productUseCase);
const orderController = new OrderController(orderUseCase);

export { authController, productController, orderController };
