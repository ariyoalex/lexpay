import LPFooter from "./landing-page/lp-footer";
import LPHero from "./landing-page/lp-hero";
import LPTopNav from "./landing-page/lp-top-nav";

import { Box, Card, Grid, Typography } from "@mui/material";

import NiBag from "@/icons/nexture/ni-bag";
import NiCells from "@/icons/nexture/ni-cells";
import NiChartBar from "@/icons/nexture/ni-chart-bar";
import NiFlash from "@/icons/nexture/ni-flash";
import NiSendUpRight from "@/icons/nexture/ni-send-up-right";
import NiShieldCheck from "@/icons/nexture/ni-shield-check";

export default function Home() {
  return (
    <>
      <Box className="bg-background mx-auto flex min-h-[100dvh] w-[100rem] max-w-full flex-col items-center px-4 py-0 md:px-8">
        <LPTopNav />
        <LPHero />

        <Box className="mb-20 w-[75rem] max-w-full">
          <Box className="mb-12 text-center">
            <Typography variant="h2" component="h2" className="mb-4">
              Everything you need to manage your money
            </Typography>
            <Typography variant="body1" className="text-text-secondary mx-auto max-w-xl">
              From sending money to paying bills, LexPay gives you the tools to take control of your finances.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid size={{ lg: 4, md: 6, xs: 12 }}>
              <Card className="flex flex-col items-center p-6 text-center">
                <Box className="bg-primary-light/10 mb-4 flex h-16 w-16 items-center justify-center rounded-2xl">
                  <NiSendUpRight className="text-primary" size="large" />
                </Box>
                <Typography variant="h5" className="mb-2 font-semibold">
                  Send Money
                </Typography>
                <Typography variant="body2" className="text-text-secondary">
                  Transfer money instantly to other LexPay users or bank accounts across Nigeria.
                </Typography>
              </Card>
            </Grid>
            <Grid size={{ lg: 4, md: 6, xs: 12 }}>
              <Card className="flex flex-col items-center p-6 text-center">
                <Box className="bg-secondary-light/10 mb-4 flex h-16 w-16 items-center justify-center rounded-2xl">
                  <NiFlash className="text-secondary" size="large" />
                </Box>
                <Typography variant="h5" className="mb-2 font-semibold">
                  Pay Bills
                </Typography>
                <Typography variant="body2" className="text-text-secondary">
                  Pay electricity, cable TV, buy airtime and data bundles from your wallet.
                </Typography>
              </Card>
            </Grid>
            <Grid size={{ lg: 4, md: 6, xs: 12 }}>
              <Card className="flex flex-col items-center p-6 text-center">
                <Box className="bg-accent-1-light/10 mb-4 flex h-16 w-16 items-center justify-center rounded-2xl">
                  <NiBag className="text-accent-1" size="large" />
                </Box>
                <Typography variant="h5" className="mb-2 font-semibold">
                  Wallet Funding
                </Typography>
                <Typography variant="body2" className="text-text-secondary">
                  Fund your wallet securely via bank transfer or card payments with Paystack.
                </Typography>
              </Card>
            </Grid>
            <Grid size={{ lg: 4, md: 6, xs: 12 }}>
              <Card className="flex flex-col items-center p-6 text-center">
                <Box className="bg-primary-light/10 mb-4 flex h-16 w-16 items-center justify-center rounded-2xl">
                  <NiShieldCheck className="text-primary" size="large" />
                </Box>
                <Typography variant="h5" className="mb-2 font-semibold">
                  Secure & Safe
                </Typography>
                <Typography variant="body2" className="text-text-secondary">
                  Your money and data are protected with enterprise-grade encryption and security.
                </Typography>
              </Card>
            </Grid>
            <Grid size={{ lg: 4, md: 6, xs: 12 }}>
              <Card className="flex flex-col items-center p-6 text-center">
                <Box className="bg-secondary-light/10 mb-4 flex h-16 w-16 items-center justify-center rounded-2xl">
                  <NiChartBar className="text-secondary" size="large" />
                </Box>
                <Typography variant="h5" className="mb-2 font-semibold">
                  Track Spending
                </Typography>
                <Typography variant="body2" className="text-text-secondary">
                  View your transaction history, categorize expenses, and track your financial health.
                </Typography>
              </Card>
            </Grid>
            <Grid size={{ lg: 4, md: 6, xs: 12 }}>
              <Card className="flex flex-col items-center p-6 text-center">
                <Box className="bg-accent-1-light/10 mb-4 flex h-16 w-16 items-center justify-center rounded-2xl">
                  <NiCells className="text-accent-1" size="large" />
                </Box>
                <Typography variant="h5" className="mb-2 font-semibold">
                  Savings Plans
                </Typography>
                <Typography variant="body2" className="text-text-secondary">
                  Set savings goals and auto-deduct from your wallet to build your savings effortlessly.
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>

      <LPFooter />
    </>
  );
}
