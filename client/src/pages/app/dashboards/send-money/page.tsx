import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { Box, Breadcrumbs, Link, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";

import TransferForm from "@/components/transfer/TransferForm";
import TransferSuccess from "@/components/transfer/TransferSuccess";
import { type Beneficiary, listBeneficiariesApi } from "@/services/beneficiaryApi";

export default function Page() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialType = (searchParams.get("type") as "internal" | "external") || "internal";
  const [type, setType] = useState<"internal" | "external">(initialType);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [successResult, setSuccessResult] = useState<any>(null);

  useEffect(() => {
    if (type === "external") {
      listBeneficiariesApi()
        .then((res) => setBeneficiaries(res.data))
        .catch(() => {});
    }
  }, [type]);

  const handleTypeChange = (_: any, newType: "internal" | "external") => {
    if (newType) setType(newType);
  };

  if (successResult) {
    return (
      <Box>
        <Breadcrumbs sx={{ mb: 2 }}>
          <Link underline="hover" color="inherit" href="/dashboards/default">
            Dashboard
          </Link>
          <Typography color="text.primary">Send Money</Typography>
        </Breadcrumbs>
        <TransferSuccess
          result={successResult}
          onDone={() => navigate("/dashboards/wallet")}
          onNewTransfer={() => {
            setSuccessResult(null);
            setType("internal");
          }}
        />
      </Box>
    );
  }

  return (
    <Box>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link underline="hover" color="inherit" href="/dashboards/default">
          Dashboard
        </Link>
        <Typography color="text.primary">Send Money</Typography>
      </Breadcrumbs>

      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
        Send Money
      </Typography>

      <ToggleButtonGroup value={type} exclusive onChange={handleTypeChange} sx={{ mb: 3 }}>
        <ToggleButton value="internal">To LexPay User</ToggleButton>
        <ToggleButton value="external">To Bank Account</ToggleButton>
      </ToggleButtonGroup>

      <TransferForm type={type} beneficiaries={beneficiaries} onSuccess={setSuccessResult} />
    </Box>
  );
}
