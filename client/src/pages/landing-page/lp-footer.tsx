import { Link } from "react-router-dom";

import { Box, Button, Typography } from "@mui/material";

export default function LPFooter() {
  return (
    <Box className="border-grey-100 mt-16 flex w-full flex-col items-center border-t py-8">
      <Box className="flex flex-row flex-wrap justify-center gap-1 px-4">
        <Button
          className="min-w-0! px-2! lg:px-4!"
          variant="text"
          size="small"
          color="text-primary"
          to="/auth/sign-in"
          component={Link}
        >
          Sign In
        </Button>
        <Button
          className="min-w-0! px-2! lg:px-4!"
          variant="text"
          size="small"
          color="text-primary"
          to="/auth/sign-up"
          component={Link}
        >
          Sign Up
        </Button>
        <Button
          className="min-w-0! px-2! lg:px-4!"
          variant="text"
          size="small"
          color="text-primary"
          to="/auth/terms-and-conditions"
          component={Link}
        >
          Terms & Conditions
        </Button>
        <Button
          className="min-w-0! px-2! lg:px-4!"
          variant="text"
          size="small"
          color="text-primary"
          to="/auth/privacy-policy"
          component={Link}
        >
          Privacy Policy
        </Button>
      </Box>
      <Typography variant="body2" className="text-text-secondary mt-4">
        &copy; {new Date().getFullYear()} LexPay. All rights reserved.
      </Typography>
    </Box>
  );
}
