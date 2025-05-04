import { config } from "./config/env.config";
import express from "express";
import cors, { CorsOptions } from "cors";
import helmet, { HelmetOptions } from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import authRoutes from "./infrastructure/routes/auth.routes";
import { errorHandler } from "./infrastructure/middlewares/errors.middleware";

const app = express();

const helmetOptions: HelmetOptions = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://trusted.cdn.com"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  referrerPolicy: { policy: "no-referrer" },
  frameguard: { action: "deny" },
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
  noSniff: true,
  xssFilter: true,
};

const corsOptions: CorsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

app.use(helmet(helmetOptions));
app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan("dev"));
app.use(limiter);
app.use(`/api/v1/auth`, authRoutes);
app.use(errorHandler);

export default app;
