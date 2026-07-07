import { Link } from "react-router-dom";

import { Box, Button, Paper, Typography } from "@mui/material";

export default function LPHero() {
  return (
    <Paper elevation={0} className="3xl:py-12 flex h-full max-w-full items-center justify-center bg-transparent py-20">
      <Box className="flex h-full w-full max-w-300 flex-1 flex-col items-center gap-10">
        <Box className="flex flex-col items-center">
          <Typography
            component="h1"
            variant="h1"
            className="mb-8 text-center text-[3rem] leading-12 font-extrabold md:text-[5rem] md:leading-20"
          >
            Seamless Payments
            <br />
            for Africa's Future
          </Typography>

          <Typography component="p" className="max-w-lg text-center text-[1.125rem] leading-6">
            LexPay lets you send money, pay bills, buy airtime, and manage your finances — all from one platform.
          </Typography>
          <Typography
            component="p"
            className="text-primary mb-4 max-w-lg text-center text-[1.125rem] leading-6 font-semibold"
          >
            Fast. Secure. Reliable.
          </Typography>

          <Box className="mb-12 flex flex-row justify-center gap-2 lg:justify-start">
            <Button size="large" color="primary" variant="contained" to="/auth/sign-up" component={Link}>
              Create Free Account
            </Button>

            <Button size="large" color="primary" variant="pastel" to="/auth/sign-in" component={Link}>
              Sign In
            </Button>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}
