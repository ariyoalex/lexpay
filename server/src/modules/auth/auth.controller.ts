import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../../middleware/authenticate";
import * as authService from "./auth.service";
import { sendSuccess } from "../../utils/apiResponse";

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.register(req.body);
    sendSuccess(res, { userId: result.userId }, "Registration successful. Check your email for OTP.", undefined, 201);
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.login({ email: req.body.email, password: req.body.password }, req.body.deviceInfo, req.ip);
    sendSuccess(res, result, "Login successful");
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await authService.logout(req.body.refreshToken);
    sendSuccess(res, null, "Logout successful");
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.refreshTokenPair(req.body.refreshToken);
    sendSuccess(res, result, "Token refreshed");
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await authService.verifyEmail(req.body);
    sendSuccess(res, null, "Email verified successfully");
  } catch (error) {
    next(error);
  }
};

export const verifyPhone = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await authService.verifyPhone(req.body);
    sendSuccess(res, null, "Phone verified successfully");
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await authService.forgotPassword(req.body);
    sendSuccess(res, null, "If the email exists, an OTP has been sent");
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await authService.resetPassword(req.body);
    sendSuccess(res, null, "Password reset successfully");
  } catch (error) {
    next(error);
  }
};

export const enable2FA = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await authService.enable2FA(req.user!.userId, req.body.password);
    sendSuccess(res, null, "2FA enabled successfully");
  } catch (error) {
    next(error);
  }
};

export const verify2FA = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await authService.verify2FA(req.user!.userId, req.body.code);
    sendSuccess(res, null, "2FA verification successful");
  } catch (error) {
    next(error);
  }
};
