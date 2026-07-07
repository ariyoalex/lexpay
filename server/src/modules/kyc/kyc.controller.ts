import { AuthRequest } from "../../middleware/authenticate";
import { sendSuccess } from "../../utils/apiResponse";
import * as kycService from "./kyc.service";
import { NextFunction, Response } from "express";

export const getStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await kycService.getKycStatus(req.user!.userId);
    sendSuccess(res, result, "KYC status retrieved");
  } catch (error) {
    next(error);
  }
};

export const submit = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const body = req.body as { level: number; idType: string; idNumber: string; addressProofType?: string };
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    const result = await kycService.submitKyc(req.user!.userId, body, {
      idFront: files?.idFront?.[0],
      idBack: files?.idBack?.[0],
      selfie: files?.selfie?.[0],
      addressDocument: files?.addressDocument?.[0],
    });
    sendSuccess(res, result, "KYC submitted successfully");
  } catch (error) {
    next(error);
  }
};

export const review = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await kycService.reviewKyc(
      req.params.id as string,
      req.user!.userId as string,
      (req.body as any).status as "approved" | "rejected",
      (req.body as any).rejectionReason as string | undefined,
    );
    sendSuccess(res, result, "KYC review updated");
  } catch (error) {
    next(error);
  }
};

export const pending = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const q = req.query as Record<string, string>;
    const result = await kycService.listPendingKyc(Number(q.page) || 1, Number(q.limit) || 20);
    sendSuccess(res, result.data, "Pending KYC list retrieved", result.meta);
  } catch (error) {
    next(error);
  }
};
