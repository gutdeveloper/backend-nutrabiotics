import app from "./app";
import { config } from "./config/env.config";

app.listen(config.port, () => console.log(`Servidor ejecutándose en el puerto ${config.port} en modo ${config.nodeEnv}`));