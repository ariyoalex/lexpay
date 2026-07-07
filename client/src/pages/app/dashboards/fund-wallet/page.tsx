import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Box, Breadcrumbs, Button, FormControl, FormLabel, Input, Link, Paper, Typography } from "@mui/material";

import { useWallet } from "@/contexts/WalletContext";
import { ApiError } from "@/services/api";
import { type FundingMethod, getFundingMethodsApi, initializePaymentApi } from "@/services/paymentApi";

export default function Page() {
  const navigate = useNavigate();
  const { refreshBalance } = useWallet();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [methods, setMethods] = useState<FundingMethod[]>([]);

  useEffect(() => {
    getFundingMethodsApi()
      .then((res) => setMethods(res.data))
      .catch(() => {});
  }, []);

  const handleSubmit = async () => {
    const numAmount = Number(amount);
    if (!numAmount || numAmount < 100) {
      setError("Minimum funding amount is ₦100");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await initializePaymentApi(numAmount);
      const { authorizationUrl, reference } = res.data;
      const paystackRef = reference;

      const popup = window.open("", "Paystack Payment", "width=800,height=600");
      if (popup) {
        popup.location.href = authorizationUrl;
      } else {
        window.location.href = authorizationUrl;
      }

      const checkInterval = setInterval(async () => {
        try {
          const verifyRes = await import("@/services/paymentApi").then((m) => m.verifyPaymentApi(paystackRef));
          if (verifyRes.data.status === "completed") {
            clearInterval(checkInterval);
            await refreshBalance();
            navigate(`/dashboards/funding-success?reference=${paystackRef}&amount=${numAmount}`);
          }
        } catch {
          // still pending
        }
      }, 3000);

      setTimeout(() => clearInterval(checkInterval), 5 * 60 * 1000);
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError("Failed to initialize payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link underline="hover" color="inherit" href="/dashboards/default">
          Dashboard
        </Link>
        <Link underline="hover" color="inherit" href="/dashboards/wallet">
          Wallet
        </Link>
        <Typography color="text.primary">Fund Wallet</Typography>
      </Breadcrumbs>

      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
        Fund Wallet
      </Typography>

      <Paper sx={{ p: 4, maxWidth: 500, borderRadius: 2 }}>
        {error && (
          <Typography color="error" variant="body2" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <FormControl fullWidth sx={{ mb: 3 }}>
          <FormLabel sx={{ mb: 1, fontWeight: 500 }}>Amount (NGN)</FormLabel>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g. 5000"
            sx={{ fontSize: "1.5rem", py: 1 }}
            disabled={loading}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
            Min: ₦100 &middot; Max: ₦10,000,000
          </Typography>
        </FormControl>

        {methods.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Payment Method
            </Typography>
            {methods.map((m) => (
              <Box
                key={m.id}
                sx={{
                  p: 2,
                  border: "1px solid",
                  borderColor: "primary.main",
                  borderRadius: 2,
                  bgcolor: "primary.50",
                }}
              >
                <Typography variant="body2" fontWeight={600}>
                  {m.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {m.description}
                </Typography>
              </Box>
            ))}
          </Box>
        )}

        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={handleSubmit}
          disabled={loading || !amount}
          sx={{ py: 1.5 }}
        >
          {loading ? "Processing..." : "Continue to Payment"}
        </Button>
      </Paper>
    </Box>
  );
}
