import { Box, Chip, LinearProgress, Paper, Typography } from "@mui/material";

import { type WalletSummary as WalletSummaryType } from "@/services/walletApi";

interface WalletSummaryProps {
  summary: WalletSummaryType;
}

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency }).format(amount);
}

export default function WalletSummaryComponent({ summary }: WalletSummaryProps) {
  const dailyPercent = summary.dailyLimit ? (summary.dailySpent / summary.dailyLimit) * 100 : 0;
  const monthlyPercent = summary.monthlyLimit ? (summary.monthlySpent / summary.monthlyLimit) * 100 : 0;

  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Spending Limits
      </Typography>

      {summary.dailyLimit ? (
        <Box sx={{ mb: 2.5 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
            <Typography variant="body2" color="text.secondary">
              Daily Limit
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {formatCurrency(summary.dailySpent, summary.currency)} /{" "}
              {formatCurrency(summary.dailyLimit, summary.currency)}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={Math.min(dailyPercent, 100)}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: "grey.200",
              "& .MuiLinearProgress-bar": {
                bgcolor: dailyPercent > 80 ? "error.main" : dailyPercent > 50 ? "warning.main" : "primary.main",
                borderRadius: 4,
              },
            }}
          />
        </Box>
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          No daily limit set
        </Typography>
      )}

      {summary.monthlyLimit ? (
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
            <Typography variant="body2" color="text.secondary">
              Monthly Limit
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {formatCurrency(summary.monthlySpent, summary.currency)} /{" "}
              {formatCurrency(summary.monthlyLimit, summary.currency)}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={Math.min(monthlyPercent, 100)}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: "grey.200",
              "& .MuiLinearProgress-bar": {
                bgcolor: monthlyPercent > 80 ? "error.main" : monthlyPercent > 50 ? "warning.main" : "primary.main",
                borderRadius: 4,
              },
            }}
          />
        </Box>
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          No monthly limit set
        </Typography>
      )}

      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
        {summary.isFrozen && <Chip label="Frozen" color="error" size="small" />}
        <Chip
          label={summary.isFrozen ? "Inactive" : "Active"}
          color={summary.isFrozen ? "error" : "success"}
          size="small"
          variant={summary.isFrozen ? "filled" : "outlined"}
        />
      </Box>
    </Paper>
  );
}
