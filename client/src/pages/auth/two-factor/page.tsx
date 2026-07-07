import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Alert, AlertTitle, Box, Button, FormLabel, Paper, Typography } from "@mui/material";

import OtpInput from "@/components/common/OtpInput";
import Logo from "@/components/logo/logo";
import { DEFAULTS } from "@/config";
import NiCrossSquare from "@/icons/nexture/ni-cross-square";
import { ApiError, post } from "@/services/api";

export default function Page() {
  const navigate = useNavigate();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    const otp = code.join("");
    if (otp.length !== 6) {
      setError("Please enter the full 6-digit code.");
      return;
    }
    setLoading(true);
    try {
      await post("/auth/verify-2fa", { code: otp });
      navigate(DEFAULTS.appRoot);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="bg-waves flex min-h-screen w-full items-center justify-center bg-cover bg-center p-4">
      <Paper elevation={3} className="bg-background-paper shadow-darker-xs w-[32rem] max-w-full rounded-4xl py-14">
        <Box className="flex flex-col gap-4 px-8 sm:px-14">
          <Box className="flex flex-col">
            <Box className="mb-14 flex justify-center">
              <Logo classNameMobile="hidden" />
            </Box>

            <Box className="flex flex-col gap-10">
              <Box className="flex flex-col">
                <Typography variant="h1" component="h1" className="mb-2">
                  Two-Factor Authentication
                </Typography>
                <Typography variant="body1" className="text-text-primary">
                  Enter the 6-digit code from your authenticator app.
                </Typography>
              </Box>

              <Box className="flex flex-col gap-5">
                <Box component={"form"} onSubmit={handleSubmit} className="flex flex-col">
                  <Box className="flex flex-col">
                    <FormLabel component="label">Authentication Code</FormLabel>
                    <OtpInput value={code} onChange={setCode} disabled={loading} />
                  </Box>

                  {error && (
                    <Alert severity="error" icon={<NiCrossSquare />} className="neutral bg-background-paper/60! mt-4">
                      <AlertTitle variant="subtitle2">Error</AlertTitle>
                      <Typography variant="body2">{error}</Typography>
                    </Alert>
                  )}

                  <Box className="mt-4 flex flex-col gap-2">
                    <Button type="submit" variant="contained" className="mb-4" disabled={loading}>
                      {loading ? "Verifying..." : "Verify"}
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
