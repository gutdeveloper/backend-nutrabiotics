import app from "./app";
import { config } from "./config/env.config";
import logger from "./infrastructure/logger/logger";

app.listen(config.port, () => {
  logger.info(`Servidor ejecutándose en el puerto ${config.port} en modo ${config.nodeEnv}`);  
});