import { AuthRequest } from "../../middleware/authenticate";
import { sendSuccess } from "../../utils/apiResponse";
import * as walletService from "./wallet.service";
import { NextFunction, Response } from "express";

export const getBalance = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const balance = await walletService.getBalance(req.user!.userId);
    sendSuccess(res, balance, "Balance retrieved successfully");
  } catch (error) {
    next(error);
  }
};

export const getSummary = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const summary = await walletService.getSummary(req.user!.userId);
    sendSuccess(res, summary, "Wallet summary retrieved successfully");
  } catch (error) {
    next(error);
  }
};

export const getStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const status = await walletService.getWalletStatus(req.user!.userId);
    sendSuccess(res, status, "Wallet status retrieved successfully");
  } catch (error) {
    next(error);
  }
};

export const updateLimits = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const limits = await walletService.updateLimits(req.user!.userId, req.body.dailyLimit, req.body.monthlyLimit);
    sendSuccess(res, limits, "Limits updated successfully");
  } catch (error) {
    next(error);
  }
};

export const freeze = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await walletService.freezeWallet(req.user!.userId, req.body.reason);
    sendSuccess(res, null, "Wallet frozen successfully");
  } catch (error) {
    next(error);
  }
};

export const unfreeze = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await walletService.unfreezeWallet(req.user!.userId);
    sendSuccess(res, null, "Wallet unfrozen successfully");
  } catch (error) {
    next(error);
  }
};
