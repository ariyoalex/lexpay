import Transaction from "../../models/Transaction";
import { balanceCacheKey, cacheDel, cacheGet, cacheSet, walletCacheKey } from "./wallet.cache";
import * as walletRepo from "./wallet.repository";

const resetDailyIfNeeded = async (wallet: any) => {
  const now = new Date();
  if (wallet.lastDailyReset) {
    const diff = now.getTime() - new Date(wallet.lastDailyReset).getTime();
    if (diff >= 24 * 60 * 60 * 1000) {
      wallet.dailySpent = 0;
      wallet.lastDailyReset = now;
    }
  } else {
    wallet.lastDailyReset = now;
  }
};

const resetMonthlyIfNeeded = async (wallet: any) => {
  const now = new Date();
  if (wallet.lastMonthlyReset) {
    const diff = now.getTime() - new Date(wallet.lastMonthlyReset).getTime();
    if (diff >= 30 * 24 * 60 * 60 * 1000) {
      wallet.monthlySpent = 0;
      wallet.lastMonthlyReset = now;
    }
  } else {
    wallet.lastMonthlyReset = now;
  }
};

export const getWallet = async (userId: string) => {
  const cacheKey = walletCacheKey(userId);
  const cached = await cacheGet<any>(cacheKey);
  if (cached) return cached;

  const wallet = await walletRepo.findWalletByUserId(userId);
  await cacheSet(cacheKey, wallet);
  return wallet;
};

export const getBalance = async (userId: string) => {
  const cacheKey = balanceCacheKey(userId);
  const cached = await cacheGet<{ balance: number; ledgerBalance: number; pendingBalance: number; currency: string }>(
    cacheKey,
  );
  if (cached) return cached;

  const wallet = await getWallet(userId);
  const balance = {
    balance: wallet.balance,
    ledgerBalance: wallet.ledgerBalance,
    pendingBalance: wallet.pendingBalance,
    currency: wallet.currency,
  };
  await cacheSet(cacheKey, balance);
  return balance;
};

export const getSummary = async (userId: string) => {
  const wallet = await walletRepo.findWalletByUserId(userId);
  await resetDailyIfNeeded(wallet);
  await resetMonthlyIfNeeded(wallet);
  await wallet.save();

  const recentTransactions = await Transaction.find({ userId }).sort({ createdAt: -1 }).limit(5).lean();

  return {
    balance: wallet.balance,
    ledgerBalance: wallet.ledgerBalance,
    pendingBalance: wallet.pendingBalance,
    currency: wallet.currency,
    isFrozen: wallet.isFrozen,
    freezeReason: wallet.freezeReason,
    dailyLimit: wallet.dailyLimit,
    monthlyLimit: wallet.monthlyLimit,
    dailySpent: wallet.dailySpent,
    monthlySpent: wallet.monthlySpent,
    recentTransactions,
  };
};

export const updateLimits = async (userId: string, dailyLimit?: number, monthlyLimit?: number) => {
  const wallet = await walletRepo.findWalletByUserId(userId);
  if (dailyLimit !== undefined) wallet.dailyLimit = dailyLimit;
  if (monthlyLimit !== undefined) wallet.monthlyLimit = monthlyLimit;
  await wallet.save();
  await cacheDel(walletCacheKey(userId));

  return {
    dailyLimit: wallet.dailyLimit,
    monthlyLimit: wallet.monthlyLimit,
  };
};

export const freezeWallet = async (userId: string, reason: string) => {
  const wallet = await walletRepo.findWalletByUserId(userId);
  wallet.isFrozen = true;
  wallet.freezeReason = reason;
  await wallet.save();
  await cacheDel(walletCacheKey(userId));
};

export const unfreezeWallet = async (userId: string) => {
  const wallet = await walletRepo.findWalletByUserId(userId);
  wallet.isFrozen = false;
  wallet.freezeReason = undefined;
  await wallet.save();
  await cacheDel(walletCacheKey(userId));
};

export const getWalletStatus = async (userId: string) => {
  const wallet = await getWallet(userId);
  return {
    isFrozen: wallet.isFrozen,
    freezeReason: wallet.freezeReason,
    isActive: !wallet.isFrozen,
  };
};

export const creditWallet = async (
  userId: string,
  amount: number,
  type: any,
  description?: string,
  metadata?: Record<string, any>,
) => {
  const result = await walletRepo.atomicCredit(userId, amount, type, description, metadata);
  await cacheDel(balanceCacheKey(userId));
  await cacheDel(walletCacheKey(userId));
  return result;
};

export const debitWallet = async (
  userId: string,
  amount: number,
  type: any,
  description?: string,
  metadata?: Record<string, any>,
) => {
  const result = await walletRepo.atomicDebit(userId, amount, type, description, metadata);
  await cacheDel(balanceCacheKey(userId));
  await cacheDel(walletCacheKey(userId));
  return result;
};
