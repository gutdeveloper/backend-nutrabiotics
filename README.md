# Nutrabionics API

A secure REST API built with Express.js and TypeScript, following clean architecture principles.

## Features

- TypeScript support
- Clean Architecture
- Security features (CORS, Helmet, Rate Limiting)
- API documentation with Swagger
- Error handling middleware
- Environment configuration
- Development tools (ts-node-dev, ESLint)

## Project Structure

```
src/
├── domain/         # Reglas de negocio empresariales
├── application/    # Reglas de negocio de la aplicación
├── infrastructure/ # Frameworks, drivers y herramientas
│   └── http/      # Implementación específica de Express.js
│       ├── controllers/  # Controladores HTTP
│       ├── middlewares/  # Middlewares HTTP
│       └── routes/       # Rutas HTTP
└── config/         # Archivos de configuración
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and configure your environment variables
4. Run the development server:
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev`: Start development server with hot-reload
- `npm run build`: Build the project
- `npm start`: Start production server
- `npm run lint`: Run ESLint
- `npm test`: Run tests

## API Documentation

Once the server is running, you can access the Swagger documentation at:

```
http://localhost:3000/api-docs
```

## Security Features

- CORS protection
- Helmet security headers
- Rate limiting
- JSON payload protection
- Security best practices

## License

ISC
