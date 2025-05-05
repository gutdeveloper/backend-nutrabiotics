# API de Nutrabionics

Una API REST segura construida con Express.js y TypeScript, siguiendo los principios de arquitectura limpia.

## Características

- Arquitectura Limpia (Clean Architecture)
- Base de datos SQLite con Prisma ORM
- Autenticación con JWT
- Características de seguridad (CORS, Helmet, Rate Limiting)
- Middleware de manejo de errores
- Validación de datos con Zod
- Sistema de logging diario con Winston

## Estructura del Proyecto

```
src/
├── domain/         # Reglas de negocio
│   ├── entities/   # Entidades del dominio
│   ├── interfaces/ # Interfaces y contratos
│   └── errors/     # Definiciones de errores
├── application/    # Reglas de negocio de la aplicación
│   ├── dtos/       # Objetos de transferencia de datos
│   └── use-cases/  # Casos de uso de la aplicación
├── infrastructure/ # Frameworks, drivers y herramientas
│   ├── controllers/   # Controladores HTTP
│   ├── middlewares/   # Middlewares HTTP
│   ├── repositories/  # Implementaciones de repositorios
│   ├── routes/        # Definición de rutas
│   ├── services/      # Servicios de infraestructura
│   ├── validators/    # Esquemas de validación
│   └── logger/        # Sistema de logging
└── config/         # Archivos de configuración
```

## Modelo de Datos

La aplicación utiliza Prisma con PostgreSQL y define los siguientes modelos:

- **User**: Gestión de usuarios con autenticación
- **Product**: Gestión de productos
- **Order**: Gestión de órdenes
- **OrderItem**: Items dentro de las órdenes

## Configuración con Docker

El proyecto incluye una configuración de Docker para PostgreSQL:

1. Asegúrate de tener Docker instalado en tu sistema
2. Inicia los contenedores:
   ```bash
   docker-compose up -d
   ```
3. El servidor PostgreSQL estará disponible en:
   - Host: localhost
   - Puerto: 5432
   - Usuario: admin
   - Contraseña: admin
   - Base de datos: nutrabiotics

## Primeros Pasos

1. Clona el repositorio
   ```bash
   git clone https://github.com/gutdeveloper/backend-nutrabiotics.git
   cd backend-nutrabiotics
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Configura las variables de entorno en un archivo `.env` con el siguiente formato:
   ```
   DATABASE_URL="postgresql://admin:admin@localhost:5432/nutrabiotics"
   PORT=3000
   NODE_ENV=development
   JWT_SECRET=tu_secreto_seguro
   ```
4. Ejecuta las migraciones de Prisma:
   ```bash
   npx prisma migrate dev
   ```
5. Ejecuta el seeder para crear unos productos de ejemplo y un usuario admin:
   ```bash
   npm run seed

   admin@nutrabiotics.com admin123
   ```
5. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo con recarga automática
- `npm run build`: Compila el proyecto
- `npm start`: Inicia el servidor en modo producción
- `npm run lint`: Ejecuta ESLint
- `npm test`: Ejecuta las pruebas

## Endpoints

- **POST /api/v1/auth/register**: Registro de nuevos usuarios
- **POST /api/v1/auth/login**: Inicio de sesión de usuarios

## Características de Seguridad

- Protección CORS
- Cabeceras de seguridad con Helmet
- Limitación de tasa de peticiones
- Protección contra payloads JSON maliciosos
- Contraseñas hasheadas con bcrypt
- Autenticación basada en JWT
- Middleware de roles

## Sistema de Logging

La aplicación implementa un sistema de logging basado en Winston que:

- Guarda logs en archivos diarios con el formato `YYYY-MM-DD.log` en la carpeta `/logs`
- Cambia automáticamente al archivo del siguiente día a medianoche
- Muestra logs coloreados en consola durante el desarrollo
- Captura información de errores y solicitudes HTTP
- Registra la duración de las peticiones HTTP

### Niveles de Log

- **error**: Errores críticos que afectan el funcionamiento
- **warn**: Advertencias importantes
- **info**: Información general (nivel predeterminado en producción)
- **debug**: Información detallada (solo en desarrollo)

### Uso en el Código

```typescript
import logger from '../infrastructure/logger/logger';

// Ejemplos de uso
logger.info('Mensaje informativo');
logger.warn('Advertencia');
logger.error('Error crítico', error);
```