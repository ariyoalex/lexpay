import Transaction from "../../models/Transaction";
import { ApiError } from "../../utils/apiError";

interface TransactionQuery {
  userId?: string;
  type?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  page?: number;
  limit?: number;
}

interface PaginatedResult<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const listTransactions = async (query: TransactionQuery): Promise<PaginatedResult<any>> => {
  const filter: Record<string, any> = {};

  if (query.userId) filter.userId = query.userId;
  if (query.type) filter.type = query.type;
  if (query.status) filter.status = query.status;

  if (query.startDate || query.endDate) {
    filter.createdAt = {};
    if (query.startDate) filter.createdAt.$gte = new Date(query.startDate);
    if (query.endDate) filter.createdAt.$lte = new Date(query.endDate);
  }

  if (query.minAmount !== undefined || query.maxAmount !== undefined) {
    filter.amount = {};
    if (query.minAmount !== undefined) filter.amount.$gte = query.minAmount;
    if (query.maxAmount !== undefined) filter.amount.$lte = query.maxAmount;
  }

  const page = query.page || 1;
  const limit = Math.min(query.limit || 20, 100);
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    Transaction.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Transaction.countDocuments(filter),
  ]);

  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getTransactionById = async (id: string) => {
  const txn = await Transaction.findById(id).lean();
  if (!txn) throw ApiError.notFound("Transaction not found");
  return txn;
};

export const getTransactionByReference = async (reference: string) => {
  const txn = await Transaction.findOne({ reference }).lean();
  if (!txn) throw ApiError.notFound("Transaction not found");
  return txn;
};
