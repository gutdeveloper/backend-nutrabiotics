import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import { config } from "../../config/env.config";

// Usar la configuración centralizada
const JWT_SECRET = config.jwtSecret;

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(String(token), JWT_SECRET);
    req.body.user = decoded;
    next();
  } catch (error) {
    return res.status(StatusCodes.FORBIDDEN).json({ error: "Invalid token" });
  }
};
