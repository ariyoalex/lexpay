import { useAuth } from "./AuthContext";
import { createContext, type ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react";

import NotificationToast, { type ToastMessage } from "@/components/notification/NotificationToast";
import {
  listNotificationsApi,
  markAllNotificationsReadApi,
  markNotificationReadApi,
  type NotificationItem,
} from "@/services/notificationApi";
import { connectSocket, disconnectSocket } from "@/services/socket";

interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  loading: boolean;
  latestToast: ToastMessage | null;
  dismissToast: () => void;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  refresh: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, accessToken } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [latestToast, setLatestToast] = useState<ToastMessage | null>(null);
  const connectedRef = useRef(false);

  const dismissToast = useCallback(() => setLatestToast(null), []);

  const refresh = useCallback(async () => {
    try {
      const res = await listNotificationsApi();
      setNotifications(res.data);
      setUnreadCount(res.meta.unreadCount);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !accessToken) {
      disconnectSocket();
      connectedRef.current = false;
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    refresh();

    if (!connectedRef.current) {
      const socket = connectSocket(accessToken);

      socket.on("notification", (data: NotificationItem) => {
        setNotifications((prev) => [data, ...prev]);
        setUnreadCount((prev) => prev + 1);
        setLatestToast({ id: data._id, title: data.title, message: data.message });
      });

      connectedRef.current = true;
    }

    return () => {
      disconnectSocket();
      connectedRef.current = false;
    };
  }, [isAuthenticated, accessToken, refresh]);

  const markRead = useCallback(async (id: string) => {
    try {
      await markNotificationReadApi(id);
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
      // ignore
    }
  }, []);

  const markAllRead = useCallback(async () => {
    try {
      await markAllNotificationsReadApi();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {
      // ignore
    }
  }, []);

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, loading, latestToast, dismissToast, markRead, markAllRead, refresh }}
    >
      {children}
      <NotificationToast toast={latestToast} onClose={dismissToast} />
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationProvider");
  return ctx;
}
