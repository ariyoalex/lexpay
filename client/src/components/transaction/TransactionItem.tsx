import { Box, Chip, Typography } from "@mui/material";

import { type Transaction } from "@/services/transactionApi";

interface TransactionItemProps {
  transaction: Transaction;
}

const typeIcons: Record<string, string> = {
  funding: "↓",
  transfer_in: "↓",
  credit: "↓",
  transfer_out: "↑",
  withdrawal: "↑",
  debit: "↑",
  bill_payment: "↑",
  fee: "•",
  reversal: "↻",
};

export default function TransactionItem({ transaction }: TransactionItemProps) {
  const isCredit = ["credit", "funding", "transfer_in"].includes(transaction.type);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        py: 1.5,
        px: 2,
        borderBottom: "1px solid",
        borderColor: "divider",
        "&:hover": { bgcolor: "action.hover" },
        "&:last-child": { borderBottom: 0 },
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          bgcolor: isCredit ? "success.50" : "error.50",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Typography variant="body1">{typeIcons[transaction.type] || "•"}</Typography>
      </Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="body2" fontWeight={600} noWrap>
          {transaction.description || transaction.type.replace("_", " ")}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {new Date(transaction.createdAt).toLocaleDateString("en-NG", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Typography>
      </Box>

      <Box sx={{ textAlign: "right", flexShrink: 0 }}>
        <Typography variant="body2" fontWeight={600} color={isCredit ? "success.main" : "error.main"}>
          {isCredit ? "+" : "-"}
          {new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(transaction.amount)}
        </Typography>
        <Chip
          label={transaction.status}
          size="small"
          color={transaction.status === "completed" ? "success" : transaction.status === "failed" ? "error" : "warning"}
          sx={{ height: 20, fontSize: "0.65rem" }}
        />
      </Box>
    </Box>
  );
}
