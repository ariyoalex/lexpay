import { AuthRequest } from "../../middleware/authenticate";
import { sendSuccess } from "../../utils/apiResponse";
import * as manageService from "./manage.service";
import { NextFunction, Response } from "express";

export const dashboard = async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const stats = await manageService.getDashboardStats();
    sendSuccess(res, stats, "Dashboard stats retrieved");
  } catch (error) {
    next(error);
  }
};

export const users = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const q = req.query as Record<string, string>;
    const result = await manageService.listUsers(q.search, Number(q.page) || 1, Number(q.limit) || 20);
    sendSuccess(res, result.data, "Users retrieved", result.meta);
  } catch (error) {
    next(error);
  }
};

export const toggleStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await manageService.toggleUserStatus(req.params.id as string);
    sendSuccess(res, result, "User status updated");
  } catch (error) {
    next(error);
  }
};

export const transactions = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const q = req.query as Record<string, string>;
    const result = await manageService.listAllTransactions({
      userId: q.userId,
      type: q.type,
      status: q.status,
      startDate: q.startDate,
      endDate: q.endDate,
      page: Number(q.page) || 1,
      limit: Number(q.limit) || 20,
    });
    sendSuccess(res, result.data, "Transactions retrieved", result.meta);
  } catch (error) {
    next(error);
  }
};

export const freezeWallet = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await manageService.manageFreezeWallet(req.params.userId as string, req.body.reason);
    sendSuccess(res, null, "Wallet frozen");
  } catch (error) {
    next(error);
  }
};

export const unfreezeWallet = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await manageService.manageUnfreezeWallet(req.params.userId as string);
    sendSuccess(res, null, "Wallet unfrozen");
  } catch (error) {
    next(error);
  }
};

export const auditLogs = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const q = req.query as Record<string, string>;
    const result = await manageService.getAuditLogs(Number(q.page) || 1, Number(q.limit) || 20, q.severity, q.action);
    sendSuccess(res, result.data, "Audit logs retrieved", result.meta);
  } catch (error) {
    next(error);
  }
};

export const analytics = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const days = Number((req.query as Record<string, string>).days) || 30;
    const result = await manageService.getAnalytics(days);
    sendSuccess(res, result, "Analytics retrieved");
  } catch (error) {
    next(error);
  }
};

export const broadcast = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await manageService.broadcastNotification(req.body.title, req.body.message, req.body.target);
    sendSuccess(res, result, "Notification broadcasted");
  } catch (error) {
    next(error);
  }
};
