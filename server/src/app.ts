import config from "./config/index";
import { errorHandler } from "./middleware/errorHandler";
import authRoutes from "./modules/auth/auth.routes";
import beneficiaryRoutes from "./modules/beneficiary/beneficiary.routes";
import kycRoutes from "./modules/kyc/kyc.routes";
import manageRoutes from "./modules/manage/manage.routes";
import notificationRoutes from "./modules/notification/notification.routes";
import paymentRoutes from "./modules/payment/payment.routes";
import transactionRoutes from "./modules/transaction/transaction.routes";
import transferRoutes from "./modules/transfer/transfer.routes";
import userRoutes from "./modules/user/user.routes";
import walletRoutes from "./modules/wallet/wallet.routes";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

const app = express();

app.use(helmet());
app.use(cors({ origin: config.corsOrigin.split(","), credentials: true }));
app.use(compression());
app.use(
  express.json({
    limit: "10mb",
    verify: (req: any, _res, buf) => {
      req.rawBody = buf.toString();
    },
  }),
);
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan(config.nodeEnv === "production" ? "combined" : "dev"));

app.get("/health", (_req, res) => {
  res.json({ success: true, message: "LexPay API is running", timestamp: new Date().toISOString() });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/wallet", walletRoutes);
app.use("/api/v1/beneficiaries", beneficiaryRoutes);
app.use("/api/v1/kyc", kycRoutes);
app.use("/api/v1/manage", manageRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/transactions", transactionRoutes);
app.use("/api/v1/transfers", transferRoutes);

app.use(errorHandler);

export default app;
