# API de Nutrabionics

Una API REST segura construida con Express.js y TypeScript, siguiendo los principios de arquitectura limpia.

## Características

- Soporte completo para TypeScript
- Arquitectura Limpia (Clean Architecture)
- Base de datos SQLite con Prisma ORM
- Autenticación con JWT
- Características de seguridad (CORS, Helmet, Rate Limiting)
- Documentación de la API con Swagger
- Middleware de manejo de errores
- Validación de datos con class-validator y Zod
- Configuración de entorno con dotenv
- Herramientas de desarrollo (ts-node-dev, ESLint)

## Estructura del Proyecto

```
src/
├── domain/         # Reglas de negocio empresariales
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
│   └── validators/    # Esquemas de validación
└── config/         # Archivos de configuración
```

## Modelo de Datos

La aplicación utiliza Prisma con SQLite y define los siguientes modelos:

- **User**: Gestión de usuarios con autenticación

## Primeros Pasos

1. Clona el repositorio
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Configura las variables de entorno en un archivo `.env` con el siguiente formato:
   ```
   DATABASE_URL="file:./dev.db"
   PORT=3000
   NODE_ENV=development
   JWT_SECRET=tu_secreto_seguro
   ```
4. Ejecuta las migraciones de Prisma:
   ```bash
   npx prisma migrate dev
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

## Documentación de la API

Una vez que el servidor esté en funcionamiento, puedes acceder a la documentación de Swagger en:

```
http://localhost:3000/api-docs
```

## Endpoints Principales

- **POST /api/v1/auth/register**: Registro de nuevos usuarios
- **POST /api/v1/auth/login**: Inicio de sesión de usuarios

## Características de Seguridad

- Protección CORS
- Cabeceras de seguridad con Helmet
- Limitación de tasa de peticiones
- Protección contra payloads JSON maliciosos
- Contraseñas hasheadas con bcrypt
- Autenticación basada en JWT
- Middleware de roles y permisos

## Licencia

ISC
