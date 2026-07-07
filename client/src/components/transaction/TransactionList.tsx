import TransactionItem from "./TransactionItem";

import { Box, Typography } from "@mui/material";

import { type Transaction } from "@/services/transactionApi";

interface TransactionListProps {
  transactions: Transaction[];
}

export default function TransactionList({ transactions }: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 6 }}>
        No transactions found.
      </Typography>
    );
  }

  return (
    <Box sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2, overflow: "hidden" }}>
      {transactions.map((tx) => (
        <TransactionItem key={tx._id} transaction={tx} />
      ))}
    </Box>
  );
}
