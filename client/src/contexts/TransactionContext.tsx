import { createContext, type ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react";

import { listTransactionsApi, type Transaction, type TransactionFilters } from "@/services/transactionApi";

interface TransactionState {
  transactions: Transaction[];
  filters: TransactionFilters;
  page: number;
  totalPages: number;
  total: number;
  isLoading: boolean;
  error: string | null;
}

interface TransactionContextType extends TransactionState {
  setFilters: (filters: TransactionFilters) => void;
  setPage: (page: number) => void;
  refresh: () => Promise<void>;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export function TransactionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<TransactionState>({
    transactions: [],
    filters: {},
    page: 1,
    totalPages: 0,
    total: 0,
    isLoading: true,
    error: null,
  });

  const activeFilters = useRef(state.filters);
  const activePage = useRef(state.page);

  const doFetch = useCallback(async (filters: TransactionFilters, page: number) => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const res = await listTransactionsApi({ ...filters, page });
      setState((prev) => ({
        ...prev,
        transactions: res.data,
        totalPages: res.meta.totalPages,
        total: res.meta.total,
        isLoading: false,
        error: null,
      }));
    } catch (err: any) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: err?.message || "Failed to load transactions",
      }));
    }
  }, []);

  useEffect(() => {
    activeFilters.current = state.filters;
    activePage.current = state.page;
    doFetch(state.filters, state.page);
  }, [state.filters, state.page, doFetch]);

  const setFilters = useCallback((filters: TransactionFilters) => {
    setState((prev) => ({ ...prev, filters, page: 1 }));
  }, []);

  const setPage = useCallback((page: number) => {
    setState((prev) => ({ ...prev, page }));
  }, []);

  const refresh = useCallback(() => {
    doFetch(activeFilters.current, activePage.current);
  }, [doFetch]);

  return (
    <TransactionContext.Provider value={{ ...state, setFilters, setPage, refresh }}>
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactions(): TransactionContextType {
  const ctx = useContext(TransactionContext);
  if (!ctx) throw new Error("useTransactions must be used within a TransactionProvider");
  return ctx;
}
