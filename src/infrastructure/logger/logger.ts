import winston from 'winston';
import path from 'path';
import fs from 'fs';

// Asegurarse de que el directorio de logs exista
const logsDir = path.join(__dirname, '../../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Función para obtener el nombre del archivo basado en la fecha actual
const getFilename = () => {
  const date = new Date();
  return path.join(logsDir, `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}.log`);
};

// Colores personalizados para los niveles de log
const customColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  debug: 'blue'
};

// Añadir los colores personalizados
winston.addColors(customColors);

// Configuración del logger
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  transports: [
    // Consola para desarrollo
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.simple()
      )
    }),
    // Archivo de log diario
    new winston.transports.Stream({
      stream: fs.createWriteStream(getFilename(), { flags: 'a' })
    })
  ]
});

// Reiniciar el transport de archivo cuando cambie el día
const resetFileTransportAtMidnight = () => {
  const now = new Date();
  const night = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1, // mañana
    0, 0, 0 // medianoche
  );
  const timeToMidnight = night.getTime() - now.getTime();

  setTimeout(() => {
    // Quitar el transport antiguo
    logger.transports.forEach((transport, index) => {
      if (transport instanceof winston.transports.Stream) {
        logger.transports.splice(index, 1);
      }
    });

    // Añadir un nuevo transport con el nombre de archivo actualizado
    logger.add(new winston.transports.Stream({
      stream: fs.createWriteStream(getFilename(), { flags: 'a' })
    }));

    // Configurar para la siguiente medianoche
    resetFileTransportAtMidnight();
  }, timeToMidnight);
};

// Iniciar el temporizador para reiniciar el transport a medianoche
resetFileTransportAtMidnight();

export default logger; 