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

export const exportCsv = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const q: Record<string, any> = req.query;
    const csv = await transactionService.exportCsv({
      type: q.type as string | undefined,
      status: q.status as string | undefined,
      startDate: q.startDate as string | undefined,
      endDate: q.endDate as string | undefined,
      minAmount: q.minAmount ? Number(q.minAmount) : undefined,
      maxAmount: q.maxAmount ? Number(q.maxAmount) : undefined,
      userId: req.user!.userId,
    });
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename=transactions-${Date.now()}.csv`);
    res.send(csv);
  } catch (error) {
    next(error);
  }
};

export const exportPdf = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const q: Record<string, any> = req.query;
    const pdf = await transactionService.exportPdf({
      type: q.type as string | undefined,
      status: q.status as string | undefined,
      startDate: q.startDate as string | undefined,
      endDate: q.endDate as string | undefined,
      minAmount: q.minAmount ? Number(q.minAmount) : undefined,
      maxAmount: q.maxAmount ? Number(q.maxAmount) : undefined,
      userId: req.user!.userId,
    });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=statement-${Date.now()}.pdf`);
    res.send(pdf);
  } catch (error) {
    next(error);
  }
};

export const statement = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await transactionService.generateStatement(
      req.user!.userId,
      req.query.startDate as string | undefined,
      req.query.endDate as string | undefined,
    );
    sendSuccess(res, result, "Statement generated");
  } catch (error) {
    next(error);
  }
};
