import { get, put } from "./api";

export interface NotificationItem {
  _id: string;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  createdAt: string;
}

export function listNotificationsApi(page = 1) {
  return get<{
    success: boolean;
    data: NotificationItem[];
    meta: { page: number; limit: number; total: number; totalPages: number; unreadCount: number };
  }>(`/notifications?page=${page}`);
}

export function markNotificationReadApi(id: string) {
  return put(`/notifications/${id}/read`);
}

export function markAllNotificationsReadApi() {
  return put("/notifications/read-all");
}

export function getUnreadCountApi() {
  return get<{ success: boolean; data: { count: number } }>("/notifications/unread-count");
}
