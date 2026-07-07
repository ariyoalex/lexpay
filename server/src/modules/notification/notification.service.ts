import Notification from "../../models/Notification";
import { emitToUser } from "../../socket";

export const listNotifications = async (userId: string, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  const [data, total, unreadCount] = await Promise.all([
    Notification.find({ userId }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Notification.countDocuments({ userId }),
    Notification.countDocuments({ userId, isRead: false }),
  ]);

  return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit), unreadCount } };
};

export const markAsRead = async (notificationId: string, userId: string) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, userId },
    { isRead: true },
    { new: true },
  );
  if (!Notification) {
    // Silently handle — notification may not exist
  }
  return notification;
};

export const markAllAsRead = async (userId: string) => {
  await Notification.updateMany({ userId, isRead: false }, { isRead: true });
};

export const getUnreadCount = async (userId: string) => {
  return Notification.countDocuments({ userId, isRead: false });
};

export const createAndEmit = async (userId: string, title: string, message: string, data?: Record<string, unknown>) => {
  const notification = await Notification.create({
    userId,
    type: "in_app",
    title,
    message,
    data,
    status: "sent",
    sentAt: new Date(),
  });

  const doc = notification.toObject();

  emitToUser(userId, "notification", {
    _id: doc._id,
    title: doc.title,
    message: doc.message,
    data: doc.data,
    isRead: doc.isRead,
    createdAt: doc.createdAt,
  });

  return notification;
};
