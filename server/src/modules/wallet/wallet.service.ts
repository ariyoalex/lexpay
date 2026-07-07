import Transaction from "../../models/Transaction";
import Wallet from "../../models/Wallet";

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
  let wallet = await Wallet.findOne({ userId });
  if (!wallet) {
    wallet = await Wallet.create({ userId });
  }
  return wallet;
};

export const getBalance = async (userId: string) => {
  const wallet = await getWallet(userId);
  return {
    balance: wallet.balance,
    ledgerBalance: wallet.ledgerBalance,
    pendingBalance: wallet.pendingBalance,
    currency: wallet.currency,
  };
};

export const getSummary = async (userId: string) => {
  const wallet = await getWallet(userId);
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
    dailyLimit: wallet.dailyLimit,
    monthlyLimit: wallet.monthlyLimit,
    dailySpent: wallet.dailySpent,
    monthlySpent: wallet.monthlySpent,
    recentTransactions,
  };
};

export const updateLimits = async (userId: string, dailyLimit?: number, monthlyLimit?: number) => {
  const wallet = await getWallet(userId);
  if (dailyLimit !== undefined) wallet.dailyLimit = dailyLimit;
  if (monthlyLimit !== undefined) wallet.monthlyLimit = monthlyLimit;
  await wallet.save();
  return {
    dailyLimit: wallet.dailyLimit,
    monthlyLimit: wallet.monthlyLimit,
  };
};

export const freezeWallet = async (userId: string, reason: string) => {
  const wallet = await getWallet(userId);
  wallet.isFrozen = true;
  wallet.freezeReason = reason;
  await wallet.save();
};

export const unfreezeWallet = async (userId: string) => {
  const wallet = await getWallet(userId);
  wallet.isFrozen = false;
  wallet.freezeReason = undefined;
  await wallet.save();
};

export const getWalletStatus = async (userId: string) => {
  const wallet = await getWallet(userId);
  return {
    isFrozen: wallet.isFrozen,
    freezeReason: wallet.freezeReason,
    isActive: !wallet.isFrozen,
  };
};
