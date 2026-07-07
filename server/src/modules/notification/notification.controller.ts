import { AuthRequest } from "../../middleware/authenticate";
import { sendSuccess } from "../../utils/apiResponse";
import * as notificationService from "./notification.service";
import { NextFunction, Response } from "express";

export const list = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const q = req.query as Record<string, string>;
    const result = await notificationService.listNotifications(
      req.user!.userId,
      Number(q.page) || 1,
      Number(q.limit) || 20,
    );
    sendSuccess(res, result.data, "Notifications retrieved", result.meta);
  } catch (error) {
    next(error);
  }
};

export const markRead = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await notificationService.markAsRead(req.params.id as string, req.user!.userId);
    sendSuccess(res, null, "Notification marked as read");
  } catch (error) {
    next(error);
  }
};

export const markAllRead = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await notificationService.markAllAsRead(req.user!.userId);
    sendSuccess(res, null, "All notifications marked as read");
  } catch (error) {
    next(error);
  }
};

export const unreadCount = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const count = await notificationService.getUnreadCount(req.user!.userId);
    sendSuccess(res, { count }, "Unread count retrieved");
  } catch (error) {
    next(error);
  }
};
