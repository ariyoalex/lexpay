import { AuthRequest } from "../../middleware/authenticate";
import { sendSuccess } from "../../utils/apiResponse";
import * as userService from "./user.service";
import { NextFunction, Response } from "express";

export const getProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await userService.getProfile(req.user!.userId);
    sendSuccess(res, user, "Profile retrieved successfully");
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await userService.updateProfile(req.user!.userId, req.body);
    sendSuccess(res, user, "Profile updated successfully");
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await userService.changePassword(req.user!.userId, req.body.currentPassword, req.body.newPassword);
    sendSuccess(res, null, "Password changed successfully");
  } catch (error) {
    next(error);
  }
};

export const changePin = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await userService.changePin(req.user!.userId, req.body.currentPin, req.body.newPin);
    sendSuccess(res, null, "PIN changed successfully");
  } catch (error) {
    next(error);
  }
};

export const getSessions = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const sessions = await userService.getSessions(req.user!.userId);
    sendSuccess(res, sessions, "Sessions retrieved successfully");
  } catch (error) {
    next(error);
  }
};

export const revokeSession = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await userService.revokeSession(req.user!.userId, req.params.id as string);
    sendSuccess(res, null, "Session revoked successfully");
  } catch (error) {
    next(error);
  }
};
