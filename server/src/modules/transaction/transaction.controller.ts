import { AuthRequest } from "../../middleware/authenticate";
import { sendSuccess } from "../../utils/apiResponse";
import * as transactionService from "./transaction.service";
import { NextFunction, Response } from "express";

export const list = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const q: Record<string, any> = req.query;
    const result = await transactionService.listTransactions({
      type: q.type as string | undefined,
      status: q.status as string | undefined,
      startDate: q.startDate as string | undefined,
      endDate: q.endDate as string | undefined,
      minAmount: q.minAmount ? Number(q.minAmount) : undefined,
      maxAmount: q.maxAmount ? Number(q.maxAmount) : undefined,
      page: q.page ? Number(q.page) : undefined,
      limit: q.limit ? Number(q.limit) : undefined,
      userId: req.user!.userId,
    });
    sendSuccess(res, result.data, "Transactions retrieved", result.meta);
  } catch (error) {
    next(error);
  }
};

export const getById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const txn = await transactionService.getTransactionById(req.params.id as string);
    sendSuccess(res, txn, "Transaction retrieved");
  } catch (error) {
    next(error);
  }
};
