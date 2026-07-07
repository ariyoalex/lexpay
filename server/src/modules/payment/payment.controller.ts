import { AuthRequest } from "../../middleware/authenticate";
import User from "../../models/User";
import { sendSuccess } from "../../utils/apiResponse";
import * as paymentService from "./payment.service";
import { verifyWebhookSignature } from "./payment.utils";
import { NextFunction, Request, Response } from "express";

export const initialize = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { amount } = req.body;
    const user = await User.findById(req.user!.userId);
    if (!user) return next(new Error("User not found"));
    const result = await paymentService.initializePayment(req.user!.userId, user.email, amount);
    sendSuccess(res, result, "Payment initialized successfully");
  } catch (error) {
    next(error);
  }
};

export const verify = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { reference } = req.body;
    const result = await paymentService.verifyPayment(req.user!.userId, reference);
    sendSuccess(res, result, "Payment verified successfully");
  } catch (error) {
    next(error);
  }
};

export const webhook = async (req: Request, res: Response) => {
  const signature = req.headers["x-paystack-signature"] as string;
  const payload = (req as any).rawBody || JSON.stringify(req.body);

  if (!signature || !verifyWebhookSignature(payload, signature)) {
    return res.status(401).json({ status: false, message: "Invalid signature" });
  }

  try {
    const result = await paymentService.handleWebhook(req.body.event, req.body);
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

export const getMethods = async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const methods = await paymentService.getFundingMethods();
    sendSuccess(res, methods, "Funding methods retrieved");
  } catch (error) {
    next(error);
  }
};
