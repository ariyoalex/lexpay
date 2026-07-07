import { useState } from "react";

import {
  Box,
  Breadcrumbs,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormLabel,
  Input,
  Link,
  Typography,
} from "@mui/material";

import BalanceCard from "@/components/wallet/BalanceCard";
import WalletSummaryComponent from "@/components/wallet/WalletSummary";
import { useWallet } from "@/contexts/WalletContext";
import NiCrossSquare from "@/icons/nexture/ni-cross-square";
import { ApiError } from "@/services/api";
import { freezeWalletApi, unfreezeWalletApi, updateLimitsApi } from "@/services/walletApi";

export default function Page() {
  const { balance, summary, isLoading, error, refreshBalance, refreshSummary } = useWallet();

  const [limitsOpen, setLimitsOpen] = useState(false);
  const [dailyLimit, setDailyLimit] = useState("");
  const [monthlyLimit, setMonthlyLimit] = useState("");
  const [limitsError, setLimitsError] = useState<string | null>(null);

  const [freezeOpen, setFreezeOpen] = useState(false);
  const [freezeReason, setFreezeReason] = useState("");
  const [freezeError, setFreezeError] = useState<string | null>(null);

  const [actionLoading, setActionLoading] = useState(false);

  const handleUpdateLimits = async () => {
    setLimitsError(null);
    setActionLoading(true);
    try {
      await updateLimitsApi({
        dailyLimit: dailyLimit ? Number(dailyLimit) : undefined,
        monthlyLimit: monthlyLimit ? Number(monthlyLimit) : undefined,
      });
      setLimitsOpen(false);
      refreshSummary();
    } catch (err) {
      if (err instanceof ApiError) setLimitsError(err.message);
      else setLimitsError("Failed to update limits");
    } finally {
      setActionLoading(false);
    }
  };

  const handleFreeze = async () => {
    setFreezeError(null);
    setActionLoading(true);
    try {
      await freezeWalletApi(freezeReason || "User requested");
      setFreezeOpen(false);
      refreshSummary();
    } catch (err) {
      if (err instanceof ApiError) setFreezeError(err.message);
      else setFreezeError("Failed to freeze wallet");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnfreeze = async () => {
    setActionLoading(true);
    try {
      await unfreezeWalletApi();
      refreshSummary();
    } catch {
      // ignore
    } finally {
      setActionLoading(false);
    }
  };

  if (isLoading) {
    return <Typography>Loading wallet...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link underline="hover" color="inherit" href="/dashboards/default">
          Dashboard
        </Link>
        <Typography color="text.primary">Wallet</Typography>
      </Breadcrumbs>

      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
        My Wallet
      </Typography>

      {balance && (
        <Box sx={{ mb: 3 }}>
          <BalanceCard balance={balance} isFrozen={summary?.isFrozen} onRefresh={refreshBalance} />
        </Box>
      )}

      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        <Button variant="contained" onClick={() => setLimitsOpen(true)} disabled={summary?.isFrozen}>
          Update Limits
        </Button>
        {summary?.isFrozen ? (
          <Button variant="outlined" color="success" onClick={handleUnfreeze} disabled={actionLoading}>
            Unfreeze Wallet
          </Button>
        ) : (
          <Button variant="outlined" color="error" onClick={() => setFreezeOpen(true)}>
            Freeze Wallet
          </Button>
        )}
      </Box>

      {summary && <WalletSummaryComponent summary={summary} />}

      {summary?.recentTransactions && summary.recentTransactions.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Recent Transactions
          </Typography>
          {summary.recentTransactions.map((tx: any) => (
            <Box
              key={tx._id}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                py: 1.5,
                px: 2,
                borderBottom: "1px solid",
                borderColor: "divider",
                "&:last-child": { borderBottom: 0 },
              }}
            >
              <Box>
                <Typography variant="body2" fontWeight={500}>
                  {tx.description || tx.type}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {tx.type} &middot; {new Date(tx.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
              <Typography variant="body2" fontWeight={600} color={tx.amount > 0 ? "success.main" : "error.main"}>
                {tx.amount > 0 ? "+" : ""}
                {new Intl.NumberFormat("en-NG", {
                  style: "currency",
                  currency: "NGN",
                }).format(tx.amount)}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      <Dialog open={limitsOpen} onClose={() => setLimitsOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>
          Update Spending Limits
          <NiCrossSquare onClick={() => setLimitsOpen(false)} style={{ float: "right", cursor: "pointer" }} />
        </DialogTitle>
        <DialogContent>
          {limitsError && (
            <Typography color="error" variant="body2" sx={{ mb: 2 }}>
              {limitsError}
            </Typography>
          )}
          <FormControl fullWidth sx={{ mb: 2, mt: 1 }}>
            <FormLabel>Daily Limit (NGN)</FormLabel>
            <Input
              type="number"
              value={dailyLimit}
              onChange={(e) => setDailyLimit(e.target.value)}
              placeholder="e.g. 50000"
            />
          </FormControl>
          <FormControl fullWidth>
            <FormLabel>Monthly Limit (NGN)</FormLabel>
            <Input
              type="number"
              value={monthlyLimit}
              onChange={(e) => setMonthlyLimit(e.target.value)}
              placeholder="e.g. 500000"
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLimitsOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdateLimits} disabled={actionLoading}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={freezeOpen} onClose={() => setFreezeOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>
          Freeze Wallet
          <NiCrossSquare onClick={() => setFreezeOpen(false)} style={{ float: "right", cursor: "pointer" }} />
        </DialogTitle>
        <DialogContent>
          {freezeError && (
            <Typography color="error" variant="body2" sx={{ mb: 2 }}>
              {freezeError}
            </Typography>
          )}
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Freezing your wallet will prevent any transactions. You can unfreeze at any time.
          </Typography>
          <FormControl fullWidth>
            <FormLabel>Reason (optional)</FormLabel>
            <Input
              value={freezeReason}
              onChange={(e) => setFreezeReason(e.target.value)}
              placeholder="e.g. Lost phone"
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFreezeOpen(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleFreeze} disabled={actionLoading}>
            Freeze
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
