import express from "express";
import { Request, Response, NextFunction } from "express";
import { paginationSchema } from "../validators/pagination.validator";
import { validateData } from "../middlewares/validator.middleware";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";
import { orderController } from "../dependencies";
import { createOrderSchema } from "../validators/order.validator";

const router = express.Router();

// Todas las rutas de órdenes son protegidas (requieren autenticación)
router.use(authMiddleware);

// Rutas para usuarios normales (para crear sus propias órdenes)
router.post(
  "/",
  validateData({ body: createOrderSchema }),
  (req: Request, res: Response, next: NextFunction) =>
    orderController.create(req, res, next)
);

router.get(
  "/my-orders",
  validateData({ query: paginationSchema }),
  (req: Request, res: Response, next: NextFunction) =>
    orderController.findAllByUserId(req, res, next)
);

router.get("/:id", (req: Request, res: Response, next: NextFunction) =>
  orderController.findById(req, res, next)
);

// Rutas para administradores (todas las órdenes)
router.get(
  "/",
  roleMiddleware(["ADMIN"]),
  validateData({ query: paginationSchema }),
  (req: Request, res: Response, next: NextFunction) =>
    orderController.findAll(req, res, next)
);

export default router;
