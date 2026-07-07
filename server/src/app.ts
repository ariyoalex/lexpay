import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import config from "./config/index";
import { errorHandler } from "./middleware/errorHandler";
import authRoutes from "./modules/auth/auth.routes";

const app = express();

app.use(helmet());
app.use(cors({ origin: config.corsOrigin.split(","), credentials: true }));
app.use(compression());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan(config.nodeEnv === "production" ? "combined" : "dev"));

app.get("/health", (_req, res) => {
  res.json({ success: true, message: "LexPay API is running", timestamp: new Date().toISOString() });
});

app.use("/api/v1/auth", authRoutes);

app.use(errorHandler);

export default app;
