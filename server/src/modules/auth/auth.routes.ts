import { Router } from "express";
import { validate } from "../../middleware/validate";
import { authenticate } from "../../middleware/authenticate";
import {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  verifyPhoneSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  enable2FASchema,
  verify2FASchema,
} from "./auth.validation";
import * as authController from "./auth.controller";

const router = Router();

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post("/logout", authController.logout);
router.post("/refresh-token", authController.refreshToken);
router.post("/verify-email", validate(verifyEmailSchema), authController.verifyEmail);
router.post("/verify-phone", validate(verifyPhoneSchema), authController.verifyPhone);
router.post("/forgot-password", validate(forgotPasswordSchema), authController.forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), authController.resetPassword);
router.post("/enable-2fa", authenticate, validate(enable2FASchema), authController.enable2FA);
router.post("/verify-2fa", authenticate, validate(verify2FASchema), authController.verify2FA);

export default router;
