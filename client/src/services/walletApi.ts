import { get, post, put } from "./api";

export interface WalletBalance {
  balance: number;
  ledgerBalance: number;
  pendingBalance: number;
  currency: string;
}

export interface WalletSummary extends WalletBalance {
  isFrozen: boolean;
  freezeReason?: string;
  dailyLimit?: number;
  monthlyLimit?: number;
  dailySpent: number;
  monthlySpent: number;
  recentTransactions: any[];
}

export interface WalletStatus {
  isFrozen: boolean;
  freezeReason?: string;
  isActive: boolean;
}

export interface WalletLimits {
  dailyLimit?: number;
  monthlyLimit?: number;
}

export function getBalanceApi() {
  return get<{ success: boolean; data: WalletBalance }>("/wallet/balance");
}

export function getWalletSummaryApi() {
  return get<{ success: boolean; data: WalletSummary }>("/wallet/summary");
}

export function getWalletStatusApi() {
  return get<{ success: boolean; data: WalletStatus }>("/wallet/status");
}

export function updateLimitsApi(data: WalletLimits) {
  return put<{ success: boolean; data: WalletLimits }>("/wallet/limits", data);
}

export function freezeWalletApi(reason: string) {
  return post<{ success: boolean; message: string }>("/wallet/freeze", { reason });
}

export function unfreezeWalletApi() {
  return post<{ success: boolean; message: string }>("/wallet/unfreeze");
}
