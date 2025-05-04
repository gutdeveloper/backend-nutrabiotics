import { AuthController } from "../controllers/auth.controller";
import express from "express";
import { validateData } from "../../infrastructure/middlewares/validator.middleware";
import { authMiddleware } from "../../infrastructure/middlewares/auth.middleware";
import { roleMiddleware } from "../../infrastructure/middlewares/role.middleware";
import { Request, Response, NextFunction } from "express";

import { registerSchema, loginSchema } from "../validators/auth.validator";
import { authController } from "../dependencies";

const router = express.Router();

router.post(
  "/register",
  validateData({ body: registerSchema }),
  (req: Request, res: Response, next: NextFunction) =>
    authController.register(req, res, next)
);

router.post(
  "/login",
  validateData({ body: loginSchema }),
  (req: Request, res: Response, next: NextFunction) =>
    authController.login(req, res, next)
);

// router.get(
//   "/profile",
//   [authMiddleware],
//   (req: Request, res: Response, next: NextFunction) =>
//     authController.profile(req, res, next)
// );

export default router;
