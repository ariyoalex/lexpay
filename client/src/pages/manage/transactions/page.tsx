import { useCallback, useEffect, useState } from "react";

import {
  Box,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import { listManageTransactionsApi } from "@/services/manageApi";

export default function Page() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await listManageTransactionsApi({ limit: "50" });
      setTransactions(res.data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        All Transactions
      </Typography>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Reference</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Type</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Fee</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((tx: any) => (
              <TableRow key={tx._id}>
                <TableCell sx={{ fontFamily: "monospace", fontSize: "0.75rem" }}>{tx.reference?.slice(-12)}</TableCell>
                <TableCell>
                  {tx.userId?.firstName} {tx.userId?.lastName}
                </TableCell>
                <TableCell>{tx.type}</TableCell>
                <TableCell align="right">₦{(tx.amount || 0).toLocaleString()}</TableCell>
                <TableCell align="right">₦{(tx.fee || 0).toLocaleString()}</TableCell>
                <TableCell>
                  <Chip
                    label={tx.status}
                    size="small"
                    color={tx.status === "completed" ? "success" : tx.status === "failed" ? "error" : "warning"}
                  />
                </TableCell>
                <TableCell>{tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : ""}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
