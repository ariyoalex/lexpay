import { useEffect, useState } from "react";

import { Box, Paper, Typography } from "@mui/material";

import { type DashboardStats, getDashboardStatsApi } from "@/services/manageApi";

export default function Page() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStatsApi()
      .then((res) => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Typography>Loading...</Typography>;
  if (!stats) return <Typography color="error">Failed to load stats</Typography>;

  const cards = [
    { label: "Total Users", value: stats.totalUsers, color: "primary.main" },
    { label: "Active Users", value: stats.activeUsers, color: "success.main" },
    { label: "Total Balance", value: `₦${stats.totalBalance.toLocaleString()}`, color: "info.main" },
    { label: "Today's Txns", value: stats.dailyTransactions, color: "warning.main" },
    { label: "Failed Txns", value: stats.failedTransactions, color: "error.main" },
    { label: "Total Revenue", value: `₦${stats.totalRevenue.toLocaleString()}`, color: "success.main" },
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        Manage Dashboard
      </Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 2 }}>
        {cards.map((card) => (
          <Paper key={card.label} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {card.label}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, color: card.color }}>
              {card.value}
            </Typography>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}
