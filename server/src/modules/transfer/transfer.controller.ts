import { AuthRequest } from "../../middleware/authenticate";
import { sendSuccess } from "../../utils/apiResponse";
import * as transferService from "./transfer.service";
import { NextFunction, Response } from "express";

export const internalTransfer = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await transferService.initiateInternalTransfer(req.user!.userId, req.body);
    sendSuccess(res, result, "Transfer completed successfully");
  } catch (error) {
    next(error);
  }
};

export const externalTransfer = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await transferService.initiateExternalTransfer(req.user!.userId, req.body);
    sendSuccess(res, result, "External transfer initiated");
  } catch (error) {
    next(error);
  }
};

export const fees = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await transferService.calculateFees(
      Number(req.query.amount),
      req.query.type as "internal" | "external",
    );
    sendSuccess(res, result, "Fee calculated");
  } catch (error) {
    next(error);
  }
};

export const requestOtp = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await transferService.requestTransferOtp(req.user!.userId);
    sendSuccess(res, result, "OTP sent");
  } catch (error) {
    next(error);
  }
};
