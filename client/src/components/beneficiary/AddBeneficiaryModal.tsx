import { useState } from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormLabel,
  Input,
  Typography,
} from "@mui/material";

import NiCrossSquare from "@/icons/nexture/ni-cross-square";
import { ApiError } from "@/services/api";
import { createBeneficiaryApi } from "@/services/beneficiaryApi";

interface AddBeneficiaryModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddBeneficiaryModal({ open, onClose, onSuccess }: AddBeneficiaryModalProps) {
  const [name, setName] = useState("");
  const [bank, setBank] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!name || !bank || accountNumber.length !== 10 || !bankCode) {
      setError("Please fill all fields. Account number must be 10 digits.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await createBeneficiaryApi({ name, bank, accountNumber, bankCode });
      setName("");
      setBank("");
      setAccountNumber("");
      setBankCode("");
      onSuccess();
      onClose();
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError("Failed to add beneficiary");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        Add Beneficiary
        <NiCrossSquare onClick={onClose} style={{ float: "right", cursor: "pointer" }} />
      </DialogTitle>
      <DialogContent>
        {error && (
          <Typography color="error" variant="body2" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <FormControl fullWidth sx={{ mb: 2, mt: 1 }}>
          <FormLabel>Beneficiary Name</FormLabel>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. John Doe" />
        </FormControl>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <FormLabel>Bank Name</FormLabel>
          <Input value={bank} onChange={(e) => setBank(e.target.value)} placeholder="e.g. GTBank" />
        </FormControl>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <FormLabel>Account Number</FormLabel>
          <Input
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
            placeholder="10-digit account number"
          />
        </FormControl>
        <FormControl fullWidth>
          <FormLabel>Bank Code</FormLabel>
          <Input value={bankCode} onChange={(e) => setBankCode(e.target.value)} placeholder="e.g. 058" />
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={loading}>
          {loading ? "Adding..." : "Add Beneficiary"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
