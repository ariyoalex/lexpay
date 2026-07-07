import { useFormik } from "formik";
import { useState } from "react";
import { Link } from "react-router-dom";
import * as yup from "yup";

import {
  Alert,
  AlertTitle,
  Box,
  Breadcrumbs,
  Button,
  FormControl,
  FormLabel,
  Input,
  Paper,
  Typography,
} from "@mui/material";

import NiCrossSquare from "@/icons/nexture/ni-cross-square";
import { ApiError } from "@/services/api";
import { changePasswordApi, changePinApi } from "@/services/userApi";

const passwordSchema = yup.object({
  currentPassword: yup.string().required("Required"),
  newPassword: yup.string().min(8, "Min 8 characters").required("Required"),
});

const pinSchema = yup.object({
  currentPin: yup.string().length(4, "Must be 4 digits"),
  newPin: yup.string().length(4, "Must be 4 digits").required("Required"),
});

export default function Page() {
  const [passSuccess, setPassSuccess] = useState(false);
  const [passError, setPassError] = useState<string | null>(null);
  const [pinSuccess, setPinSuccess] = useState(false);
  const [pinError, setPinError] = useState<string | null>(null);

  const passForm = useFormik({
    initialValues: { currentPassword: "", newPassword: "" },
    validationSchema: passwordSchema,
    onSubmit: async (values) => {
      setPassError(null);
      setPassSuccess(false);
      try {
        await changePasswordApi(values);
        setPassSuccess(true);
        passForm.resetForm();
      } catch (err) {
        if (err instanceof ApiError) setPassError(err.message);
        else setPassError("An unexpected error occurred.");
      }
    },
  });

  const pinForm = useFormik({
    initialValues: { currentPin: "", newPin: "" },
    validationSchema: pinSchema,
    onSubmit: async (values) => {
      setPinError(null);
      setPinSuccess(false);
      try {
        await changePinApi({ currentPin: values.currentPin || undefined, newPin: values.newPin });
        setPinSuccess(true);
        pinForm.resetForm();
      } catch (err) {
        if (err instanceof ApiError) setPinError(err.message);
        else setPinError("An unexpected error occurred.");
      }
    },
  });

  return (
    <Box>
      <Box className="mb-6">
        <Typography variant="h1" component="h1" className="mb-0">
          Security
        </Typography>
        <Breadcrumbs>
          <Link color="inherit" to="/dashboards/default">
            Home
          </Link>
          <Link color="inherit" to="/settings">
            Settings
          </Link>
          <Typography variant="body2">Security</Typography>
        </Breadcrumbs>
      </Box>

      <Paper className="mb-6 p-6">
        <Typography variant="h5" className="mb-4">
          Change Password
        </Typography>
        <Box
          component="form"
          onSubmit={(e) => {
            passForm.handleSubmit(e);
          }}
          className="mx-auto flex max-w-md flex-col gap-4"
        >
          <FormControl variant="standard" size="small">
            <FormLabel>Current Password</FormLabel>
            <Input
              name="currentPassword"
              type="password"
              value={passForm.values.currentPassword}
              onChange={passForm.handleChange}
            />
          </FormControl>
          <FormControl variant="standard" size="small">
            <FormLabel>New Password</FormLabel>
            <Input
              name="newPassword"
              type="password"
              value={passForm.values.newPassword}
              onChange={passForm.handleChange}
            />
          </FormControl>
          {passError && (
            <Alert severity="error" icon={<NiCrossSquare />}>
              <AlertTitle>Error</AlertTitle>
              {passError}
            </Alert>
          )}
          {passSuccess && <Alert severity="success">Password changed successfully.</Alert>}
          <Button type="submit" variant="contained">
            Change Password
          </Button>
        </Box>
      </Paper>

      <Paper className="p-6">
        <Typography variant="h5" className="mb-4">
          Change Transaction PIN
        </Typography>
        <Box
          component="form"
          onSubmit={(e) => {
            pinForm.handleSubmit(e);
          }}
          className="mx-auto flex max-w-md flex-col gap-4"
        >
          <FormControl variant="standard" size="small">
            <FormLabel>Current PIN (leave blank if not set)</FormLabel>
            <Input
              name="currentPin"
              type="password"
              inputProps={{ maxLength: 4 }}
              value={pinForm.values.currentPin}
              onChange={pinForm.handleChange}
            />
          </FormControl>
          <FormControl variant="standard" size="small">
            <FormLabel>New PIN (4 digits)</FormLabel>
            <Input
              name="newPin"
              type="password"
              inputProps={{ maxLength: 4 }}
              value={pinForm.values.newPin}
              onChange={pinForm.handleChange}
            />
          </FormControl>
          {pinError && (
            <Alert severity="error" icon={<NiCrossSquare />}>
              <AlertTitle>Error</AlertTitle>
              {pinError}
            </Alert>
          )}
          {pinSuccess && <Alert severity="success">PIN changed successfully.</Alert>}
          <Button type="submit" variant="contained">
            Change PIN
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
