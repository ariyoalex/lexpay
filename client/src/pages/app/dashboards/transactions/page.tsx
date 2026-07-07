import { useState } from "react";

import { Box, Breadcrumbs, Button, Link, Pagination, Typography } from "@mui/material";

import TransactionFilter from "@/components/transaction/TransactionFilter";
import TransactionList from "@/components/transaction/TransactionList";
import { useTransactions } from "@/contexts/TransactionContext";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api/v1";

export default function Page() {
  const { transactions, filters, setFilters, setPage, page, totalPages, total, isLoading } = useTransactions();
  const [exporting, setExporting] = useState<string | null>(null);

  const buildExportUrl = (format: "csv" | "pdf") => {
    const params = new URLSearchParams();
    if (filters.type) params.set("type", filters.type);
    if (filters.status) params.set("status", filters.status);
    if (filters.startDate) params.set("startDate", filters.startDate);
    if (filters.endDate) params.set("endDate", filters.endDate);
    return `${API_BASE}/transactions/export/${format}?${params.toString()}`;
  };

  const handleExport = async (format: "csv" | "pdf") => {
    setExporting(format);
    const token = localStorage.getItem("accessToken");
    try {
      const res = await fetch(buildExportUrl(format), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `transactions.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      window.open(buildExportUrl(format), "_blank");
    } finally {
      setExporting(null);
    }
  };

  return (
    <Box>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link underline="hover" color="inherit" href="/dashboards/default">
          Dashboard
        </Link>
        <Typography color="text.primary">Transactions</Typography>
      </Breadcrumbs>

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Transactions
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button size="small" variant="outlined" onClick={() => handleExport("csv")} disabled={exporting === "csv"}>
            {exporting === "csv" ? "..." : "Export CSV"}
          </Button>
          <Button size="small" variant="outlined" onClick={() => handleExport("pdf")} disabled={exporting === "pdf"}>
            {exporting === "pdf" ? "..." : "Export PDF"}
          </Button>
        </Box>
      </Box>

      <TransactionFilter filters={filters} onChange={setFilters} />

      {isLoading ? (
        <Typography>Loading transactions...</Typography>
      ) : (
        <>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {total} transaction{total !== 1 ? "s" : ""}
          </Typography>
          <TransactionList transactions={transactions} />
          {totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <Pagination count={totalPages} page={page} onChange={(_, p) => setPage(p)} color="primary" />
            </Box>
          )}
        </>
      )}
    </Box>
  );
}
