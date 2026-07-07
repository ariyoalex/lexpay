import AuditLog from "../../models/AuditLog";
import Transaction from "../../models/Transaction";
import User from "../../models/User";
import Wallet from "../../models/Wallet";
import { ApiError } from "../../utils/apiError";
import { balanceCacheKey, cacheDel, walletCacheKey } from "../wallet/wallet.cache";

export const getDashboardStats = async () => {
  const [totalUsers, activeUsers, totalWallets, walletAgg, dailyTransactions, failedTransactions, revenueAgg] =
    await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      Wallet.countDocuments(),
      Wallet.aggregate([
        { $group: { _id: null, totalBalance: { $sum: "$balance" }, totalLedger: { $sum: "$ledgerBalance" } } },
      ]),
      Transaction.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      }),
      Transaction.countDocuments({ status: "failed", createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } }),
      Transaction.aggregate([
        { $match: { status: "completed", type: { $in: ["funding", "transfer_in", "credit"] } } },
        { $group: { _id: null, totalRevenue: { $sum: "$fee" } } },
      ]),
    ]);

  return {
    totalUsers,
    activeUsers,
    totalWallets,
    totalBalance: walletAgg[0]?.totalBalance || 0,
    totalLedger: walletAgg[0]?.totalLedger || 0,
    dailyTransactions,
    failedTransactions,
    totalRevenue: revenueAgg[0]?.totalRevenue || 0,
  };
};

export const listUsers = async (search?: string, page = 1, limit = 20) => {
  const filter: Record<string, any> = {};
  if (search) {
    filter.$or = [
      { firstName: { $regex: search, $options: "i" } },
      { lastName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).select("-password -pin -twoFactorSecret").lean(),
    User.countDocuments(filter),
  ]);

  return {
    data,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

export const toggleUserStatus = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound("User not found");
  user.isActive = !user.isActive;
  await user.save();
  return { userId, isActive: user.isActive };
};

export const listAllTransactions = async (query: {
  userId?: string;
  type?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}) => {
  const filter: Record<string, any> = {};
  if (query.userId) filter.userId = query.userId;
  if (query.type) filter.type = query.type;
  if (query.status) filter.status = query.status;
  if (query.startDate || query.endDate) {
    filter.createdAt = {};
    if (query.startDate) filter.createdAt.$gte = new Date(query.startDate);
    if (query.endDate) filter.createdAt.$lte = new Date(query.endDate);
  }

  const page = query.page || 1;
  const limit = Math.min(query.limit || 20, 100);
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    Transaction.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("userId", "firstName lastName email")
      .lean(),
    Transaction.countDocuments(filter),
  ]);

  return {
    data,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

export const manageFreezeWallet = async (userId: string, reason: string) => {
  const wallet = await Wallet.findOne({ userId });
  if (!wallet) throw ApiError.notFound("Wallet not found");
  wallet.isFrozen = true;
  wallet.freezeReason = reason;
  await wallet.save();
  await cacheDel(walletCacheKey(userId));
  await cacheDel(balanceCacheKey(userId));
};

export const manageUnfreezeWallet = async (userId: string) => {
  const wallet = await Wallet.findOne({ userId });
  if (!wallet) throw ApiError.notFound("Wallet not found");
  wallet.isFrozen = false;
  wallet.freezeReason = undefined;
  await wallet.save();
  await cacheDel(walletCacheKey(userId));
  await cacheDel(balanceCacheKey(userId));
};

export const getAuditLogs = async (page = 1, limit = 20, severity?: string, action?: string) => {
  const filter: Record<string, any> = {};
  if (severity) filter.severity = severity;
  if (action) filter.action = { $regex: action, $options: "i" };

  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    AuditLog.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("userId", "firstName lastName email")
      .lean(),
    AuditLog.countDocuments(filter),
  ]);

  return {
    data,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

export const getAnalytics = async (days = 30) => {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const [dailyUsers, dailyTxns, topTxns] = await Promise.all([
    User.aggregate([
      { $match: { createdAt: { $gte: since } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]),
    Transaction.aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
          totalAmount: { $sum: "$amount" },
          totalFees: { $sum: "$fee" },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    Transaction.aggregate([
      { $match: { createdAt: { $gte: since }, status: "completed" } },
      { $group: { _id: "$type", count: { $sum: 1 }, total: { $sum: "$amount" } } },
    ]),
  ]);

  return {
    period: `${days} days`,
    dailyUsers,
    dailyTransactions: dailyTxns,
    byType: topTxns,
  };
};

export const broadcastNotification = async (title: string, message: string, target: "all" | "manage") => {
  const filter = target === "manage" ? { role: "manage" } : {};
  const userCount = await User.countDocuments(filter);

  await AuditLog.create({
    action: "broadcast",
    resource: "notification",
    details: { title, message, target, userCount },
    severity: "info",
  });

  return { sent: true, userCount };
};
