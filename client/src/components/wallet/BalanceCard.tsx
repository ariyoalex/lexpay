import { Box, Chip, Paper, Typography } from "@mui/material";

import { type WalletBalance } from "@/services/walletApi";

interface BalanceCardProps {
  balance: WalletBalance;
  isFrozen?: boolean;
  onRefresh?: () => void;
}

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency }).format(amount);
}

export default function BalanceCard({ balance, isFrozen, onRefresh }: BalanceCardProps) {
  return (
    <Paper
      sx={{
        p: 4,
        background: isFrozen
          ? "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
          : "linear-gradient(135deg, #6F9C3E 0%, #4a7a2a 100%)",
        color: "white",
        borderRadius: 3,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box sx={{ position: "relative", zIndex: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="overline" sx={{ opacity: 0.85, letterSpacing: 1 }}>
            Available Balance
          </Typography>
          {isFrozen && (
            <Chip
              label="Frozen"
              size="small"
              sx={{ bgcolor: "rgba(255,255,255,0.25)", color: "white", fontWeight: 600 }}
            />
          )}
        </Box>

        <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, fontFamily: "monospace" }}>
          {formatCurrency(balance.balance, balance.currency)}
        </Typography>

        <Box sx={{ display: "flex", gap: 4, mt: 2 }}>
          <Box>
            <Typography variant="caption" sx={{ opacity: 0.75 }}>
              Ledger Balance
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {formatCurrency(balance.ledgerBalance, balance.currency)}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ opacity: 0.75 }}>
              Pending
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {formatCurrency(balance.pendingBalance, balance.currency)}
            </Typography>
          </Box>
        </Box>

        {onRefresh && (
          <Box sx={{ mt: 2, textAlign: "right" }}>
            <Typography
              variant="caption"
              onClick={onRefresh}
              sx={{ cursor: "pointer", opacity: 0.7, "&:hover": { opacity: 1 }, textDecoration: "underline" }}
            >
              Refresh
            </Typography>
          </Box>
        )}
      </Box>

      <Box
        sx={{
          position: "absolute",
          top: -60,
          right: -60,
          width: 200,
          height: 200,
          borderRadius: "50%",
          bgcolor: "rgba(255,255,255,0.08)",
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: -40,
          left: -40,
          width: 140,
          height: 140,
          borderRadius: "50%",
          bgcolor: "rgba(255,255,255,0.05)",
          zIndex: 0,
        }}
      />
    </Paper>
  );
}
