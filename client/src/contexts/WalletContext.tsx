import { createContext, type ReactNode, useCallback, useContext, useEffect, useState } from "react";

import { getBalanceApi, getWalletSummaryApi, type WalletBalance, type WalletSummary } from "@/services/walletApi";

interface WalletState {
  balance: WalletBalance | null;
  summary: WalletSummary | null;
  isLoading: boolean;
  error: string | null;
}

interface WalletContextType extends WalletState {
  refreshBalance: () => Promise<void>;
  refreshSummary: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WalletState>({
    balance: null,
    summary: null,
    isLoading: true,
    error: null,
  });

  const refreshBalance = useCallback(async () => {
    try {
      const res = await getBalanceApi();
      setState((prev) => ({ ...prev, balance: res.data, error: null }));
    } catch {
      setState((prev) => ({ ...prev }));
    }
  }, []);

  const refreshSummary = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const res = await getWalletSummaryApi();
      setState({
        balance: res.data,
        summary: res.data,
        isLoading: false,
        error: null,
      });
    } catch (err: any) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: err?.message || "Failed to load wallet",
      }));
    }
  }, []);

  useEffect(() => {
    refreshSummary();
  }, [refreshSummary]);

  return (
    <WalletContext.Provider
      value={{
        ...state,
        refreshBalance,
        refreshSummary,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet(): WalletContextType {
  const ctx = useContext(WalletContext);
  if (!ctx) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return ctx;
}
