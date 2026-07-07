import { useCallback, useEffect, useState } from "react";

import { Box, MenuItem, Paper, Select, Typography } from "@mui/material";
import { BarChart, LineChart, PieChart } from "@mui/x-charts";

import { getAnalyticsApi } from "@/services/manageApi";

export default function Page() {
  const [days, setDays] = useState(30);
  const [data, setData] = useState<{
    period: string;
    dailyUsers: { _id: string; count: number }[];
    dailyTransactions: { _id: string; count: number; totalAmount: number; totalFees: number }[];
    byType: { _id: string; count: number; total: number }[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAnalyticsApi(days);
      setData(res.data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Analytics
        </Typography>
        <Select value={days} onChange={(e) => setDays(Number(e.target.value))} size="small" sx={{ minWidth: 120 }}>
          <MenuItem value={7}>7 days</MenuItem>
          <MenuItem value={30}>30 days</MenuItem>
          <MenuItem value={90}>90 days</MenuItem>
        </Select>
      </Box>

      {loading ? (
        <Typography>Loading...</Typography>
      ) : !data ? (
        <Typography color="error">Failed to load</Typography>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Daily New Users
            </Typography>
            <LineChart
              xAxis={[{ data: data.dailyUsers.map((d) => d._id), scaleType: "band" }]}
              series={[{ data: data.dailyUsers.map((d) => d.count), label: "Users" }]}
              height={300}
            />
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Daily Transactions
            </Typography>
            <BarChart
              xAxis={[{ data: data.dailyTransactions.map((d) => d._id), scaleType: "band" }]}
              series={[
                { data: data.dailyTransactions.map((d) => d.count), label: "Count" },
                { data: data.dailyTransactions.map((d) => d.totalAmount), label: "Amount" },
              ]}
              height={300}
            />
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Transaction Breakdown by Type
            </Typography>
            <PieChart
              series={[
                {
                  data: data.byType.map((t) => ({ id: t._id, value: t.count, label: t._id })),
                },
              ]}
              height={300}
            />
          </Paper>
        </Box>
      )}
    </Box>
  );
}
