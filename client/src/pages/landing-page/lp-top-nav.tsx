import { Link } from "react-router-dom";

import { Box, Button } from "@mui/material";

import Logo from "@/components/logo/logo";

export default function LPTopNav() {
  return (
    <Box className="flex h-16 w-full flex-none items-center justify-between">
      <Logo classNameFull="hidden sm:block" classNameMobile="sm:hidden" />

      <Box className="flex flex-row gap-1">
        <Button
          className="min-w-0! px-2! lg:px-4!"
          variant="text"
          size="large"
          color="text-primary"
          to="/auth/sign-in"
          component={Link}
        >
          Sign In
        </Button>
        <Button
          className="min-w-0! px-2! lg:px-4!"
          variant="contained"
          size="large"
          to="/auth/sign-up"
          component={Link}
        >
          Get Started
        </Button>
      </Box>
    </Box>
  );
}
