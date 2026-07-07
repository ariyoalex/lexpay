import { useState } from "react";

import { Box, Button, FormControl, FormLabel, Input, Paper, Step, StepLabel, Stepper, Typography } from "@mui/material";

import PinInput from "@/components/common/PinInput";
import { ApiError } from "@/services/api";
import { type Beneficiary } from "@/services/beneficiaryApi";
import {
  calculateFeesApi,
  externalTransferApi,
  internalTransferApi,
  requestTransferOtpApi,
} from "@/services/transferApi";

interface TransferFormProps {
  type: "internal" | "external";
  beneficiaries?: Beneficiary[];
  onSuccess: (result: any) => void;
}

const STEPS = ["Amount", "Recipient", "Confirm", "PIN"];

export default function TransferForm({ type, beneficiaries, onSuccess }: TransferFormProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [amount, setAmount] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<Beneficiary | null>(null);
  const [description, setDescription] = useState("");
  const [pin, setPin] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpRequired, setOtpRequired] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [fee, setFee] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNext = async () => {
    setError(null);
    if (activeStep === 0) {
      const num = Number(amount);
      if (!num || num < 100) {
        setError("Minimum amount is ₦100");
        return;
      }
      try {
        const res = await calculateFeesApi(num, type);
        setFee(res.data.fee);
        setActiveStep(1);
      } catch (err: any) {
        setError(err?.message || "Failed to calculate fee");
      }
    } else if (activeStep === 1) {
      if (type === "internal" && !recipientEmail && !recipientPhone) {
        setError("Enter recipient email or phone");
        return;
      }
      if (type === "external" && !selectedBeneficiary) {
        setError("Select a beneficiary");
        return;
      }
      setActiveStep(2);
    } else if (activeStep === 2) {
      setActiveStep(3);
    } else if (activeStep === 3) {
      if (pin.length !== 4) {
        setError("Enter your 4-digit PIN");
        return;
      }
      if (Number(amount) >= 50000 && otpRequired && otpCode.length !== 6) {
        setError("Enter the OTP sent to you");
        return;
      }
      await submitTransfer();
    }
  };

  const handleRequestOtp = async () => {
    try {
      await requestTransferOtpApi();
      setOtpSent(true);
      setOtpRequired(true);
    } catch (err: any) {
      setError(err?.message || "Failed to send OTP");
    }
  };

  const submitTransfer = async () => {
    setLoading(true);
    setError(null);
    try {
      let result: any;
      if (type === "internal") {
        result = await internalTransferApi({
          recipientEmail: recipientEmail || undefined,
          recipientPhone: recipientPhone || undefined,
          amount: Number(amount),
          description,
          pin,
          otpCode: otpCode || undefined,
        });
      } else {
        result = await externalTransferApi({
          beneficiaryId: selectedBeneficiary!._id,
          amount: Number(amount),
          description,
          pin,
          otpCode: otpCode || undefined,
        });
      }
      onSuccess(result.data);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.message.includes("OTP required") || err.message.includes("OTP sent")) {
          setOtpRequired(true);
          setOtpSent(true);
          setActiveStep(3);
        }
        setError(err.message);
      } else {
        setError("Transfer failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 520, borderRadius: 2 }}>
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {STEPS.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {error && (
        <Typography color="error" variant="body2" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {activeStep === 0 && (
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Enter Amount
          </Typography>
          <FormControl fullWidth>
            <FormLabel>Amount (NGN)</FormLabel>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 5000"
              sx={{ fontSize: "1.5rem", py: 1 }}
            />
          </FormControl>
        </Box>
      )}

      {activeStep === 1 && type === "internal" && (
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Recipient
          </Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <FormLabel>Email</FormLabel>
            <Input
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              placeholder="user@example.com"
            />
          </FormControl>
          <FormControl fullWidth>
            <FormLabel>Phone</FormLabel>
            <Input
              value={recipientPhone}
              onChange={(e) => setRecipientPhone(e.target.value)}
              placeholder="+2348012345678"
            />
          </FormControl>
        </Box>
      )}

      {activeStep === 1 && type === "external" && beneficiaries && (
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Select Beneficiary
          </Typography>
          {beneficiaries.map((b) => (
            <Paper
              key={b._id}
              onClick={() => setSelectedBeneficiary(b)}
              sx={{
                p: 2,
                mb: 1,
                cursor: "pointer",
                border: "2px solid",
                borderColor: selectedBeneficiary?._id === b._id ? "primary.main" : "transparent",
                bgcolor: selectedBeneficiary?._id === b._id ? "primary.50" : "background.paper",
                borderRadius: 2,
              }}
            >
              <Typography fontWeight={600}>{b.name}</Typography>
              <Typography variant="caption" color="text.secondary">
                {b.bank} &middot; {b.accountNumber}
              </Typography>
            </Paper>
          ))}
        </Box>
      )}

      {activeStep === 2 && (
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Review & Confirm
          </Typography>
          <Box sx={{ bgcolor: "grey.50", p: 2, borderRadius: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Amount
            </Typography>
            <Typography variant="h5" fontWeight={700}>
              {new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(Number(amount))}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Fee: {new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(fee)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total:{" "}
              {new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(Number(amount) + fee)}
            </Typography>
            {description && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Note: {description}
              </Typography>
            )}
          </Box>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <FormLabel>Description (optional)</FormLabel>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this for?"
            />
          </FormControl>
        </Box>
      )}

      {activeStep === 3 && (
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Enter PIN
          </Typography>
          <PinInput value={pin} onChange={setPin} error={!!error} disabled={loading} />
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
            Enter your 4-digit transaction PIN
          </Typography>

          {Number(amount) >= 50000 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Amount exceeds ₦50,000. OTP required.
              </Typography>
              {otpSent ? (
                <>
                  <PinInput value={otpCode} onChange={setOtpCode} length={6} />
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
                    Enter the 6-digit OTP code
                  </Typography>
                </>
              ) : (
                <Button variant="outlined" onClick={handleRequestOtp} disabled={loading}>
                  Send OTP
                </Button>
              )}
            </Box>
          )}
        </Box>
      )}

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
        <Button disabled={activeStep === 0} onClick={() => setActiveStep((s) => s - 1)}>
          Back
        </Button>
        <Button variant="contained" onClick={handleNext} disabled={loading}>
          {activeStep === STEPS.length - 1 ? (loading ? "Processing..." : "Send") : "Continue"}
        </Button>
      </Box>
    </Paper>
  );
}
