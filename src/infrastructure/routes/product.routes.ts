import express from "express";
import { Request, Response, NextFunction } from "express";
import { createProductSchema, updateProductSchema } from '../validators/product.validator';
import { paginationSchema } from '../validators/pagination.validator';
import { validateData } from '../middlewares/validator.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';
import { productController } from "../dependencies";

const router = express.Router();

// Rutas públicas
router.get(
  "/", 
  validateData({ query: paginationSchema }),
  (req: Request, res: Response, next: NextFunction) => 
    productController.findAll(req, res, next)
);

router.get(
  "/slug/:slug", 
  (req: Request, res: Response, next: NextFunction) => 
    productController.findBySlug(req, res, next)
);

// Rutas protegidas (solo admin)
router.post(
  "/",
  authMiddleware,
  roleMiddleware(['ADMIN']),
  validateData({ body: createProductSchema }),
  (req: Request, res: Response, next: NextFunction) => 
    productController.create(req, res, next)
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(['ADMIN']),
  validateData({ body: updateProductSchema }),
  (req: Request, res: Response, next: NextFunction) => 
    productController.update(req, res, next)
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(['ADMIN']),
  (req: Request, res: Response, next: NextFunction) => 
    productController.delete(req, res, next)
);

export default router; 