import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Valores por defecto si no existen en el entorno
const defaults = {
  DATABASE_URL: "file:./prisma/dev.db",
  JWT_SECRET: "valor_secreto_por_defecto",
  EXPIRES_IN: "1d",
  PORT: "3000",
  NODE_ENV: "development"
};

// Configuración centralizada
export const config = {
  port: parseInt(process.env.PORT || defaults.PORT, 10),
  jwtSecret: process.env.JWT_SECRET || defaults.JWT_SECRET,
  jwtExpiresIn: process.env.EXPIRES_IN || defaults.EXPIRES_IN,
  databaseUrl: process.env.DATABASE_URL || defaults.DATABASE_URL,
  nodeEnv: process.env.NODE_ENV || defaults.NODE_ENV
}; 