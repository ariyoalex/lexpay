import { Box, Button, Paper, Typography } from "@mui/material";

interface TransferSuccessProps {
  result: {
    reference: string;
    amount: number;
    fee: number;
    totalDebit: number;
    senderBalanceAfter: number;
    recipient?: string;
    beneficiary?: string;
  };
  onDone: () => void;
  onNewTransfer: () => void;
}

export default function TransferSuccess({ result, onDone, onNewTransfer }: TransferSuccessProps) {
  return (
    <Paper sx={{ p: 6, maxWidth: 480, textAlign: "center", borderRadius: 3 }}>
      <Box
        sx={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          bgcolor: "success.light",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mx: "auto",
          mb: 3,
        }}
      >
        <Typography variant="h3" sx={{ color: "white" }}>
          ✓
        </Typography>
      </Box>

      <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
        Transfer Successful!
      </Typography>

      <Box sx={{ bgcolor: "grey.50", p: 3, borderRadius: 2, textAlign: "left", mb: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Amount
          </Typography>
          <Typography fontWeight={600}>
            {new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(result.amount)}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Fee
          </Typography>
          <Typography fontWeight={600}>
            {new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(result.fee)}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Reference
          </Typography>
          <Typography fontWeight={600} variant="body2">
            {result.reference}
          </Typography>
        </Box>
        {result.recipient && (
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2" color="text.secondary">
              To
            </Typography>
            <Typography fontWeight={600}>{result.recipient}</Typography>
          </Box>
        )}
        {result.beneficiary && (
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2" color="text.secondary">
              To
            </Typography>
            <Typography fontWeight={600}>{result.beneficiary}</Typography>
          </Box>
        )}
      </Box>

      <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
        <Button variant="contained" onClick={onDone}>
          Done
        </Button>
        <Button variant="outlined" onClick={onNewTransfer}>
          New Transfer
        </Button>
      </Box>
    </Paper>
  );
}
