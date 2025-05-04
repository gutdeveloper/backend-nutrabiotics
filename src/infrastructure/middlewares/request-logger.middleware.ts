import { Request, Response, NextFunction } from "express";
import logger from "../logger/logger";

/**
 * Middleware para registrar información sobre las peticiones HTTP
 * Registra el método, la URL, el código de estado y la duración de la petición
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });
  
  next();
}; 