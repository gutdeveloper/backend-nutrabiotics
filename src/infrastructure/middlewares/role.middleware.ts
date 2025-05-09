import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

export const roleMiddleware = (requiredRole: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.body.user;

    if (!user || !requiredRole.includes(user.role)) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ error: "Access denied. Insufficient permissions." });
    }

    next();
  };
};
