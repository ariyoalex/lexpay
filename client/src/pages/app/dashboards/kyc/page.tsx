import { useCallback, useEffect, useState } from "react";

import { Box, Button, Chip, CircularProgress, MenuItem, Paper, Select, Typography } from "@mui/material";

import { getKycStatusApi, type KycStatus, submitKycApi } from "@/services/kycApi";

export default function Page() {
  const [status, setStatus] = useState<KycStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [idType, setIdType] = useState("national_id");
  const [idNumber, setIdNumber] = useState("");
  const [addressProofType, setAddressProofType] = useState("utility_bill");
  const [files, setFiles] = useState<{ idFront?: File; idBack?: File; selfie?: File; addressDocument?: File }>({});

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getKycStatusApi();
      setStatus(res.data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const handleFileChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFiles((prev) => ({ ...prev, [field]: file }));
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("level", "2");
    formData.append("idType", idType);
    formData.append("idNumber", idNumber);
    formData.append("addressProofType", addressProofType);
    if (files.idFront) formData.append("idFront", files.idFront);
    if (files.idBack) formData.append("idBack", files.idBack);
    if (files.selfie) formData.append("selfie", files.selfie);
    if (files.addressDocument) formData.append("addressDocument", files.addressDocument);

    setSubmitting(true);
    try {
      await submitKycApi(formData);
      await fetchStatus();
    } catch {
      // ignore
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Box sx={{ maxWidth: 600, mx: "auto" }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        KYC Verification
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Current Level: Level {status?.kycLevel || 0}
        </Typography>
        <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
          <Chip label="Email Verified" color={status?.isEmailVerified ? "success" : "default"} size="small" />
          <Chip label="Phone Verified" color={status?.isPhoneVerified ? "success" : "default"} size="small" />
        </Box>
        {status?.kycSubmission && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2">
              Submission Status:{" "}
              <Chip
                label={status.kycSubmission.status}
                color={
                  status.kycSubmission.status === "approved"
                    ? "success"
                    : status.kycSubmission.status === "rejected"
                      ? "error"
                      : "warning"
                }
                size="small"
              />
            </Typography>
            {status.kycSubmission.status === "rejected" && (
              <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                Reason: {status.kycSubmission.rejectionReason}
              </Typography>
            )}
          </Box>
        )}
      </Paper>

      {status?.canUpgrade && !status.kycSubmission?.status?.includes("pending") && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Upgrade to Level 2
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Select value={idType} onChange={(e) => setIdType(e.target.value)} size="small">
              <MenuItem value="national_id">National ID</MenuItem>
              <MenuItem value="driver_license">Driver License</MenuItem>
              <MenuItem value="passport">Passport</MenuItem>
              <MenuItem value="voter_card">Voter Card</MenuItem>
            </Select>

            <input
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
              placeholder="ID Number"
              style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
            />

            <Select value={addressProofType} onChange={(e) => setAddressProofType(e.target.value)} size="small">
              <MenuItem value="utility_bill">Utility Bill</MenuItem>
              <MenuItem value="bank_statement">Bank Statement</MenuItem>
              <MenuItem value="rent_agreement">Rent Agreement</MenuItem>
            </Select>

            <input type="file" onChange={handleFileChange("idFront")} accept="image/*" />
            <input type="file" onChange={handleFileChange("idBack")} accept="image/*" />
            <input type="file" onChange={handleFileChange("selfie")} accept="image/*" />
            <input type="file" onChange={handleFileChange("addressDocument")} accept="image/*" />

            <Button variant="contained" onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Submitting..." : "Submit KYC"}
            </Button>
          </Box>
        </Paper>
      )}
    </Box>
  );
}
