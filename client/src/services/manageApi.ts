import { get, post, put } from "./api";

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalWallets: number;
  totalBalance: number;
  totalLedger: number;
  dailyTransactions: number;
  failedTransactions: number;
  totalRevenue: number;
}

export interface ManageUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  isActive: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  createdAt: string;
}

export interface AuditLog {
  _id: string;
  userId?: { _id: string; firstName: string; lastName: string; email: string };
  action: string;
  resource: string;
  details?: Record<string, any>;
  severity: string;
  createdAt: string;
}

export function getDashboardStatsApi() {
  return get<{ success: boolean; data: DashboardStats }>("/manage/dashboard");
}

export function listManageUsersApi(search?: string, page = 1, limit = 20) {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  params.set("page", String(page));
  params.set("limit", String(limit));
  return get<{
    success: boolean;
    data: ManageUser[];
    meta: { page: number; limit: number; total: number; totalPages: number };
  }>(`/manage/users?${params.toString()}`);
}

export function getManageUserDetailApi(userId: string) {
  return get<{ success: boolean; data: { user: ManageUser; wallet: any; recentTransactions: any[] } }>(
    `/manage/users/${userId}`,
  );
}

export function toggleUserStatusApi(userId: string) {
  return put<{ success: boolean; data: { userId: string; isActive: boolean } }>(
    `/manage/users/${userId}/toggle-status`,
  );
}

export function listManageTransactionsApi(filters: Record<string, string> = {}) {
  const params = new URLSearchParams(filters);
  return get(`/manage/transactions?${params.toString()}`);
}

export function manageFreezeWalletApi(userId: string, reason: string) {
  return post(`/manage/wallets/${userId}/freeze`, { reason });
}

export function manageUnfreezeWalletApi(userId: string) {
  return post(`/manage/wallets/${userId}/unfreeze`);
}

export function getAuditLogsApi(severity?: string, action?: string, page = 1) {
  const params = new URLSearchParams();
  if (severity) params.set("severity", severity);
  if (action) params.set("action", action);
  params.set("page", String(page));
  return get<{ success: boolean; data: AuditLog[]; meta: any }>(`/manage/audit-logs?${params.toString()}`);
}

export function getAnalyticsApi(days = 30) {
  return get(`/manage/analytics?days=${days}`);
}

export function broadcastNotificationApi(title: string, message: string, target: "all" | "manage") {
  return post("/manage/broadcast", { title, message, target });
}
