import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import logger from "../logger/logger";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(`Error: ${err.message || 'Unknown error'} - ${err.stack || ''}`);
  
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({ error: message });
  next();
};
