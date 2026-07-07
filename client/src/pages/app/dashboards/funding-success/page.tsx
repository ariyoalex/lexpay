import { useNavigate, useSearchParams } from "react-router-dom";

import { Box, Button, Paper, Typography } from "@mui/material";

export default function Page() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const reference = params.get("reference") || "";
  const amount = params.get("amount") || "0";

  return (
    <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
      <Paper
        sx={{
          p: 6,
          maxWidth: 480,
          textAlign: "center",
          borderRadius: 3,
        }}
      >
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
          Funding Successful!
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Your wallet has been funded with
        </Typography>

        <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, color: "primary.main" }}>
          {new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(Number(amount))}
        </Typography>

        {reference && (
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 4 }}>
            Reference: {reference}
          </Typography>
        )}

        <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
          <Button variant="contained" onClick={() => navigate("/dashboards/wallet")}>
            View Wallet
          </Button>
          <Button variant="outlined" onClick={() => navigate("/dashboards/fund-wallet")}>
            Fund Again
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
