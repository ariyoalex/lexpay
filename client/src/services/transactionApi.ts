import { get } from "./api";

export interface Transaction {
  _id: string;
  reference: string;
  userId: string;
  type: string;
  amount: number;
  fee: number;
  balanceBefore: number;
  balanceAfter: number;
  status: string;
  description?: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface TransactionFilters {
  type?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface StatementData {
  period: { start: string; end: string };
  openingBalance: number;
  closingBalance: number;
  totalCredits: number;
  totalDebits: number;
  totalFees: number;
  netChange: number;
  transactionCount: number;
  transactions: Transaction[];
}

export function listTransactionsApi(filters: TransactionFilters = {}) {
  const params = new URLSearchParams();
  if (filters.type) params.set("type", filters.type);
  if (filters.status) params.set("status", filters.status);
  if (filters.startDate) params.set("startDate", filters.startDate);
  if (filters.endDate) params.set("endDate", filters.endDate);
  if (filters.minAmount) params.set("minAmount", String(filters.minAmount));
  if (filters.maxAmount) params.set("maxAmount", String(filters.maxAmount));
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  return get<PaginatedResponse<Transaction>>(`/transactions?${params.toString()}`);
}

export function getTransactionByIdApi(id: string) {
  return get<{ success: boolean; data: Transaction }>(`/transactions/${id}`);
}

export function exportCsvApi(filters: TransactionFilters = {}) {
  const params = new URLSearchParams();
  if (filters.type) params.set("type", filters.type);
  if (filters.status) params.set("status", filters.status);
  if (filters.startDate) params.set("startDate", filters.startDate);
  if (filters.endDate) params.set("endDate", filters.endDate);
  return get<Blob>(`/transactions/export/csv?${params.toString()}`);
}

export function exportPdfApi(filters: TransactionFilters = {}) {
  const params = new URLSearchParams();
  if (filters.type) params.set("type", filters.type);
  if (filters.status) params.set("status", filters.status);
  if (filters.startDate) params.set("startDate", filters.startDate);
  if (filters.endDate) params.set("endDate", filters.endDate);
  return get<Blob>(`/transactions/export/pdf?${params.toString()}`);
}

export function generateStatementApi(startDate?: string, endDate?: string) {
  const params = new URLSearchParams();
  if (startDate) params.set("startDate", startDate);
  if (endDate) params.set("endDate", endDate);
  return get<{ success: boolean; data: StatementData }>(`/transactions/statement?${params.toString()}`);
}
